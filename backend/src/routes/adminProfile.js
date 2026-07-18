import { Router } from 'express'
import { Profile } from '../models/Profile.js'
import { requireAuth } from '../middleware/auth.js'
import { profileImageUpload } from '../middleware/fileUpload.js'
import { getCloudinarySecureUrl } from '../utils/storage.js'
import { toPublicProfile } from '../utils/cmsMapper.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (_req, res) => {
  try {
    let profile = await Profile.findOne({ key: 'portfolio' })
    if (!profile) profile = await Profile.create({ key: 'portfolio' })
    res.set('Cache-Control', 'no-store')
    res.json({ profile: profile.toObject() })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to load profile' })
  }
})

router.put('/', async (req, res) => {
  try {
    const body = req.body || {}
    let profile = await Profile.findOne({ key: 'portfolio' })
    if (!profile) profile = new Profile({ key: 'portfolio' })

    const fields = [
      'fullName',
      'professionalTitle',
      'animatedTitles',
      'shortBio',
      'heroDescription',
      'profileImage',
      'location',
      'email',
      'phone',
      'phoneE164',
      'githubUrl',
      'githubDisplay',
      'linkedinUrl',
      'linkedinDisplay',
      'website',
      'yearsOfExperience',
      'availability',
      'skillsHeading',
      'skillsDescription',
      'skillsDescription2',
    ]

    for (const key of fields) {
      if (body[key] !== undefined) profile[key] = body[key]
    }

    await profile.save()
    res.json({ profile: toPublicProfile(profile) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message || 'Failed to update profile' })
  }
})

router.post('/upload-image', profileImageUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    const url = getCloudinarySecureUrl(req.file)
    if (!url) return res.status(500).json({ message: 'Cloudinary upload failed' })
    res.json({ url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message || 'Upload failed' })
  }
})

export default router
