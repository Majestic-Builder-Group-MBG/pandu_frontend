const LS_ENABLED = 'pandu:lms:rememberMe:enabled'
const LS_EMAILS = 'pandu:lms:rememberMe:emails'

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

export function getRememberMeEnabled() {
  const v = readJson(LS_ENABLED, null)
  if (typeof v === 'boolean') return v
  return true
}

export function setRememberMeEnabled(enabled) {
  writeJson(LS_ENABLED, Boolean(enabled))
}

export function readLoginEmailHistory() {
  const list = readJson(LS_EMAILS, [])
  if (!Array.isArray(list)) return []
  return list
    .map((x) => {
      const email = String(x?.email || '').trim().toLowerCase()
      const lastUsedAt = Number(x?.lastUsedAt)
      if (!email) return null
      return {
        email,
        lastUsedAt: Number.isFinite(lastUsedAt) ? lastUsedAt : 0,
      }
    })
    .filter(Boolean)
    .sort((a, b) => (b.lastUsedAt || 0) - (a.lastUsedAt || 0))
}

export function recordLoginEmail(email) {
  const e = String(email || '').trim().toLowerCase()
  if (!e) return

  const now = Date.now()
  const list = readLoginEmailHistory()
  const next = [{ email: e, lastUsedAt: now }, ...list.filter((x) => x.email !== e)]
  writeJson(LS_EMAILS, next.slice(0, 8))
}

export function getLastLoginEmail() {
  const list = readLoginEmailHistory()
  return list[0]?.email || ''
}

export function clearLoginHistory() {
  try {
    localStorage.removeItem(LS_EMAILS)
    localStorage.removeItem(LS_ENABLED)
  } catch {
    // ignore
  }
}
