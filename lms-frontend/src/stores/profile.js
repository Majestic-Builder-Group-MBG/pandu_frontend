import { defineStore } from 'pinia'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    me: null,
    status: 'idle',
    error: null,
    photoUrl: '',
    photoStatus: 'idle',
    photoError: null,
  }),
  actions: {
    async fetchMe({ services, force = false } = {}) {
      if (!services?.profile?.me) throw new Error('Profile service not available')
      if (!force && this.me) return this.me

      this.status = 'loading'
      this.error = null
      try {
        const res = await services.profile.me()
        const data = res?.data ?? res
        this.me = data
        this.status = 'success'
        return this.me
      } catch (e) {
        this.status = 'error'
        if (e?.status === 401) {
          this.error = 'Unauthorized. Silakan login ulang.'
        } else if (e?.status === 404) {
          this.error = 'Endpoint profile belum tersedia di backend.'
        } else {
          this.error = e?.message || 'Gagal memuat profile'
        }
        throw e
      }
    },

    async updateMe({ services, name } = {}) {
      if (!services?.profile?.updateMe) throw new Error('Profile service not available')
      this.status = 'loading'
      this.error = null
      try {
        const res = await services.profile.updateMe({ name })
        if (res?.success === false) throw new Error(res?.message || 'Gagal menyimpan profile')
        const data = res?.data ?? res
        // Backend might return full profile or just updated fields.
        this.me = { ...(this.me || {}), ...(data?.data ?? data) }
        this.status = 'success'
        return res
      } catch (e) {
        this.status = 'error'
        if (e?.status === 401) {
          this.error = 'Unauthorized. Silakan login ulang.'
        } else if (e?.status === 404) {
          this.error = 'Endpoint profile belum tersedia di backend.'
        } else {
          this.error = e?.message || 'Gagal menyimpan profile'
        }
        throw e
      }
    },

    revokePhoto() {
      if (this.photoUrl && String(this.photoUrl).startsWith('blob:')) {
        URL.revokeObjectURL(this.photoUrl)
      }
      this.photoUrl = ''
      this.photoStatus = 'idle'
      this.photoError = null
    },

    async fetchMyPhoto({ services, force = false } = {}) {
      if (!services?.profile?.getMyPhoto) throw new Error('Profile service not available')
      if (!force && this.photoUrl) return this.photoUrl
      if (!force && this.photoStatus === 'loading') return ''
      // 404 from GET photo means "no photo". Don't keep retrying.
      if (!force && this.photoStatus === 'none') return ''

      this.revokePhoto()
      this.photoStatus = 'loading'
      this.photoError = null
      try {
        const blob = await services.profile.getMyPhoto()
        const url = URL.createObjectURL(blob)
        this.photoUrl = url
        this.photoStatus = 'success'
        return url
      } catch (e) {
        // If photo doesn't exist yet, backend may return 404.
        if (e?.status === 404) {
          this.photoStatus = 'none'
          return ''
        }
        if (e?.status === 401) {
          this.photoStatus = 'error'
          this.photoError = 'Unauthorized. Silakan login ulang.'
          return ''
        }
        this.photoStatus = 'error'
        this.photoError = e?.message || 'Gagal memuat foto profile'
        return ''
      }
    },

    async updateMyPhoto({ services, file } = {}) {
      if (!services?.profile?.updateMyPhoto) throw new Error('Profile service not available')
      this.photoStatus = 'loading'
      this.photoError = null
      try {
        const res = await services.profile.updateMyPhoto(file)
        if (res?.success === false) throw new Error(res?.message || 'Gagal upload foto')
        await this.fetchMyPhoto({ services, force: true })
        return res
      } catch (e) {
        this.photoStatus = 'error'
        this.photoError = e?.message || 'Gagal upload foto'
        throw e
      }
    },

    clear() {
      this.me = null
      this.status = 'idle'
      this.error = null
      this.revokePhoto()
    },
  },
})
