import { Router } from 'express'
import { Project } from '../models/Project.js'
import { toPortfolioProject } from '../utils/projectMapper.js'
import { sortPortfolioProjects } from '../utils/sortProjects.js'

const router = Router()

async function loadPublishedProjects({ featuredOnly = false } = {}) {
  const query = { published: true }
  if (featuredOnly) query.featured = true

  const projects = await Project.find(query).lean()
  return sortPortfolioProjects(projects).map(toPortfolioProject)
}

/** GET /api/projects — all published projects (source of truth for portfolio) */
router.get('/', async (req, res) => {
  try {
    const featuredOnly = req.query.featured === 'true' || req.query.featured === '1'
    const projects = await loadPublishedProjects({ featuredOnly })

    res.set('Cache-Control', 'no-store')
    res.json({ projects })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to load projects' })
  }
})

/** GET /api/projects/featured — published + featured */
router.get('/featured', async (_req, res) => {
  try {
    const projects = await loadPublishedProjects({ featuredOnly: true })
    res.set('Cache-Control', 'no-store')
    res.json({ projects })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to load featured projects' })
  }
})

/** GET /api/projects/:slug — single published project */
router.get('/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({
      slug: req.params.slug,
      published: true,
    }).lean()
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.set('Cache-Control', 'no-store')
    res.json({ project: toPortfolioProject(project) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to load project' })
  }
})

export default router
