import { defineStore } from 'pinia'
import { normalizeListResponse } from '@/services/mappers/list'

function mapModule(m) {
  const bannerImagePath = m?.banner_image_path || ''
  const bannerDownloadUrl = m?.banner_download_url || ''
  const hasBanner = Boolean(bannerDownloadUrl)

  const sessionsCount =
    (typeof m?.sessions_count === 'number' ? m.sessions_count : null) ??
    (typeof m?.session_count === 'number' ? m.session_count : null) ??
    (typeof m?.sessionsCount === 'number' ? m.sessionsCount : null) ??
    (typeof m?.sessionCount === 'number' ? m.sessionCount : null) ??
    (typeof m?.sessions === 'number' ? m.sessions : null) ??
    (Array.isArray(m?.sessions) ? m.sessions.length : null)

  const quizzesCount =
    (typeof m?.quizzes_count === 'number' ? m.quizzes_count : null) ??
    (typeof m?.quiz_count === 'number' ? m.quiz_count : null) ??
    (typeof m?.quizzesCount === 'number' ? m.quizzesCount : null) ??
    (typeof m?.quizCount === 'number' ? m.quizCount : null) ??
    (typeof m?.quizzes === 'number' ? m.quizzes : null) ??
    (Array.isArray(m?.quizzes) ? m.quizzes.length : null)

  const materialsCount =
    (typeof m?.materials_count === 'number' ? m.materials_count : null) ??
    (typeof m?.material_count === 'number' ? m.material_count : null) ??
    (typeof m?.materialsCount === 'number' ? m.materialsCount : null) ??
    (typeof m?.materialCount === 'number' ? m.materialCount : null) ??
    (typeof m?.materials === 'number' ? m.materials : null) ??
    (Array.isArray(m?.materials) ? m.materials.length : null)

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
    sessions: typeof sessionsCount === 'number' && Number.isFinite(sessionsCount) ? sessionsCount : 0,
    materials: typeof materialsCount === 'number' && Number.isFinite(materialsCount) ? materialsCount : 0,
    quizzes: typeof quizzesCount === 'number' && Number.isFinite(quizzesCount) ? quizzesCount : 0,
    capabilities: {
      canView: Boolean(m?.capabilities?.can_view ?? true),
      canEdit: Boolean(m?.capabilities?.can_edit ?? false),
      canDelete: Boolean(m?.capabilities?.can_delete ?? false),
      canManageSessions: Boolean(m?.capabilities?.can_manage_sessions ?? false),
    },
  }
}

export const useModulesStore = defineStore('modules', {
  state: () => ({
    items: [],
    byId: {},
    countsById: {},
    status: 'idle',
    error: null,
  }),
  getters: {
    getById: (state) => (id) => state.byId[Number(id)] || null,
  },
  actions: {
    async fetchAll({ services, force = false } = {}) {
      if (!services?.modules?.list) throw new Error('Modules service not available')
      if (!force && this.items.length) return this.items

      this.status = 'loading'
      this.error = null
      try {
        const res = await services.modules.list()
        const list = normalizeListResponse(res)
        const mapped = list.map(mapModule)

        this.items = mapped
        this.byId = mapped.reduce((acc, m) => {
          const id = Number(m?.id)
          if (Number.isFinite(id) && id > 0) acc[id] = m
          return acc
        }, {})
        // Reset counts cache when modules are refreshed.
        this.countsById = {}
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
      this.byId = {}
      this.countsById = {}
      this.status = 'idle'
      this.error = null
    },

    async ensureCounts({ services, moduleId, force = false, role } = {}) {
      const mid = Number(moduleId)
      if (!services?.sessions?.list) throw new Error('Sessions service not available')
      if (!services?.sessions?.getSchedule) throw new Error('Sessions schedule service not available')
      if (!services?.quizzes?.getQuiz) throw new Error('Quizzes service not available')
      if (!Number.isFinite(mid) || mid <= 0) return

      const cached = this.countsById[mid]
      if (!force && cached?.status === 'success') return cached
      if (!force && cached?.status === 'loading') return cached

      this.countsById = {
        ...this.countsById,
        [mid]: { sessions: cached?.sessions ?? 0, quizzes: cached?.quizzes ?? 0, status: 'loading', error: '' },
      }

      try {
        const res = await services.sessions.list(mid)
        const list = normalizeListResponse(res)
        const sessionIds = list
          .map((s) => Number(s?.id))
          .filter((id) => Number.isFinite(id) && id > 0)

        const sessionsCount = sessionIds.length
        const isStudent = String(role || '').toLowerCase() === 'student'

        // Quiz badge mengikuti yang "muncul di Materi" di halaman course:
        // 1) schedule open_at harus diset (tidak memvalidasi apakah sudah lewat)
        // 2) quiz harus exist
        // 3) untuk student: hanya quiz published
        let quizzesCount = 0
        const queue = [...sessionIds]
        const workers = Array.from({ length: 6 }, async () => {
          while (queue.length) {
            const sid = queue.shift()
            if (!sid) continue

            // eslint-disable-next-line no-await-in-loop
            const sres = await services.sessions.getSchedule(mid, sid).catch(() => null)
            const openAt = sres?.data?.open_at || sres?.data?.openAt || sres?.open_at || sres?.openAt || null
            if (!openAt) continue

            // eslint-disable-next-line no-await-in-loop
            const qres = await services.quizzes.getQuiz(mid, sid).catch((e) => ({ __error: e }))
            if (qres?.__error) {
              const st = qres.__error?.status
              if (st === 404 || st === 403) continue
              continue
            }

            const data = qres?.data || qres
            if (qres?.success === false) continue

            if (isStudent) {
              const published = Boolean(data?.is_published ?? data?.isPublished)
              if (!published) continue
            }

            quizzesCount += 1
          }
        })

        await Promise.all(workers)

        this.countsById = {
          ...this.countsById,
          [mid]: { sessions: sessionsCount, quizzes: quizzesCount, status: 'success', error: '' },
        }

        // Keep module objects in sync so existing UI keeps working.
        const prev = this.byId[mid]
        if (prev) {
          const next = { ...prev, sessions: sessionsCount, quizzes: quizzesCount }
          this.byId = { ...this.byId, [mid]: next }
          this.items = this.items.map((m) => (Number(m?.id) === mid ? next : m))
        }
      } catch (e) {
        this.countsById = {
          ...this.countsById,
          [mid]: { sessions: cached?.sessions ?? 0, quizzes: cached?.quizzes ?? 0, status: 'error', error: e?.message || 'Gagal memuat counts' },
        }
      }
    },
  },
})
