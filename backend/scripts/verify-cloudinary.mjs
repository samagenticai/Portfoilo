/**
 * Verifies Cloudinary integration modules load and upload helpers behave correctly.
 * Run: node backend/scripts/verify-cloudinary.mjs
 */
import { isCloudinaryConfigured, extractPublicIdFromUrl } from '../src/config/cloudinary.js'
import { getCloudinarySecureUrl, getCloudinarySecureUrls } from '../src/utils/storage.js'
import { projectImageUpload, profileImageUpload, skillIconUpload, resumeUpload } from '../src/middleware/fileUpload.js'

const sampleUrl =
  'https://res.cloudinary.com/demo/image/upload/v1234567890/ahmad-stack-portfolio/projects/sample.jpg'

const publicId = extractPublicIdFromUrl(sampleUrl)
if (publicId !== 'ahmad-stack-portfolio/projects/sample') {
  console.error('FAIL: extractPublicIdFromUrl returned', publicId)
  process.exit(1)
}

const singleUrl = getCloudinarySecureUrl({ path: sampleUrl })
if (singleUrl !== sampleUrl) {
  console.error('FAIL: getCloudinarySecureUrl mismatch')
  process.exit(1)
}

const urls = getCloudinarySecureUrls([{ path: sampleUrl }, { path: 'https://res.cloudinary.com/demo/image/upload/v1/a/b.png' }])
if (urls.length !== 2) {
  console.error('FAIL: getCloudinarySecureUrls count')
  process.exit(1)
}

if (!projectImageUpload || !profileImageUpload || !skillIconUpload || !resumeUpload) {
  console.error('FAIL: multer upload middleware not exported')
  process.exit(1)
}

console.log('OK: Cloudinary helpers verified')
console.log('OK: multer Cloudinary upload middleware loaded')
console.log(`Cloudinary configured: ${isCloudinaryConfigured() ? 'yes' : 'no (set env vars for live uploads)'}`)
