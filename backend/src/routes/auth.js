import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import bcrypt from 'bcryptjs'
import { Admin } from '../models/Admin.js'
import {
  clearAuthCookie,
  requireAuth,
  setAuthCookie,
  signToken,
} from '../middleware/auth.js'

const router = Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Try again later.' },
})

const changePasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many password change attempts. Try again later.' },
})

const PASSWORD_POLICY =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

function validateNewPassword(newPassword, confirmPassword) {
  const errors = {}

  if (!PASSWORD_POLICY.test(newPassword)) {
    errors.newPassword =
      'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
  }

  if (newPassword !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const email = String(req.body?.email || '')
      .trim()
      .toLowerCase()
    const password = String(req.body?.password || '')
    const rememberMe = Boolean(req.body?.rememberMe)

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Single-admin system: only the seeded admin can authenticate
    const admin = await Admin.findOne({ email }).select('+passwordHash')
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const ok = await bcrypt.compare(password, admin.passwordHash)
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = signToken(admin, { rememberMe })
    setAuthCookie(res, token, { rememberMe })

    return res.json({
      message: 'Access granted',
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      // Also return token for SPA storage fallback (cookie is primary)
      token,
      rememberMe,
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ message: 'Login failed' })
  }
})

router.post('/logout', (_req, res) => {
  clearAuthCookie(res)
  return res.json({ message: 'Logged out' })
})

router.get('/me', requireAuth, (req, res) => {
  return res.json({
    admin: {
      id: req.admin._id,
      email: req.admin.email,
      name: req.admin.name,
      role: req.admin.role,
    },
  })
})

router.post('/change-password', requireAuth, changePasswordLimiter, async (req, res) => {
  try {
    const currentPassword = String(req.body?.currentPassword || '')
    const newPassword = String(req.body?.newPassword || '')
    const confirmPassword = String(req.body?.confirmPassword || '')

    const errors = {}

    if (!currentPassword) {
      errors.currentPassword = 'Current password is required.'
    }

    Object.assign(errors, validateNewPassword(newPassword, confirmPassword))

    if (currentPassword && newPassword && currentPassword === newPassword) {
      errors.newPassword = 'New password must be different from the current password.'
    }

    if (Object.keys(errors).length) {
      return res.status(400).json({ message: 'Validation failed', errors })
    }

    const admin = await Admin.findById(req.admin._id).select('+passwordHash')
    if (!admin) {
      return res.status(404).json({ message: 'Admin account not found' })
    }

    const matchesCurrent = await bcrypt.compare(currentPassword, admin.passwordHash)
    if (!matchesCurrent) {
      return res.status(401).json({
        message: 'Current password is incorrect',
        errors: { currentPassword: 'Current password is incorrect.' },
      })
    }

    admin.passwordHash = await bcrypt.hash(newPassword, 12)
    await admin.save()

    return res.json({ message: 'Password updated successfully.' })
  } catch (err) {
    console.error('Change password error:', err)
    return res.status(500).json({ message: 'Failed to update password' })
  }
})

export default router
