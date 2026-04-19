import { defineStore } from 'pinia'
import { useEnrollmentsStore } from '@/stores/enrollments'
import { useModuleBannersStore } from '@/stores/moduleBanners'

const LS_KEY = 'pandu:lms:auth'

function readSession() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return { user: null, token: null }
    const parsed = JSON.parse(raw)
    return {
      user: parsed?.user || null,
      token: parsed?.token || null,
    }
  } catch {
    return { user: null, token: null }
  }
}

function writeSession({ user, token }) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ user, token }))
  } catch {
    // ignore
  }
}

function clearSessionStorage() {
  try {
    localStorage.removeItem(LS_KEY)
  } catch {
    // ignore
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    ...readSession(),
    status: 'idle',
    error: null,
  }),
  actions: {
    setSession({ user, token }, { persist = true } = {}) {
      this.user = user
      this.token = token
      if (persist) writeSession({ user, token })
    },
    clearSession() {
      this.user = null
      this.token = null
      clearSessionStorage()
    },
    async login({ email, password }, { services, persist = true } = {}) {
      this.status = 'loading'
      this.error = null
      try {
        const res = await services.auth.login({ email, password })
        const data = res?.data

        if (!res?.success || !data?.token || !data?.user) {
          throw new Error(res?.message || 'Login gagal')
        }

        this.setSession({ user: data.user, token: data.token }, { persist })
        this.status = 'success'
        return data
      } catch (e) {
        this.status = 'error'
        this.error = e?.message || 'Login gagal'
        throw e
      }
    },
    async logout({ services } = {}) {
      this.status = 'loading'
      this.error = null
      const banners = useModuleBannersStore()
      const enrollments = useEnrollmentsStore()
      try {
        if (services?.auth?.logout && this.token) {
          await services.auth.logout()
        }
      } catch {
        // Even if remote logout fails, clear local session.
      } finally {
        banners.revokeAll()
        enrollments.clear()
        this.clearSession()
        this.status = 'idle'
      }
    },
  },
})
