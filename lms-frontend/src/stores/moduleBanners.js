import { defineStore } from 'pinia'

export const useModuleBannersStore = defineStore('moduleBanners', {
  state: () => ({
    urlsById: {},
    statusById: {},
    errorById: {},
  }),
  actions: {
    async ensureBanner({ moduleId, bannerPath, services } = {}) {
      const id = Number(moduleId)
      const path = typeof bannerPath === 'string' ? bannerPath.trim() : ''
      // Banner is optional; skip any fetch for empty/invalid paths.
      if (!Number.isFinite(id) || id <= 0) return ''
      if (!path || path === 'null' || path === 'undefined') return ''

      if (this.urlsById[id]) return this.urlsById[id]
      if (this.statusById[id] === 'loading') return ''
      if (!services?.modules?.getBannerByUrl) throw new Error('Modules service not available')

      this.statusById[id] = 'loading'
      this.errorById[id] = null
      try {
        const blob = await services.modules.getBannerByUrl(path)
        const url = URL.createObjectURL(blob)
        this.urlsById[id] = url
        this.statusById[id] = 'success'
        return url
      } catch (e) {
        this.statusById[id] = 'error'
        this.errorById[id] = e?.message || 'Gagal memuat banner'
        return ''
      }
    },
    revokeBanner(moduleId) {
      const id = Number(moduleId)
      if (!Number.isFinite(id) || id <= 0) return

      const url = this.urlsById[id]
      if (url) {
        URL.revokeObjectURL(url)
      }

      delete this.urlsById[id]
      delete this.statusById[id]
      delete this.errorById[id]
    },
    revokeAll() {
      Object.values(this.urlsById).forEach((url) => {
        if (url) URL.revokeObjectURL(url)
      })

      this.urlsById = {}
      this.statusById = {}
      this.errorById = {}
    },
    clear() {
      this.revokeAll()
    },
  },
})
