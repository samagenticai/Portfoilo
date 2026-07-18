import { Router } from 'express'
import slugify from 'slugify'
import { Skill } from '../models/Skill.js'
import { requireAuth } from '../middleware/auth.js'
import { skillIconUpload } from '../middleware/fileUpload.js'
import { getCloudinarySecureUrl } from '../utils/storage.js'
import { makeSkillSlug, sortSkills, toAdminSkill, toPublicSkill } from '../utils/cmsMapper.js'

const router = Router()
router.use(requireAuth)

async function uniqueSlug(base, excludeId = null) {
  let slug = base
  let i = 1
  while (true) {
    const query = { slug }
    if (excludeId) query._id = { $ne: excludeId }
    const exists = await Skill.exists(query)
    if (!exists) return slug
    slug = `${base}-${i++}`
  }
}

router.get('/', async (req, res) => {
  try {
    const { search = '', filter = 'all' } = req.query
    const q = {}
    if (search.trim()) {
      q.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
      ]
    }
    if (filter === 'published') q.published = true
    if (filter === 'hidden') q.published = false

    const items = await Skill.find(q).lean()
    res.set('Cache-Control', 'no-store')
    res.json({ skills: sortSkills(items).map(toAdminSkill) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to list skills' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).lean()
    if (!skill) return res.status(404).json({ message: 'Skill not found' })
    res.json({ skill: toAdminSkill(skill) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to load skill' })
  }
})

router.post('/upload-icon', skillIconUpload.single('file'), async (req, res) => {
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

router.post('/', async (req, res) => {
  try {
    const body = req.body || {}
    if (!body.name?.trim()) return res.status(400).json({ message: 'Skill name is required' })

    const baseSlug = makeSkillSlug(body.slug || body.name)
    const slug = await uniqueSlug(baseSlug)

    const skill = await Skill.create({
      name: body.name.trim(),
      slug,
      category: body.category || 'Frontend',
      percentage: Math.min(100, Math.max(0, Number(body.percentage) || 0)),
      displayOrder: Number(body.displayOrder) || 0,
      published: body.published !== false,
      iconType: body.iconType === 'upload' ? 'upload' : 'lucide',
      lucideIcon: slugify(body.lucideIcon || 'code-2', { lower: true, strict: true }) || 'code-2',
      iconUrl: body.iconUrl || '',
      description: body.description || '',
    })

    res.status(201).json({ skill: toAdminSkill(skill) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message || 'Failed to create skill' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const body = req.body || {}
    const skill = await Skill.findById(req.params.id)
    if (!skill) return res.status(404).json({ message: 'Skill not found' })

    if (body.name !== undefined) skill.name = body.name.trim()
    if (body.category !== undefined) skill.category = body.category
    if (body.percentage !== undefined) {
      skill.percentage = Math.min(100, Math.max(0, Number(body.percentage) || 0))
    }
    if (body.displayOrder !== undefined) skill.displayOrder = Number(body.displayOrder) || 0
    if (body.published !== undefined) skill.published = Boolean(body.published)
    if (body.iconType !== undefined) skill.iconType = body.iconType === 'upload' ? 'upload' : 'lucide'
    if (body.lucideIcon !== undefined) {
      skill.lucideIcon = slugify(body.lucideIcon || 'code-2', { lower: true, strict: true }) || 'code-2'
    }
    if (body.iconUrl !== undefined) skill.iconUrl = body.iconUrl
    if (body.description !== undefined) skill.description = body.description

    if (body.slug || body.name) {
      const baseSlug = makeSkillSlug(body.slug || skill.slug || skill.name)
      skill.slug = await uniqueSlug(baseSlug, skill._id)
    }

    await skill.save()
    res.json({ skill: toAdminSkill(skill) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message || 'Failed to update skill' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Skill.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Skill not found' })
    res.json({ message: 'Skill deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to delete skill' })
  }
})

export default router
