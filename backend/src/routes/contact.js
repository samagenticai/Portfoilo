import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { ContactMessage } from '../models/ContactMessage.js'
import { sendContactNotification } from '../utils/sendEmail.js'

const router = Router()

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many messages. Please try again later.' },
})

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validatePayload(body) {
  const name = String(body?.name || '').trim()
  const email = String(body?.email || '').trim()
  const subject = String(body?.subject || '').trim()
  const message = String(body?.message || '').trim()
  const errors = {}

  if (name.length < 3) errors.name = 'Full Name must be at least 3 characters.'
  if (!email) errors.email = 'Email Address is required.'
  else if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.'
  if (subject.length < 5) errors.subject = 'Subject must be at least 5 characters.'
  if (message.length < 20) errors.message = 'Message must be at least 20 characters.'
  if (message.length > 1000) errors.message = 'Message must be at most 1000 characters.'

  return { valid: Object.keys(errors).length === 0, errors, data: { name, email, subject, message } }
}

router.post('/', contactLimiter, async (req, res) => {
  try {
    const { valid, errors, data } = validatePayload(req.body)
    if (!valid) return res.status(400).json({ message: 'Validation failed', errors })

    const saved = await ContactMessage.create({ ...data, read: false })

    try {
      await sendContactNotification(data)
    } catch (emailErr) {
      console.error('Contact email failed:', emailErr)
    }

    res.status(201).json({
      message: 'Message sent successfully',
      id: String(saved._id),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to send message' })
  }
})

export default router
