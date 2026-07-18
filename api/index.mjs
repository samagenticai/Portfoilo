/**
 * Vercel serverless entry (ESM — see api/package.json).
 * Bootstraps DB + admin seed once per function instance, then forwards to Express.
 */
import app from '../backend/src/app.js'
import { connectDB, isDbConnected } from '../backend/src/config/db.js'
import { seedAdmin } from '../backend/src/utils/seedAdmin.js'

const globalCache = globalThis

function getBootstrapPromise() {
  if (!globalCache.__portfolioApiBootstrap) {
    globalCache.__portfolioApiBootstrap = (async () => {
      const connected = await connectDB()
      if (connected && isDbConnected()) {
        await seedAdmin()
      }
    })()
  }
  return globalCache.__portfolioApiBootstrap
}

export default async function handler(req, res) {
  await getBootstrapPromise()
  return app(req, res)
}
