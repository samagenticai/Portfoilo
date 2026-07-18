import bcrypt from 'bcryptjs'
import { Admin } from '../models/Admin.js'

const globalCache = globalThis

/**
 * Ensures exactly one admin exists.
 * Never creates additional admins if one already exists.
 * Cached per runtime instance so Vercel cold starts do not repeat work.
 */
export async function seedAdmin() {
  if (globalCache.__portfolioSeedPromise) {
    return globalCache.__portfolioSeedPromise
  }

  globalCache.__portfolioSeedPromise = (async () => {
    const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
    const password = process.env.ADMIN_PASSWORD || ''
    const name = process.env.ADMIN_NAME || 'Ahmad'

    if (!email || !password) {
      console.warn('ADMIN_EMAIL / ADMIN_PASSWORD missing — skip admin seed')
      return
    }

    const existingCount = await Admin.countDocuments()
    if (existingCount > 0) {
      return
    }

    const passwordHash = await bcrypt.hash(password, 12)
    await Admin.create({ email, passwordHash, name, role: 'admin' })
  })()

  return globalCache.__portfolioSeedPromise
}
