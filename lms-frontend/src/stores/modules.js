import { defineStore } from 'pinia'
import { toAbsoluteUrl } from '@/utils/url'

function normalizeListResponse(res) {
  if (Array.isArray(res)) return res
  if (res && typeof res === 'object') {
    if (Array.isArray(res.data)) return res.data
  }
  return []
}

function mapModule(m) {
  const bannerImagePath = m?.banner_image_path || ''
  const bannerDownloadUrl = m?.banner_download_url || ''
  const hasBanner = Boolean(bannerDownloadUrl)

  return {
    id: m?.id,
    title: m?.name || m?.title || 'Untitled Module',
    desc: m?.description || m?.desc || '',
    // Use authenticated banner endpoint only (do not use banner_image_path as img src).
    bannerDownloadUrl,
    // Keep raw path for future uploads/admin UI (not used for rendering).
    bannerImagePath,
    // Deprecated for rendering; kept for backward-compat.
    bannerUrl: '',
    hasBanner,
    teacherName: m?.teacher_name || m?.teacherName || '',
    enrollKey: m?.enroll_key || m?.enrollKey || '',
    createdAt: m?.created_at || m?.createdAt || '',
    sessions: typeof m?.sessions === 'number' ? m.sessions : 3,
    materials: typeof m?.materials === 'number' ? m.materials : 0,
    quizzes: typeof m?.quizzes === 'number' ? m.quizzes : 0,
  }
}

export const useModulesStore = defineStore('modules', {
  state: () => ({
    items: [],
    status: 'idle',
    error: null,
  }),
  actions: {
    async fetchAll({ services, force = false } = {}) {
      if (!services?.modules?.list) throw new Error('Modules service not available')
      if (!force && this.items.length) return this.items

      this.status = 'loading'
      this.error = null
      try {
        const res = await services.modules.list()
        const list = normalizeListResponse(res)
        this.items = list.map(mapModule)
        this.status = 'success'
        return this.items
      } catch (e) {
        this.status = 'error'
        this.error = e?.message || 'Gagal memuat modul'
        throw e
      }
    },
    clear() {
      this.items = []
      this.status = 'idle'
      this.error = null
    },
  },
})
