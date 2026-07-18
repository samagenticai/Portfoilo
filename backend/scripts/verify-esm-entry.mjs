/**
 * Verifies the Vercel serverless ESM entry loads without require()/ERR_REQUIRE_ESM.
 * Run: node backend/scripts/verify-esm-entry.mjs
 */
import { pathToFileURL } from 'node:url'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const entryUrl = pathToFileURL(resolve(__dirname, '../../api/index.mjs')).href

const { default: handler } = await import(entryUrl)

if (typeof handler !== 'function') {
  console.error('FAIL: api/index.mjs must export a default async function handler')
  process.exit(1)
}

console.log('OK: api/index.mjs loaded as ESM')
console.log('OK: default export is', typeof handler)
