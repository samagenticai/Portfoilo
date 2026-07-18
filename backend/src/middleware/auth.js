import jwt from 'jsonwebtoken'
import { Admin } from '../models/Admin.js'

const COOKIE_NAME = 'portfolio_admin_token'

export function getCookieName() {
  return COOKIE_NAME
}

export function signToken(admin, { rememberMe = false } = {}) {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not configured')

  const expiresIn = rememberMe
    ? process.env.JWT_REMEMBER_EXPIRES || '30d'
    : process.env.JWT_EXPIRES || '1d'

  return jwt.sign(
    {
      sub: admin._id.toString(),
      email: admin.email,
      role: 'admin',
    },
    secret,
    { expiresIn },
  )
}

export function setAuthCookie(res, token, { rememberMe = false } = {}) {
  const isProd = process.env.NODE_ENV === 'production'
  const crossSite = process.env.COOKIE_CROSS_SITE === 'true'
  const options = {
    httpOnly: true,
    secure: isProd || crossSite,
    sameSite: crossSite ? 'none' : isProd ? 'strict' : 'lax',
    path: '/',
  }

  if (rememberMe) {
    options.maxAge = 30 * 24 * 60 * 60 * 1000
  }

  res.cookie(COOKIE_NAME, token, options)
}

export function clearAuthCookie(res) {
  const isProd = process.env.NODE_ENV === 'production'
  const crossSite = process.env.COOKIE_CROSS_SITE === 'true'
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProd || crossSite,
    sameSite: crossSite ? 'none' : isProd ? 'strict' : 'lax',
    path: '/',
  })
}

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization
    const bearer = header?.startsWith('Bearer ') ? header.slice(7) : null
    const token = req.cookies?.[COOKIE_NAME] || bearer

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      return res.status(500).json({ message: 'Server auth misconfigured' })
    }

    const payload = jwt.verify(token, secret)
    if (payload.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const admin = await Admin.findById(payload.sub).select('-passwordHash')
    if (!admin) {
      clearAuthCookie(res)
      return res.status(401).json({ message: 'Invalid session' })
    }

    req.admin = admin
    next()
  } catch {
    clearAuthCookie(res)
    return res.status(401).json({ message: 'Invalid or expired session' })
  }
}
