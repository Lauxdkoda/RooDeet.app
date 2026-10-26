export function normalizeEmail(email) {
  return String(email ?? '').trim().toLowerCase()
}

export function validateCredentials(email, password) {
  const normalizedEmail = normalizeEmail(email)
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(normalizedEmail)) {
    return { valid: false, message: 'Enter a valid email address.' }
  }

  if (String(password ?? '').length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters.' }
  }

  return { valid: true, message: '' }
}

export function initialsFromName(name) {
  return String(name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'RD'
}
