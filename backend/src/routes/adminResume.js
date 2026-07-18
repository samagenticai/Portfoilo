import { Router } from 'express'
import { Resume } from '../models/Resume.js'
import { requireAuth } from '../middleware/auth.js'
import { resumeUpload } from '../middleware/fileUpload.js'
import { deleteStoredFile, uploadPdfToCloudinary, validatePdfUploadFile } from '../utils/storage.js'
import { toPublicResume } from '../utils/cmsMapper.js'

const router = Router()
router.use(requireAuth)

const MAX_BYTES = 5 * 1024 * 1024

function validatePdfUpload(file) {
  if (!file) return 'PDF file is required.'
  try {
    validatePdfUploadFile(file)
  } catch (err) {
    return err.message
  }
  if (file.size > MAX_BYTES) return 'Maximum file size is 5MB.'
  return null
}

async function getOrCreateResume() {
  let resume = await Resume.findOne({ key: 'portfolio' })
  if (!resume) resume = await Resume.create({ key: 'portfolio' })
  return resume
}

router.get('/', async (_req, res) => {
  try {
    const resume = await Resume.findOne({ key: 'portfolio' }).lean()
    res.set('Cache-Control', 'no-store')
    res.json({
      resume: toPublicResume(resume) || {
        url: '',
        fileName: '',
        originalName: '',
        fileSize: 0,
        updatedAt: resume?.updatedAt || null,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to load resume' })
  }
})

router.post('/upload', resumeUpload.single('file'), async (req, res) => {
  try {
    const validationError = validatePdfUpload(req.file)
    if (validationError) return res.status(400).json({ message: validationError })

    const resume = await getOrCreateResume()
    await deleteStoredFile(resume.url || resume.filePath)

    const { secureUrl, publicId } = await uploadPdfToCloudinary(req.file, 'resume')
    resume.url = secureUrl
    resume.cloudinaryPublicId = publicId
    resume.filePath = ''
    resume.fileName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_') || 'resume.pdf'
    resume.originalName = req.file.originalname
    resume.fileSize = req.file.size

    await resume.save()
    res.json({
      message: resume.url ? 'Resume replaced successfully.' : 'Resume uploaded successfully.',
      resume: toPublicResume(resume),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message || 'Upload failed' })
  }
})

router.delete('/', async (_req, res) => {
  try {
    const resume = await Resume.findOne({ key: 'portfolio' })
    if (!resume || !(resume.url || resume.filePath)) {
      return res.status(404).json({ message: 'No resume found' })
    }

    await deleteStoredFile(resume.url || resume.filePath)
    resume.url = ''
    resume.cloudinaryPublicId = ''
    resume.filePath = ''
    resume.fileName = ''
    resume.originalName = ''
    resume.fileSize = 0
    await resume.save()

    res.json({ message: 'Resume deleted successfully.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to delete resume' })
  }
})

export default router
