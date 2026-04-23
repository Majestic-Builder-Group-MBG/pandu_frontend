import { defineStore } from 'pinia'
import { normalizeListResponse } from '@/services/mappers/list'

function normalizeEnrollment(item) {
  const module = item?.module || item?.course || item || {}
  const id = Number(module?.id)

  return {
    moduleId: Number.isFinite(id) ? id : null,
    module: {
      id: Number.isFinite(id) ? id : null,
      title: module?.name || module?.title || 'Untitled Module',
      desc: module?.description || module?.desc || '',
      teacherName: module?.teacher_name || module?.teacherName || '',
      bannerDownloadUrl: module?.banner_download_url || module?.bannerDownloadUrl || '',
      enrollKey: module?.enroll_key || module?.enrollKey || '',
      capabilities: {
        canView: Boolean(module?.capabilities?.can_view ?? true),
        canEdit: Boolean(module?.capabilities?.can_edit ?? false),
        canDelete: Boolean(module?.capabilities?.can_delete ?? false),
        canManageSessions: Boolean(module?.capabilities?.can_manage_sessions ?? false),
      },
    },
  }
}

export const useEnrollmentsStore = defineStore('enrollments', {
  state: () => ({
    items: [],
    moduleIds: [],
    status: 'idle',
    error: null,
  }),
  getters: {
    moduleIdSet: (state) => new Set(state.moduleIds),
  },
  actions: {
    async fetchMine({ services, force = false } = {}) {
      if (!services?.enrollments?.me) throw new Error('Enrollments service not available')
      if (!force && this.items.length) return this.items

      this.status = 'loading'
      this.error = null
      try {
        const res = await services.enrollments.me({ page: 1, perPage: 100 })
        const list = normalizeListResponse(res)
        const normalized = list.map(normalizeEnrollment).filter((x) => x.moduleId)

        this.items = normalized
        this.moduleIds = Array.from(new Set(normalized.map((x) => x.moduleId)))
        this.status = 'success'
        return this.items
      } catch (e) {
        this.status = 'error'
        this.error = e?.message || 'Gagal memuat enrollment'
        throw e
      }
    },
    clear() {
      this.items = []
      this.moduleIds = []
      this.status = 'idle'
      this.error = null
    },
  },
})
