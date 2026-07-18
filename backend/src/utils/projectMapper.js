/** Map Mongo project → portfolio frontend shape */
import { normalizeExternalUrl, resolveLiveUrl } from './normalizeUrl.js'

export function toPortfolioProject(doc) {
  const p = typeof doc.toObject === 'function' ? doc.toObject() : doc
  const id = p.slug || String(p._id)

  const rawLiveUrl = resolveLiveUrl(p)
  const liveUrl = normalizeExternalUrl(rawLiveUrl)
  const githubUrl = normalizeExternalUrl(p.githubUrl)

  const statusLabel =
    p.projectStatus === 'Completed'
      ? 'Production'
      : p.projectStatus === 'In Progress'
        ? 'In Progress'
        : 'Coming Soon'

  return {
    id,
    _id: String(p._id),
    slug: p.slug,
    title: p.title,
    description: p.shortDescription,
    fullDescription: p.fullDescription || p.shortDescription,
    shortDescription: p.shortDescription,
    problem: p.problem || p.shortDescription,
    solution: p.solution || p.fullDescription || p.shortDescription,
    features: p.features?.length ? p.features : (p.techStack || []).slice(0, 4),
    stack: p.techStack || [],
    techStack: p.techStack || [],
    challenges: p.problem || '',
    liveUrl,
    liveDemoUrl: liveUrl,
    githubUrl,
    domain: (() => {
      try {
        if (!liveUrl) return 'portfolio'
        return new URL(liveUrl).hostname.replace(/^www\./, '')
      } catch {
        return 'portfolio'
      }
    })(),
    accent: p.accent || 'from-primary/20 via-secondary/10 to-primary/15',
    status: statusLabel,
    projectStatus: p.projectStatus,
    featured: Boolean(p.featured),
    published: Boolean(p.published),
    displayOrder: p.displayOrder ?? 0,
    badge: p.badge || '',
    category: p.category || 'Web App',
    coverImage: p.coverImage || '',
    galleryImages: p.galleryImages || [],
    seo: p.seo || {},
    metrics: {
      performance: 95,
      uptime: '99.9%',
      deployments: Math.max(1, (p.techStack || []).length),
    },
    extras: {
      architecture: `${p.category || 'Web'} · ${(p.techStack || []).slice(0, 3).join(' + ') || 'MERN'}`,
      gitActivity: 'Active',
      checklist: (p.techStack || []).slice(0, 4),
    },
    preview: {
      hero: p.title,
      stats: [
        { label: 'Stack', value: String((p.techStack || []).length) },
        { label: 'Status', value: statusLabel },
        { label: 'Type', value: p.category || 'Web' },
      ],
      rows: (p.techStack || []).slice(0, 4).map((tech, i) => ({
        title: tech,
        status: i === 0 ? 'Primary' : 'Stack',
        score: '✓',
      })),
      coverImage: p.coverImage || '',
    },
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }
}

export function toAdminProject(doc) {
  const p = typeof doc.toObject === 'function' ? doc.toObject() : doc
  return {
    ...p,
    _id: String(p._id),
    id: String(p._id),
  }
}
