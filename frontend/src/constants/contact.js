import { PROFILE, mailtoHref, whatsappHref } from './profile'

export const CONTACT = {
  badge: 'CONTACT',
  heading: "Let's Build Something Amazing Together",
  description:
    "Whether it's a freelance project, a full-time role or a collaboration, I'm always open to discussing exciting opportunities.",
  availability: 'Available for Full-Time MERN Stack Developer Opportunities',
  location: PROFILE.location,
  email: {
    label: 'Email',
    value: PROFILE.email,
    href: mailtoHref,
  },
  whatsapp: {
    label: 'WhatsApp',
    value: PROFILE.phoneDisplay,
    href: whatsappHref,
  },
  github: {
    label: PROFILE.github.label,
    value: PROFILE.github.display,
    href: PROFILE.github.href,
  },
  linkedin: {
    label: PROFILE.linkedin.label,
    value: PROFILE.linkedin.display,
    href: PROFILE.linkedin.href,
  },
}

export const CONTACT_FORM_DEFAULTS = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

export const CONTACT_FORM_RULES = {
  name: { min: 3, label: 'Full Name' },
  email: { label: 'Email Address' },
  subject: { min: 5, label: 'Subject' },
  message: { min: 20, max: 1000, label: 'Message' },
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContactField(name, rawValue) {
  const value = typeof rawValue === 'string' ? rawValue.trim() : ''
  const rules = CONTACT_FORM_RULES[name]
  if (!rules) return ''

  if (!value) return `${rules.label} is required.`

  if (name === 'email') {
    if (!EMAIL_RE.test(value)) return 'Enter a valid email address.'
    return ''
  }

  if (rules.min && value.length < rules.min) {
    return `${rules.label} must be at least ${rules.min} characters.`
  }

  if (rules.max && value.length > rules.max) {
    return `${rules.label} must be at most ${rules.max} characters.`
  }

  return ''
}

export function validateContactForm(form) {
  const errors = {}
  let valid = true

  for (const key of Object.keys(CONTACT_FORM_DEFAULTS)) {
    const message = validateContactField(key, form[key])
    if (message) {
      errors[key] = message
      valid = false
    }
  }

  return { valid, errors }
}

export function trimContactForm(form) {
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    subject: form.subject.trim(),
    message: form.message.trim(),
  }
}
