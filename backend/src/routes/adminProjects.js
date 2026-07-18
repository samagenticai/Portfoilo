import { Router } from 'express'
import slugify from 'slugify'
import { Project } from '../models/Project.js'
import { requireAuth } from '../middleware/auth.js'
import { projectImageUpload } from '../middleware/fileUpload.js'
import { getCloudinarySecureUrls } from '../utils/storage.js'
import { toAdminProject } from '../utils/projectMapper.js'

const router = Router()

function makeSlug(title, fallback = '') {
  const base = slugify(title || fallback || 'project', { lower: true, strict: true })
  return base || `project-${Date.now()}`
}

async function uniqueSlug(base, excludeId = null) {
  let slug = base
  let i = 1
  while (true) {
    const query = { slug }
    if (excludeId) query._id = { $ne: excludeId }
    const exists = await Project.exists(query)
    if (!exists) return slug
    slug = `${base}-${i++}`
  }
}

router.use(requireAuth)

router.get('/', async (req, res) => {
  try {
    const { search = '', filter = 'all', page = '1', limit = '9' } = req.query
    const q = {}

    if (search.trim()) {
      q.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { shortDescription: { $regex: search.trim(), $options: 'i' } },
        { slug: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
      ]
    }

    if (filter === 'featured') q.featured = true
    if (filter === 'published') q.published = true
    if (filter === 'draft') q.published = false

    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 9))
    const skip = (pageNum - 1) * limitNum

    const [items, total] = await Promise.all([
      Project.find(q).sort({ displayOrder: 1, createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Project.countDocuments(q),
    ])

    res.set('Cache-Control', 'no-store')
    res.json({
      projects: items.map(toAdminProject),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.max(1, Math.ceil(total / limitNum)),
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to list projects' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).lean()
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json({ project: toAdminProject(project) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to load project' })
  }
})

router.post('/upload', projectImageUpload.array('images', 12), async (req, res) => {
  try {
    const urls = getCloudinarySecureUrls(req.files || [])
    if (!urls.length) return res.status(400).json({ message: 'No files uploaded' })
    res.json({ urls })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message || 'Upload failed' })
  }
})

router.post('/', async (req, res) => {
  try {
    const body = req.body || {}
    if (!body.title?.trim() || !body.shortDescription?.trim()) {
      return res.status(400).json({ message: 'Title and short description are required' })
    }

    const baseSlug = makeSlug(body.slug || body.title)
    const slug = await uniqueSlug(baseSlug)

    const project = await Project.create({
      title: body.title.trim(),
      slug,
      shortDescription: body.shortDescription.trim(),
      fullDescription: body.fullDescription || '',
      coverImage: body.coverImage || '',
      galleryImages: body.galleryImages || [],
      category: body.category || 'Web App',
      techStack: body.techStack || [],
      githubUrl: body.githubUrl || '',
      liveUrl: body.liveUrl || body.liveDemoUrl || '',
      projectStatus: body.projectStatus || 'Completed',
      featured: Boolean(body.featured),
      published: Boolean(body.published),
      displayOrder: Number(body.displayOrder) || 0,
      badge: body.badge || '',
      seo: {
        metaTitle: body.seo?.metaTitle || body.title,
        metaDescription: body.seo?.metaDescription || body.shortDescription,
        keywords: body.seo?.keywords || '',
      },
      problem: body.problem || '',
      solution: body.solution || '',
      features: body.features || [],
      accent: body.accent || 'from-primary/20 via-secondary/10 to-primary/15',
    })

    res.status(201).json({ project: toAdminProject(project) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message || 'Failed to create project' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const body = req.body || {}
    const existing = await Project.findById(req.params.id)
    if (!existing) return res.status(404).json({ message: 'Project not found' })

    if (body.title !== undefined) existing.title = body.title.trim()
    if (body.shortDescription !== undefined) existing.shortDescription = body.shortDescription.trim()
    if (body.fullDescription !== undefined) existing.fullDescription = body.fullDescription
    if (body.coverImage !== undefined) existing.coverImage = body.coverImage
    if (body.galleryImages !== undefined) existing.galleryImages = body.galleryImages
    if (body.category !== undefined) existing.category = body.category
    if (body.techStack !== undefined) existing.techStack = body.techStack
    if (body.githubUrl !== undefined) existing.githubUrl = body.githubUrl
    if (body.liveUrl !== undefined || body.liveDemoUrl !== undefined) {
      existing.liveUrl = body.liveUrl ?? body.liveDemoUrl ?? ''
    }
    if (body.projectStatus !== undefined) existing.projectStatus = body.projectStatus
    if (body.featured !== undefined) existing.featured = Boolean(body.featured)
    if (body.published !== undefined) existing.published = Boolean(body.published)
    if (body.displayOrder !== undefined) existing.displayOrder = Number(body.displayOrder) || 0
    if (body.badge !== undefined) existing.badge = body.badge || ''
    if (body.seo !== undefined) {
      existing.seo = { ...(existing.seo?.toObject?.() || existing.seo || {}), ...body.seo }
    }
    if (body.problem !== undefined) existing.problem = body.problem
    if (body.solution !== undefined) existing.solution = body.solution
    if (body.features !== undefined) existing.features = body.features
    if (body.accent !== undefined) existing.accent = body.accent

    if (body.slug || body.title) {
      const baseSlug = makeSlug(body.slug || existing.slug || existing.title)
      existing.slug = await uniqueSlug(baseSlug, existing._id)
    }

    await existing.save()
    res.json({ project: toAdminProject(existing) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message || 'Failed to update project' })
  }
})

router.post('/:id/duplicate', async (req, res) => {
  try {
    const source = await Project.findById(req.params.id).lean()
    if (!source) return res.status(404).json({ message: 'Project not found' })

    const { _id, createdAt, updatedAt, __v, ...rest } = source
    const slug = await uniqueSlug(makeSlug(`${rest.title}-copy`))

    const project = await Project.create({
      ...rest,
      title: `${rest.title} (Copy)`,
      slug,
      published: false,
      featured: false,
    })

    res.status(201).json({ project: toAdminProject(project) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to duplicate project' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Project not found' })
    res.json({ message: 'Project deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to delete project' })
  }
})

export default router
