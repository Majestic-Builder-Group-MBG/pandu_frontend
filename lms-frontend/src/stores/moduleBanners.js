import { defineStore } from 'pinia'

export const useModuleBannersStore = defineStore('moduleBanners', {
  state: () => ({
    urlsById: {},
    statusById: {},
    errorById: {},
  }),
  actions: {
    async ensureBanner({ moduleId, bannerPath, services } = {}) {
      if (!moduleId || !bannerPath) return ''
      if (this.urlsById[moduleId]) return this.urlsById[moduleId]
      if (this.statusById[moduleId] === 'loading') return ''
      if (!services?.modules?.getBannerByUrl) throw new Error('Modules service not available')

      this.statusById[moduleId] = 'loading'
      this.errorById[moduleId] = null
      try {
        const blob = await services.modules.getBannerByUrl(bannerPath)
        const url = URL.createObjectURL(blob)
        this.urlsById[moduleId] = url
        this.statusById[moduleId] = 'success'
        return url
      } catch (e) {
        this.statusById[moduleId] = 'error'
        this.errorById[moduleId] = e?.message || 'Gagal memuat banner'
        return ''
      }
    },
  },
})
