import slugify from 'slugify'
import { normalizeExternalUrl } from './normalizeUrl.js'

const ORBIT_PRESETS = [
  { radius: 118, duration: 28, direction: 1, startAngle: 0 },
  { radius: 132, duration: 34, direction: -1, startAngle: 45 },
  { radius: 108, duration: 24, direction: 1, startAngle: 90 },
  { radius: 142, duration: 38, direction: -1, startAngle: 135 },
  { radius: 125, duration: 30, direction: 1, startAngle: 180 },
  { radius: 115, duration: 26, direction: -1, startAngle: 210 },
  { radius: 138, duration: 32, direction: 1, startAngle: 250 },
  { radius: 110, duration: 22, direction: -1, startAngle: 290 },
  { radius: 128, duration: 36, direction: 1, startAngle: 320 },
  { radius: 120, duration: 27, direction: -1, startAngle: 15 },
  { radius: 135, duration: 33, direction: 1, startAngle: 55 },
  { radius: 112, duration: 25, direction: -1, startAngle: 105 },
  { radius: 145, duration: 40, direction: 1, startAngle: 165 },
]

export function sortSkills(skills) {
  return [...skills].sort((a, b) => {
    const aOrder = Number(a.displayOrder) || 0
    const bOrder = Number(b.displayOrder) || 0
    const aRanked = aOrder > 0
    const bRanked = bOrder > 0

    if (aRanked && bRanked && aOrder !== bOrder) return aOrder - bOrder
    if (aRanked && !bRanked) return -1
    if (!aRanked && bRanked) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

export function toPublicSkill(doc) {
  const s = typeof doc.toObject === 'function' ? doc.toObject() : doc
  return {
    id: s.slug || String(s._id),
    _id: String(s._id),
    slug: s.slug,
    name: s.name,
    category: s.category,
    percentage: s.percentage ?? 0,
    displayOrder: s.displayOrder ?? 0,
    published: Boolean(s.published),
    iconType: s.iconType || 'lucide',
    lucideIcon: s.lucideIcon || 'code2',
    iconUrl: s.iconUrl || '',
    description: s.description || '',
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  }
}

export function skillsToOrbit(skills) {
  return skills.map((skill, index) => {
    const preset = ORBIT_PRESETS[index % ORBIT_PRESETS.length]
    const id = skill.slug || String(skill._id)
    return {
      id,
      name: skill.name,
      iconType: skill.iconType,
      lucideIcon: skill.lucideIcon,
      iconUrl: skill.iconUrl,
      description: skill.description,
      ...preset,
    }
  })
}

export function skillsToProficiency(skills) {
  return skills.map((skill) => ({
    id: skill.slug || String(skill._id),
    label: skill.name,
    level: skill.percentage ?? 0,
    category: skill.category,
  }))
}

export function toAdminSkill(doc) {
  const s = typeof doc.toObject === 'function' ? doc.toObject() : doc
  return { ...s, _id: String(s._id), id: String(s._id) }
}

export function makeSkillSlug(name, fallback = '') {
  const base = slugify(name || fallback || 'skill', { lower: true, strict: true })
  return base || `skill-${Date.now()}`
}

export function toPublicProfile(doc) {
  const p = typeof doc.toObject === 'function' ? doc.toObject() : doc
  const githubUrl = normalizeExternalUrl(p.githubUrl)
  const linkedinUrl = normalizeExternalUrl(p.linkedinUrl)
  const website = normalizeExternalUrl(p.website)

  return {
    fullName: p.fullName || '',
    professionalTitle: p.professionalTitle || '',
    animatedTitles: p.animatedTitles?.length
      ? p.animatedTitles
      : p.professionalTitle
        ? [p.professionalTitle]
        : [],
    shortBio: p.shortBio || '',
    heroDescription: p.heroDescription || '',
    profileImage: p.profileImage || '',
    location: p.location || '',
    email: p.email || '',
    phone: p.phone || '',
    phoneE164: p.phoneE164 || '',
    github: {
      label: 'GitHub',
      href: githubUrl,
      display: p.githubDisplay || githubUrl.replace(/^https?:\/\/(www\.)?/, ''),
    },
    linkedin: {
      label: 'LinkedIn',
      href: linkedinUrl,
      display: p.linkedinDisplay || linkedinUrl.replace(/^https?:\/\/(www\.)?/, ''),
    },
    website,
    yearsOfExperience: p.yearsOfExperience ?? 0,
    availability: p.availability || '',
    skillsHeading: p.skillsHeading || '',
    skillsDescription: p.skillsDescription || '',
    skillsDescription2: p.skillsDescription2 || '',
    updatedAt: p.updatedAt,
  }
}

export function toPublicResume(doc) {
  if (!doc) return null
  const r = typeof doc.toObject === 'function' ? doc.toObject() : doc
  const url = r.url || r.filePath || ''
  if (!url) return null
  return {
    url,
    fileName: r.fileName || r.originalName || 'resume.pdf',
    originalName: r.originalName || '',
    fileSize: r.fileSize || 0,
    updatedAt: r.updatedAt,
  }
}
