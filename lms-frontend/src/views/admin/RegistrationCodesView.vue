<template>
  <section class="space-y-6">
    <header class="ink-card bg-paper-grid p-6">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Admin</p>
          <h1 class="mt-2 text-2xl font-semibold">Registration Codes</h1>
          <p class="mt-2 text-sm font-semibold text-ink/60">Kelola kode registrasi untuk onboarding teacher/student.</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
            :disabled="busyAction === 'archive'"
            @click="archiveExpired"
          >
            {{ busyAction === 'archive' ? 'Memproses...' : 'Arsipkan Expired' }}
          </button>
          <button
            type="button"
            class="rounded-xl border-2 border-ink bg-rose-600 px-4 py-2 text-sm font-extrabold text-white shadow-ink-sm"
            :disabled="busyAction === 'delete'"
            @click="openDeleteExpired"
          >
            Hapus Expired
          </button>
          <button
            type="button"
            class="rounded-xl border-2 border-ink bg-accent px-4 py-2 text-sm font-extrabold shadow-ink-sm"
            :disabled="isLoading"
            @click="reload"
          >
            Refresh
          </button>
        </div>
      </div>
    </header>

    <div v-if="!canManageCodes" class="ink-card p-8 text-center">
      <p class="text-sm font-extrabold">Akses ditolak.</p>
      <p class="mt-2 text-sm font-semibold text-ink/60">Halaman ini hanya untuk admin/teacher.</p>
      <RouterLink
        to="/dashboard"
        class="mt-5 inline-flex rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
      >
        Kembali ke Dashboard
      </RouterLink>
    </div>

    <template v-else>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <article class="ink-card p-4" v-for="s in summaryCards" :key="s.label">
          <p class="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/60">{{ s.label }}</p>
          <p class="mt-2 text-2xl font-semibold">{{ s.value }}</p>
        </article>
      </div>

      <article class="ink-card p-6">
        <h2 class="text-lg font-semibold">Create Registration Code</h2>
        <form class="mt-4 grid gap-4 md:grid-cols-2" @submit.prevent="createCode">
          <label class="space-y-1">
            <span class="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/60">Target Role</span>
            <select v-model="form.targetRole" class="ink-input">
              <option value="student">student</option>
              <option v-if="isAdmin" value="teacher">teacher</option>
            </select>
          </label>
          <label class="space-y-1">
            <span class="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/60">Code Length</span>
            <input v-model.number="form.codeLength" type="number" min="4" max="6" class="ink-input" />
          </label>
          <label class="space-y-1">
            <span class="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/60">Max Uses</span>
            <input v-model.number="form.maxUses" type="number" min="1" class="ink-input" />
          </label>
          <label class="space-y-1">
            <span class="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/60">Expires In (hours)</span>
            <input v-model.number="form.expiresInHours" type="number" min="1" class="ink-input" />
          </label>
          <div class="md:col-span-2 flex items-center justify-end gap-2">
            <button
              type="button"
              class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
              :disabled="isCreating"
              @click="resetForm"
            >
              Reset
            </button>
            <button
              type="submit"
              class="rounded-xl border-2 border-ink bg-accent px-4 py-2 text-sm font-extrabold shadow-ink-sm"
              :disabled="isCreating"
            >
              {{ isCreating ? 'Membuat...' : 'Create Code' }}
            </button>
          </div>
        </form>

        <p v-if="feedback.message" class="mt-4 rounded-xl border-2 px-4 py-3 text-sm font-semibold" :class="feedbackClass">
          {{ feedback.message }}
        </p>
      </article>

      <article class="ink-card p-6">
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-lg font-semibold">Daftar Kode</h2>
          <span class="ink-chip bg-accent/50">{{ rows.length }}</span>
        </div>

        <p v-if="isLoading" class="mt-4 text-sm font-semibold text-ink/60">Memuat kode...</p>
        <p v-else-if="error" class="mt-4 text-sm font-semibold text-ink/60">{{ error }}</p>

        <div v-else class="mt-4 overflow-x-auto">
          <table class="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr class="text-left text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">
                <th class="px-2 py-1">Code</th>
                <th class="px-2 py-1">Role</th>
                <th class="px-2 py-1">Status</th>
                <th class="px-2 py-1">Usage</th>
                <th class="px-2 py-1">Expires</th>
                <th class="px-2 py-1">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in rows" :key="r.id" class="rounded-2xl border-2 border-ink bg-paper shadow-ink-sm">
                <td class="px-2 py-3 font-mono text-sm font-extrabold">{{ r.code }}</td>
                <td class="px-2 py-3 text-sm font-semibold">{{ r.targetRole }}</td>
                <td class="px-2 py-3 text-sm font-semibold">
                  <span class="rounded-lg px-2 py-1 text-xs font-extrabold" :class="statusClass(r)">{{ statusLabel(r) }}</span>
                </td>
                <td class="px-2 py-3 text-sm font-semibold">{{ r.usedCount }} / {{ r.maxUses }}</td>
                <td class="px-2 py-3 text-sm font-semibold">{{ formatDateTime(r.expiresAt) }}</td>
                <td class="px-2 py-3">
                  <div class="flex flex-wrap gap-2">
                    <button
                      type="button"
                      class="rounded-xl border-2 border-ink bg-paper px-3 py-1.5 text-xs font-extrabold"
                      :disabled="usageLoadingById[r.id]"
                      @click="openUsages(r)"
                    >
                      Usages
                    </button>
                    <button
                      type="button"
                      class="rounded-xl border-2 border-ink bg-rose-600 px-3 py-1.5 text-xs font-extrabold text-white"
                      :disabled="revokeLoadingById[r.id] || !r.isActive"
                      @click="revokeCode(r)"
                    >
                      {{ revokeLoadingById[r.id] ? '...' : 'Revoke' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </template>

    <BaseModal :open="usagesOpen" title="Riwayat Penggunaan Kode" kicker="Register Codes" @close="closeUsages">
      <p class="text-sm font-semibold text-ink/70">Kode: <span class="font-mono font-extrabold">{{ selectedCodeLabel }}</span></p>
      <div class="mt-4 space-y-2">
        <p v-if="usageStatus === 'loading'" class="text-sm font-semibold text-ink/60">Memuat usages...</p>
        <p v-else-if="usageStatus === 'error'" class="text-sm font-semibold text-ink/60">{{ usageError }}</p>
        <p v-else-if="!usages.length" class="text-sm font-semibold text-ink/60">Belum ada penggunaan kode ini.</p>
        <article v-else v-for="(u, idx) in usages" :key="`${u.userId || 'u'}-${idx}`" class="rounded-xl border-2 border-ink bg-paper p-3">
          <p class="text-sm font-extrabold">{{ u.userName || 'User' }}</p>
          <p class="mt-1 text-xs font-semibold text-ink/60">{{ u.userEmail || '-' }}</p>
          <p class="mt-1 text-xs font-semibold text-ink/60">{{ formatDateTime(u.usedAt) }}</p>
        </article>
      </div>
    </BaseModal>

    <ConfirmDialog
      :open="deleteExpiredOpen"
      kicker="Register Codes"
      title="Hapus Semua Kode Expired"
      message="Tindakan ini akan menghapus permanen semua kode yang sudah expired."
      confirm-text="Hapus Permanen"
      :is-loading="busyAction === 'delete'"
      @cancel="deleteExpiredOpen = false"
      @confirm="deleteExpired"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getServices } from '@/services'
import { normalizeListResponse } from '@/services/mappers/list'
import BaseModal from '@/components/ui/BaseModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const auth = useAuthStore()
const services = getServices()

const isAdmin = computed(() => auth.user?.role === 'admin')
const canManageCodes = computed(() => auth.user?.role === 'admin' || auth.user?.role === 'teacher')

const form = reactive({
  targetRole: 'student',
  codeLength: 6,
  maxUses: 20,
  expiresInHours: 48,
})

const isLoading = ref(false)
const isCreating = ref(false)
const error = ref('')
const feedback = ref({ type: '', message: '' })
const rows = ref([])
const summary = ref({
  total_codes: 0,
  active_codes: 0,
  expired_codes: 0,
  used_codes: 0,
  used_up_codes: 0,
  remaining_uses_total: 0,
})

const revokeLoadingById = reactive({})
const usageLoadingById = reactive({})
const busyAction = ref('')
const deleteExpiredOpen = ref(false)

const usagesOpen = ref(false)
const usageStatus = ref('idle')
const usageError = ref('')
const selectedCodeId = ref(null)
const selectedCodeLabel = ref('')
const usages = ref([])

const summaryCards = computed(() => [
  { label: 'Total', value: summary.value.total_codes || 0 },
  { label: 'Active', value: summary.value.active_codes || 0 },
  { label: 'Expired', value: summary.value.expired_codes || 0 },
  { label: 'Used', value: summary.value.used_codes || 0 },
  { label: 'Used Up', value: summary.value.used_up_codes || 0 },
  { label: 'Remaining', value: summary.value.remaining_uses_total || 0 },
])

const feedbackClass = computed(() => {
  if (feedback.value.type === 'error') return 'border-rose-300 bg-rose-50 text-rose-800'
  return 'border-emerald-300 bg-emerald-50 text-emerald-800'
})

function normalizeCode(item) {
  const maxUses = Number(item?.max_uses ?? item?.maxUses ?? 0)
  const usedCount = Number(item?.used_count ?? item?.usedCount ?? 0)
  const remainingUses = Number(item?.remaining_uses ?? item?.remainingUses ?? Math.max(maxUses - usedCount, 0))
  const expiresAt = item?.expires_at || item?.expiresAt || null

  return {
    id: item?.id,
    code: item?.code || '-',
    targetRole: item?.target_role || item?.targetRole || '-',
    isActive: Boolean(item?.is_active ?? item?.isActive),
    usedCount: Number.isFinite(usedCount) ? usedCount : 0,
    maxUses: Number.isFinite(maxUses) && maxUses > 0 ? maxUses : '-',
    remainingUses: Number.isFinite(remainingUses) ? remainingUses : 0,
    expiresAt,
  }
}

function normalizeUsage(item) {
  const user = item?.user || {}
  return {
    userId: user?.id || item?.user_id || null,
    userName: user?.name || item?.user_name || item?.name || '-',
    userEmail: user?.email || item?.user_email || item?.email || '-',
    usedAt: item?.used_at || item?.created_at || item?.createdAt || null,
  }
}

function setFeedback(type, message) {
  feedback.value = { type, message }
}

function resetForm() {
  form.targetRole = 'student'
  form.codeLength = 6
  form.maxUses = 20
  form.expiresInHours = 48
}

function formatDateTime(value) {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '-'
  try {
    return d.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return d.toLocaleString()
  }
}

function statusLabel(row) {
  if (!row.isActive) return 'revoked'
  if (row.expiresAt && new Date(row.expiresAt).getTime() < Date.now()) return 'expired'
  if (typeof row.maxUses === 'number' && row.remainingUses <= 0) return 'used up'
  return 'active'
}

function statusClass(row) {
  const label = statusLabel(row)
  if (label === 'active') return 'bg-emerald-100 text-emerald-800'
  if (label === 'used up') return 'bg-amber-100 text-amber-800'
  return 'bg-rose-100 text-rose-800'
}

async function loadSummary() {
  try {
    const res = await services.registerCodes.summary()
    summary.value = { ...summary.value, ...(res?.data || {}) }
  } catch {
    // Keep page usable even if summary fails.
  }
}

async function loadCodes() {
  isLoading.value = true
  error.value = ''

  try {
    const res = await services.registerCodes.list()
    rows.value = normalizeListResponse(res).map(normalizeCode)
  } catch (e) {
    error.value = e?.message || 'Gagal memuat register codes'
  } finally {
    isLoading.value = false
  }
}

async function reload() {
  setFeedback('', '')
  await Promise.all([loadSummary(), loadCodes()])
}

async function createCode() {
  if (!canManageCodes.value) return

  setFeedback('', '')
  isCreating.value = true
  try {
    await services.registerCodes.create({
      target_role: isAdmin.value ? form.targetRole : 'student',
      code_length: form.codeLength,
      max_uses: form.maxUses,
      expires_in_hours: form.expiresInHours,
    })
    setFeedback('success', 'Registration code berhasil dibuat.')
    await reload()
  } catch (e) {
    setFeedback('error', e?.message || 'Gagal membuat registration code')
  } finally {
    isCreating.value = false
  }
}

async function revokeCode(row) {
  if (!row?.id) return
  revokeLoadingById[row.id] = true
  try {
    await services.registerCodes.revoke(row.id)
    setFeedback('success', `Kode ${row.code} berhasil dinonaktifkan.`)
    await reload()
  } catch (e) {
    setFeedback('error', e?.message || 'Gagal revoke kode')
  } finally {
    revokeLoadingById[row.id] = false
  }
}

async function openUsages(row) {
  selectedCodeId.value = row?.id || null
  selectedCodeLabel.value = row?.code || '-'
  usages.value = []
  usageError.value = ''
  usagesOpen.value = true

  if (!selectedCodeId.value) return

  usageLoadingById[selectedCodeId.value] = true
  usageStatus.value = 'loading'
  try {
    const res = await services.registerCodes.usages(selectedCodeId.value)
    usages.value = normalizeListResponse(res).map(normalizeUsage)
    usageStatus.value = 'success'
  } catch (e) {
    usageStatus.value = 'error'
    usageError.value = e?.message || 'Gagal memuat riwayat penggunaan'
  } finally {
    usageLoadingById[selectedCodeId.value] = false
  }
}

function closeUsages() {
  usagesOpen.value = false
  usageStatus.value = 'idle'
  usageError.value = ''
  selectedCodeId.value = null
  selectedCodeLabel.value = ''
  usages.value = []
}

async function archiveExpired() {
  busyAction.value = 'archive'
  setFeedback('', '')
  try {
    await services.registerCodes.archiveExpired()
    setFeedback('success', 'Kode expired berhasil diarsipkan.')
    await reload()
  } catch (e) {
    setFeedback('error', e?.message || 'Gagal mengarsipkan kode expired')
  } finally {
    busyAction.value = ''
  }
}

function openDeleteExpired() {
  deleteExpiredOpen.value = true
}

async function deleteExpired() {
  busyAction.value = 'delete'
  setFeedback('', '')
  try {
    await services.registerCodes.deleteExpired()
    deleteExpiredOpen.value = false
    setFeedback('success', 'Kode expired berhasil dihapus permanen.')
    await reload()
  } catch (e) {
    setFeedback('error', e?.message || 'Gagal menghapus kode expired')
  } finally {
    busyAction.value = ''
  }
}

onMounted(async () => {
  if (!canManageCodes.value) return
  await reload()
})
</script>
