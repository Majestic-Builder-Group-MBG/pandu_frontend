import { defineStore } from 'pinia'
import { normalizeListResponse } from '@/services/mappers/list'

const LS_KEY = 'pandu:lms:pwChangeInboxSeen'

function readSeen() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeSeen(seenMap) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(seenMap || {}))
  } catch {
    // ignore
  }
}

function normalizeRequestRow(r, idx) {
  const id = r?.request_id ?? r?.requestId ?? r?.id
  const status = String(r?.status || '').toLowerCase() || 'pending'
  const userId = r?.user_id ?? r?.userId ?? r?.student_id ?? r?.studentId
  const name = r?.user_name ?? r?.userName ?? r?.student_name ?? r?.studentName ?? r?.name
  const email = r?.user_email ?? r?.userEmail ?? r?.email
  const requestedAt = r?.requested_at ?? r?.requestedAt ?? r?.created_at ?? r?.createdAt

  return {
    key: id ?? `${idx}`,
    requestId: id,
    status,
    userId,
    name: String(name || '').trim() || (userId != null ? `User ${userId}` : 'User'),
    email: String(email || '').trim(),
    requestedAt: requestedAt ? String(requestedAt) : '',
    otp: String(r?.otp || '').trim(),
    otpExpiresAt: String(r?.otp_expires_at ?? r?.otpExpiresAt ?? '').trim(),
    maxAttempts: r?.max_attempts ?? r?.maxAttempts,
    raw: r,
  }
}

export const usePasswordChangeInboxStore = defineStore('passwordChangeInbox', {
  state: () => ({
    items: [],
    status: 'idle',
    error: null,
    seenById: readSeen(),
    lastFetchedAt: 0,
  }),
  getters: {
    unseenCount: (state) => {
      return state.items.filter((it) => {
        const id = it?.requestId
        if (id == null) return false
        const unseen = !state.seenById[String(id)]
        const status = String(it?.status || '').toLowerCase()
        // Count only actionable requests as "unseen".
        const actionable = status === 'pending' || status === 'requested' || status === 'waiting' || status === 'otp_requested'
        return unseen && actionable
      }).length
    },
  },
  actions: {
    markAllSeen() {
      const next = { ...(this.seenById || {}) }
      for (const it of this.items) {
        if (it?.requestId != null) next[String(it.requestId)] = true
      }
      this.seenById = next
      writeSeen(next)
    },

    markSeen(requestId) {
      if (requestId == null) return
      const next = { ...(this.seenById || {}) }
      next[String(requestId)] = true
      this.seenById = next
      writeSeen(next)
    },

    async fetchInbox({ services, page = 1, perPage = 50, force = false } = {}) {
      if (!services?.passwordChangeInbox?.inbox) throw new Error('PasswordChangeInbox service not available')
      const now = Date.now()
      if (!force && this.status === 'success' && now - this.lastFetchedAt < 15_000) return this.items
      if (this.status === 'loading') return this.items

      this.status = 'loading'
      this.error = null
      try {
        const res = await services.passwordChangeInbox.inbox({ page, per_page: perPage })
        const list = normalizeListResponse(res)
        const mapped = list.map(normalizeRequestRow)
        this.items = mapped
        this.lastFetchedAt = Date.now()
        this.status = 'success'
        return this.items
      } catch (e) {
        this.status = 'error'
        this.error = e?.message || 'Gagal memuat inbox'
        throw e
      }
    },

    async issueOtp({ services, requestId } = {}) {
      if (!services?.passwordChangeInbox?.issueOtp) throw new Error('PasswordChangeInbox service not available')
      const id = Number(requestId)
      if (!Number.isFinite(id) || id <= 0) throw new Error('Request ID tidak valid')

      const res = await services.passwordChangeInbox.issueOtp(id)
      if (res?.success === false) throw new Error(res?.message || 'Gagal issue OTP')
      const data = res?.data ?? res
      const payload = data?.data ?? data

      // Update local row with OTP response.
      this.items = this.items.map((it) => {
        if (Number(it.requestId) !== id) return it
        return {
          ...it,
          status: String(payload?.status || it.status || 'otp_issued').toLowerCase(),
          otp: String(payload?.otp || it.otp || '').trim(),
          otpExpiresAt: String(payload?.otp_expires_at ?? payload?.otpExpiresAt ?? it.otpExpiresAt ?? '').trim(),
          maxAttempts: payload?.max_attempts ?? payload?.maxAttempts ?? it.maxAttempts,
        }
      })
      this.markSeen(id)
      return res
    },

    async reject({ services, requestId, reason } = {}) {
      if (!services?.passwordChangeInbox?.reject) throw new Error('PasswordChangeInbox service not available')
      const id = Number(requestId)
      if (!Number.isFinite(id) || id <= 0) throw new Error('Request ID tidak valid')

      const res = await services.passwordChangeInbox.reject(id, { reason })
      if (res?.success === false) throw new Error(res?.message || 'Gagal menolak request')

      this.items = this.items.map((it) => {
        if (Number(it.requestId) !== id) return it
        return { ...it, status: 'rejected' }
      })
      this.markSeen(id)
      return res
    },

    clear() {
      this.items = []
      this.status = 'idle'
      this.error = null
      this.lastFetchedAt = 0
      this.seenById = readSeen()
    },
  },
})
