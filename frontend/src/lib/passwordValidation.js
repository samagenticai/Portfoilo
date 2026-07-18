export const PASSWORD_POLICY = {
  minLength: 8,
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
}

export function validatePasswordPolicy(password) {
  const value = String(password || '')
  const errors = []

  if (value.length < PASSWORD_POLICY.minLength) {
    errors.push(`At least ${PASSWORD_POLICY.minLength} characters`)
  }
  if (!/[A-Z]/.test(value)) errors.push('One uppercase letter')
  if (!/[a-z]/.test(value)) errors.push('One lowercase letter')
  if (!/\d/.test(value)) errors.push('One number')
  if (!/[^A-Za-z0-9]/.test(value)) errors.push('One special character')

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function getPasswordStrength(password) {
  const value = String(password || '')
  if (!value) {
    return { score: 0, label: 'Enter a password', percent: 0, color: 'bg-white/10' }
  }

  let score = 0
  if (value.length >= 8) score += 1
  if (value.length >= 12) score += 1
  if (/[A-Z]/.test(value)) score += 1
  if (/[a-z]/.test(value)) score += 1
  if (/\d/.test(value)) score += 1
  if (/[^A-Za-z0-9]/.test(value)) score += 1

  const normalized = Math.min(100, Math.round((score / 6) * 100))

  if (normalized < 34) return { score, label: 'Weak', percent: normalized, color: 'bg-rose-400' }
  if (normalized < 55) return { score, label: 'Fair', percent: normalized, color: 'bg-amber-400' }
  if (normalized < 75) return { score, label: 'Good', percent: normalized, color: 'bg-sky-400' }
  if (normalized < 90) return { score, label: 'Strong', percent: normalized, color: 'bg-emerald-400' }
  return { score, label: 'Very strong', percent: normalized, color: 'bg-emerald-300' }
}
