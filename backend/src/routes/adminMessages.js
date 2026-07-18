import { Router } from 'express'
import { ContactMessage } from '../models/ContactMessage.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res) => {
  try {
    const { search = '', filter = 'all', page = '1', limit = '10' } = req.query
    const q = {}

    if (search.trim()) {
      q.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { subject: { $regex: search.trim(), $options: 'i' } },
        { message: { $regex: search.trim(), $options: 'i' } },
      ]
    }

    if (filter === 'read') q.read = true
    if (filter === 'unread') q.read = false

    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10))
    const skip = (pageNum - 1) * limitNum

    const [items, total, unread] = await Promise.all([
      ContactMessage.find(q).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      ContactMessage.countDocuments(q),
      ContactMessage.countDocuments({ read: false }),
    ])

    res.set('Cache-Control', 'no-store')
    res.json({
      messages: items.map((m) => ({ ...m, _id: String(m._id), id: String(m._id) })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.max(1, Math.ceil(total / limitNum)),
      },
      unread,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to list messages' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id).lean()
    if (!message) return res.status(404).json({ message: 'Message not found' })
    res.json({ message: { ...message, _id: String(message._id), id: String(message._id) } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to load message' })
  }
})

router.patch('/:id/read', async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read: Boolean(req.body?.read) },
      { new: true },
    ).lean()
    if (!message) return res.status(404).json({ message: 'Message not found' })
    res.json({ message: { ...message, _id: String(message._id), id: String(message._id) } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to update message' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Message not found' })
    res.json({ message: 'Message deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to delete message' })
  }
})

export default router
