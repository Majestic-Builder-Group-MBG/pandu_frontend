import { computed, ref } from 'vue'
import { normalizeListResponse } from '@/services/mappers/list'

function mapSession(s) {
  return {
    id: s?.id,
    title: s?.title || `Sesi ${s?.sort_order || ''}`.trim(),
    description: s?.description || '',
    sortOrder: typeof s?.sort_order === 'number' ? s.sort_order : typeof s?.sortOrder === 'number' ? s.sortOrder : 999,
  }
}

export function useModuleSessions({ services, moduleId, preselectSessionId, canManageSessions, onDeleteError }) {
  const sessions = ref([])
  const sessionsStatus = ref('idle')
  const sessionsError = ref('')

  const selectedSessionId = ref(null)

  const deleteOpen = ref(false)
  const deleteSession = ref(null)
  const deleteLoading = ref(false)

  const createSessionOpen = ref(false)
  const createSessionLoading = ref(false)
  const createSessionError = ref('')
  const createSessionTitle = ref('')
  const createSessionOpenAtLocal = ref('')

  const deleteMessage = computed(() => {
    const t = deleteSession.value?.title || 'sesi ini'
    return `Kamu yakin mau menghapus ${t}? Tindakan ini tidak bisa dibatalkan.`
  })

  async function loadSessions() {
    sessionsStatus.value = 'loading'
    sessionsError.value = ''
    try {
      const res = await services.sessions.list(moduleId.value)
      const list = normalizeListResponse(res)
      sessions.value = list.map(mapSession).sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999))

      sessionsStatus.value = 'success'

      const wanted = preselectSessionId.value
      if (wanted && sessions.value.some((s) => s.id === wanted)) {
        selectSession(wanted)
        return
      }
    } catch (e) {
      sessionsStatus.value = 'error'
      sessionsError.value = e?.message || 'Gagal memuat sesi'
    }
  }

  function selectSession(id) {
    selectedSessionId.value = id
  }

  function openCreateSession() {
    createSessionError.value = ''
    createSessionTitle.value = ''
    createSessionOpenAtLocal.value = ''
    createSessionOpen.value = true
  }

  function closeCreateSession() {
    createSessionOpen.value = false
    createSessionLoading.value = false
    createSessionError.value = ''
  }

  async function createSession() {
    if (!canManageSessions.value) return
    createSessionError.value = ''

    if (!createSessionTitle.value.trim()) {
      createSessionError.value = 'Judul sesi wajib diisi.'
      return
    }

    createSessionLoading.value = true
    try {
      const res = await services.sessions.create(moduleId.value, { title: createSessionTitle.value.trim() })
      const newId = res?.data?.id || res?.id || null

      if (createSessionOpenAtLocal.value && newId) {
        const d = new Date(createSessionOpenAtLocal.value)
        if (Number.isNaN(d.getTime())) throw new Error('Format open_at tidak valid. Gunakan format tanggal ISO-8601')
        await services.sessions.setSchedule(moduleId.value, newId, { open_at: d.toISOString() })
      }

      await loadSessions()
      if (newId) selectSession(newId)
      closeCreateSession()
    } catch (e) {
      createSessionError.value = e?.message || 'Gagal membuat sesi'
    } finally {
      createSessionLoading.value = false
    }
  }

  function openDelete(s) {
    deleteSession.value = s
    deleteOpen.value = true
  }

  function closeDelete() {
    deleteOpen.value = false
    deleteSession.value = null
    deleteLoading.value = false
  }

  async function confirmDelete() {
    if (!deleteSession.value?.id) return
    deleteLoading.value = true
    try {
      await services.sessions.delete(moduleId.value, deleteSession.value.id)
      await loadSessions()
      if (selectedSessionId.value === deleteSession.value.id) {
        selectedSessionId.value = sessions.value[0]?.id || null
      }
    } catch (e) {
      if (typeof onDeleteError === 'function') {
        onDeleteError(e?.message || 'Gagal menghapus sesi')
      }
    } finally {
      closeDelete()
    }
  }

  function resetSessionsState() {
    selectedSessionId.value = null
    closeDelete()
    closeCreateSession()
  }

  return {
    sessions,
    sessionsStatus,
    sessionsError,
    selectedSessionId,
    deleteOpen,
    deleteLoading,
    deleteMessage,
    createSessionOpen,
    createSessionLoading,
    createSessionError,
    createSessionTitle,
    createSessionOpenAtLocal,
    loadSessions,
    selectSession,
    openCreateSession,
    closeCreateSession,
    createSession,
    openDelete,
    closeDelete,
    confirmDelete,
    resetSessionsState,
  }
}
