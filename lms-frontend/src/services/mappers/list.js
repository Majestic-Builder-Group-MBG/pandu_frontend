export function normalizeListResponse(res) {
  if (Array.isArray(res)) return res
  if (res && typeof res === 'object') {
    if (Array.isArray(res.data)) return res.data
    if (res.data && Array.isArray(res.data.sessions)) return res.data.sessions
    if (res.data && Array.isArray(res.data.contents)) return res.data.contents
  }
  return []
}
