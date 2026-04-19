import { computed, ref } from 'vue'

function isoToLocalInput(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''

  const pad = (n) => String(n).padStart(2, '0')
  const yyyy = d.getFullYear()
  const mm = pad(d.getMonth() + 1)
  const dd = pad(d.getDate())
  const hh = pad(d.getHours())
  const mi = pad(d.getMinutes())
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
}

export function useSessionSchedule({ services, moduleId, selectedSessionId, canManageSessions, isStudent, onLocked, onUnlocked }) {
  const scheduleStatus = ref('idle')
  const scheduleError = ref('')
  const scheduleOpenAt = ref(null)

  const scheduleOpen = ref(false)
  const scheduleSaving = ref(false)
  const scheduleModalError = ref('')
  const scheduleDraftLocal = ref('')

  const scheduleHuman = computed(() => {
    if (!scheduleOpenAt.value) return ''
    const d = new Date(scheduleOpenAt.value)
    if (Number.isNaN(d.getTime())) return ''
    try {
      return d.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    } catch {
      return d.toLocaleString()
    }
  })

  const scheduleLabel = computed(() => {
    if (!selectedSessionId.value) return '-'
    if (scheduleStatus.value === 'loading') return 'memuat...'
    if (scheduleError.value) return 'gagal memuat'
    if (!scheduleOpenAt.value) return 'belum dibuka'
    return scheduleHuman.value || scheduleOpenAt.value
  })

  function isLockedForStudent() {
    const openAt = scheduleOpenAt.value ? new Date(scheduleOpenAt.value) : null
    return (
      isStudent.value &&
      (!scheduleOpenAt.value || (openAt && !Number.isNaN(openAt.getTime()) && openAt.getTime() > Date.now()))
    )
  }

  async function loadSchedule(sessionId) {
    scheduleStatus.value = 'loading'
    scheduleError.value = ''
    scheduleOpenAt.value = null

    try {
      const res = await services.sessions.getSchedule(moduleId.value, sessionId)
      const openAt = res?.data?.open_at || res?.data?.openAt || res?.open_at || res?.openAt || null

      if (openAt) {
        const d = new Date(openAt)
        if (!Number.isNaN(d.getTime())) {
          scheduleOpenAt.value = d.toISOString()
        }
      }

      scheduleStatus.value = 'success'
    } catch (e) {
      scheduleStatus.value = 'error'
      scheduleError.value = e?.message || 'Gagal memuat jadwal'
    }
  }

  function openScheduleModal() {
    scheduleModalError.value = ''
    scheduleDraftLocal.value = isoToLocalInput(scheduleOpenAt.value)
    scheduleOpen.value = true
  }

  async function openScheduleForSession(sessionId) {
    if (!canManageSessions.value) return
    if (!sessionId) return

    if (selectedSessionId.value !== sessionId) {
      selectedSessionId.value = sessionId
    }

    await loadSchedule(sessionId)
    openScheduleModal()
  }

  function closeScheduleModal() {
    scheduleOpen.value = false
    scheduleSaving.value = false
    scheduleModalError.value = ''
  }

  async function saveSchedule() {
    if (!canManageSessions.value || !selectedSessionId.value) return

    scheduleSaving.value = true
    scheduleModalError.value = ''
    try {
      let iso = null
      if (scheduleDraftLocal.value) {
        const d = new Date(scheduleDraftLocal.value)
        if (Number.isNaN(d.getTime())) throw new Error('Format open_at tidak valid. Gunakan format tanggal ISO-8601')
        iso = d.toISOString()
      }

      await services.sessions.setSchedule(moduleId.value, selectedSessionId.value, { open_at: iso })
      await loadSchedule(selectedSessionId.value)

      if (isStudent.value) {
        if (isLockedForStudent()) {
          if (typeof onLocked === 'function') onLocked()
        } else if (typeof onUnlocked === 'function') {
          await onUnlocked()
        }
      }

      closeScheduleModal()
    } catch (e) {
      scheduleModalError.value = e?.message || 'Gagal menyimpan jadwal'
    } finally {
      scheduleSaving.value = false
    }
  }

  async function clearSchedule() {
    scheduleDraftLocal.value = ''
    await saveSchedule()
  }

  function resetScheduleState() {
    closeScheduleModal()
    scheduleStatus.value = 'idle'
    scheduleError.value = ''
    scheduleOpenAt.value = null
  }

  return {
    scheduleStatus,
    scheduleError,
    scheduleOpenAt,
    scheduleOpen,
    scheduleSaving,
    scheduleModalError,
    scheduleDraftLocal,
    scheduleHuman,
    scheduleLabel,
    isLockedForStudent,
    loadSchedule,
    openScheduleModal,
    openScheduleForSession,
    closeScheduleModal,
    saveSchedule,
    clearSchedule,
    resetScheduleState,
  }
}
