/**
 * Smoke-test CORS allowlist parsing.
 * Run: node backend/scripts/verify-cors.mjs
 */
import { parseAllowedOrigins } from '../src/config/cors.js'

const required = [
  'http://localhost:5173',
  'https://portfoilo-nine-lyart.vercel.app',
]

const allowed = parseAllowedOrigins()
const missing = required.filter((origin) => !allowed.includes(origin))

if (missing.length) {
  console.error('FAIL: missing required origins:', missing.join(', '))
  process.exit(1)
}

console.log('OK: required origins allowed')
console.log('Allowed origins:', allowed.join(', '))
