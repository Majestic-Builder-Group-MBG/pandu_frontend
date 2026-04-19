import { computed, ref } from 'vue'
import {
  buildPushSubscriptionPayload,
  isWebPushSupported,
  requestNotificationPermission,
  subscribeBrowserPush,
} from '@/services/push/webPush'

function normalizeReminder(res) {
  const data = res?.data || res || {}
  return {
    enabled: Boolean(data?.enabled),
    channel: data?.channel || 'in_app',
    notifyBeforeMinutes: Number(data?.notify_before_minutes ?? data?.notifyBeforeMinutes ?? 15),
  }
}

export function useSessionReminder({ services, moduleId, selectedSessionId, isStudent, scheduleOpenAt }) {
  const reminderStatus = ref('idle')
  const reminderError = ref('')
  const reminderEnabled = ref(false)
  const reminderChannel = ref('in_app')
  const reminderLeadMinutes = ref(15)

  const reminderButtonLabel = computed(() => {
    if (reminderStatus.value === 'loading') return 'Memuat...'
    if (reminderStatus.value === 'saving') return 'Menyimpan...'
    return reminderEnabled.value ? 'Pengingat Aktif' : 'Ingatkan'
  })

  const isSessionAlreadyOpen = computed(() => {
    if (!scheduleOpenAt.value) return false
    const d = new Date(scheduleOpenAt.value)
    if (Number.isNaN(d.getTime())) return false
    return d.getTime() <= Date.now()
  })

  const canShowReminder = computed(() => isStudent.value && Boolean(selectedSessionId.value))

  async function loadReminder() {
    if (!canShowReminder.value) return
    reminderStatus.value = 'loading'
    reminderError.value = ''
    try {
      const res = await services.reminders.getSessionReminder(moduleId.value, selectedSessionId.value)
      const normalized = normalizeReminder(res)
      reminderEnabled.value = normalized.enabled
      reminderChannel.value = normalized.channel
      reminderLeadMinutes.value = normalized.notifyBeforeMinutes
      reminderStatus.value = 'success'
    } catch (e) {
      if (e?.status === 404) {
        reminderEnabled.value = false
        reminderStatus.value = 'success'
        return
      }
      reminderStatus.value = 'error'
      reminderError.value = e?.message || 'Gagal memuat reminder'
    }
  }

  async function toggleReminder() {
    if (!canShowReminder.value || !selectedSessionId.value) return
    if (isSessionAlreadyOpen.value) return

    reminderStatus.value = 'saving'
    reminderError.value = ''
    try {
      if (reminderEnabled.value) {
        await services.reminders.deleteSessionReminder(moduleId.value, selectedSessionId.value)
        reminderEnabled.value = false
      } else {
        if (isWebPushSupported()) {
          const permission = await requestNotificationPermission()
          if (permission !== 'granted') {
            throw new Error('Izin notifikasi browser belum diberikan')
          }

          const subscription = await subscribeBrowserPush()
          await services.pushSubscriptions.create(buildPushSubscriptionPayload(subscription))
        }

        await services.reminders.setSessionReminder(moduleId.value, selectedSessionId.value, {
          enabled: true,
          channel: reminderChannel.value,
          notify_before_minutes: reminderLeadMinutes.value,
        })
        reminderEnabled.value = true
      }
      reminderStatus.value = 'success'
    } catch (e) {
      reminderStatus.value = 'error'
      reminderError.value = e?.message || 'Gagal menyimpan reminder'
    }
  }

  function resetReminderState() {
    reminderStatus.value = 'idle'
    reminderError.value = ''
    reminderEnabled.value = false
    reminderChannel.value = 'in_app'
    reminderLeadMinutes.value = 15
  }

  return {
    reminderStatus,
    reminderError,
    reminderEnabled,
    reminderButtonLabel,
    isSessionAlreadyOpen,
    canShowReminder,
    loadReminder,
    toggleReminder,
    resetReminderState,
  }
}
