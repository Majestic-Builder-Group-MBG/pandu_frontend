<template>
  <section class="space-y-6">
    <header class="ink-card bg-paper-grid p-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Security</p>
          <h1 class="mt-2 text-2xl font-semibold">Inbox</h1>
          <p class="mt-2 text-sm font-semibold text-ink/60">Permintaan ganti password yang perlu diproses.</p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
            :disabled="inbox.status === 'loading'"
            @click="refresh"
          >
            {{ inbox.status === 'loading' ? 'Memuat...' : 'Refresh' }}
          </button>
          <RouterLink
            to="/dashboard"
            class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
          >
            Back
          </RouterLink>
        </div>
      </div>
    </header>

    <p v-if="inbox.error" class="ink-card border-rose-700 bg-rose-50 p-4 text-sm font-semibold text-rose-900">
      {{ inbox.error }}
    </p>

    <div v-if="inbox.status === 'loading'" class="ink-card p-6">
      <p class="text-sm font-semibold text-ink/70">Memuat inbox...</p>
    </div>

    <div v-else-if="!rows.length" class="ink-card p-10 text-center">
      <p class="text-sm font-extrabold">Belum ada request.</p>
      <p class="mt-2 text-sm font-semibold text-ink/60">Kalau ada student request, akan muncul di sini.</p>
    </div>

    <div v-else class="space-y-3">
      <article
        v-for="r in rows"
        :key="r.key"
        class="ink-card p-5"
        :class="isUnseen(r) ? 'ring-2 ring-accent/70' : ''"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="truncate text-sm font-extrabold">{{ r.name }}</p>
            <p v-if="r.email" class="mt-1 truncate text-xs font-bold text-ink/60">{{ r.email }}</p>
            <p v-if="r.requestedAt" class="mt-1 text-xs font-bold text-ink/50">{{ formatWhen(r.requestedAt) }}</p>
          </div>

          <span class="rounded-xl border-2 border-ink bg-cloud px-3 py-1 text-xs font-extrabold">
            {{ statusLabel(r.status) }}
          </span>
        </div>

        <div v-if="r.otp" class="mt-4 rounded-2xl border-2 border-ink bg-accent-soft p-4 shadow-ink-sm">
          <p class="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink/70">OTP</p>
          <div class="mt-2 flex flex-wrap items-center gap-2">
            <span class="rounded-xl border-2 border-ink bg-paper px-3 py-2 font-mono text-sm font-black shadow-ink-sm">{{ r.otp }}</span>
            <button
              type="button"
              class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-xs font-extrabold shadow-ink-sm hover:bg-accent/20"
              @click="copyOtp(r.otp)"
            >
              Copy
            </button>
          </div>
          <p v-if="r.otpExpiresAt" class="mt-2 text-xs font-bold text-ink/60">Expires: {{ formatWhen(r.otpExpiresAt) }}</p>
          <p v-if="r.maxAttempts" class="mt-1 text-xs font-bold text-ink/60">Max attempts: {{ r.maxAttempts }}</p>
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="rounded-xl border-2 border-ink bg-accent px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="actionLoadingId === r.requestId || !canIssueOtp(r)"
            @click="issueOtp(r)"
          >
            {{ actionLoadingId === r.requestId && actionKind === 'issue' ? 'Memproses...' : 'Issue OTP' }}
          </button>
          <button
            type="button"
            class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="actionLoadingId === r.requestId"
            @click="openReject(r)"
          >
            Reject
          </button>
          <button
            type="button"
            class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm hover:bg-accent/20"
            @click="markSeen(r)"
          >
            Mark Read
          </button>
        </div>
      </article>
    </div>

    <BaseModal
      :open="rejectOpen"
      title="Tolak Request"
      kicker="Inbox"
      :subtitle="rejectTarget ? `Tulis alasan penolakan untuk ${rejectTarget.name}.` : ''"
      :full-height="true"
      @close="closeReject"
    >
      <form class="space-y-4" @submit.prevent>
        <label class="block space-y-2">
          <span class="text-sm font-semibold">Reason</span>
          <textarea v-model.trim="rejectReason" class="ink-input min-h-[110px] resize-y" placeholder="Identitas user belum valid" />
        </label>

        <p v-if="rejectError" class="rounded-xl border-2 border-rose-700 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900">
          {{ rejectError }}
        </p>
      </form>

      <template #actions>
        <button
          type="button"
          class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
          :disabled="actionLoadingId != null"
          @click="closeReject"
        >
          Close
        </button>
        <button
          type="button"
          class="rounded-xl border-2 border-ink bg-ink px-4 py-2 text-sm font-extrabold text-paper shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="actionLoadingId != null"
          @click="confirmReject"
        >
          {{ actionKind === 'reject' && actionLoadingId === rejectTarget?.requestId ? 'Memproses...' : 'Reject' }}
        </button>
      </template>
    </BaseModal>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import BaseModal from '@/components/ui/BaseModal.vue'
import { getServices } from '@/services'
import { usePasswordChangeInboxStore } from '@/stores/passwordChangeInbox'

const services = getServices()
const inbox = usePasswordChangeInboxStore()

const actionLoadingId = ref(null)
const actionKind = ref('')

const rejectOpen = ref(false)
const rejectTarget = ref(null)
const rejectReason = ref('')
const rejectError = ref('')

const rows = computed(() => inbox.items)

onMounted(async () => {
  await refresh()
  inbox.markAllSeen()
})

async function refresh() {
  try {
    await inbox.fetchInbox({ services, force: true, page: 1, perPage: 50 })
  } catch {
    // store holds error
  }
}

function statusLabel(s) {
  const v = String(s || '').toLowerCase()
  if (v === 'otp_issued') return 'OTP issued'
  if (v === 'rejected') return 'Rejected'
  if (v === 'confirmed') return 'Confirmed'
  if (v === 'completed') return 'Completed'
  return 'Pending'
}

function formatWhen(iso) {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return String(iso)
    return d.toLocaleString()
  } catch {
    return String(iso)
  }
}

function isUnseen(r) {
  const id = r?.requestId
  if (id == null) return false
  return !inbox.seenById?.[String(id)]
}

function canIssueOtp(r) {
  const st = String(r?.status || '').toLowerCase()
  return st !== 'rejected' && st !== 'confirmed' && st !== 'completed'
}

function markSeen(r) {
  inbox.markSeen(r?.requestId)
}

async function issueOtp(r) {
  const id = r?.requestId
  if (!id) return
  actionLoadingId.value = id
  actionKind.value = 'issue'
  try {
    await inbox.issueOtp({ services, requestId: id })
  } catch {
    // store holds error
  } finally {
    actionLoadingId.value = null
    actionKind.value = ''
  }
}

function openReject(r) {
  rejectError.value = ''
  rejectReason.value = ''
  rejectTarget.value = r
  rejectOpen.value = true
}

function closeReject() {
  rejectOpen.value = false
  rejectTarget.value = null
  rejectReason.value = ''
  rejectError.value = ''
}

async function confirmReject() {
  const id = rejectTarget.value?.requestId
  if (!id) return
  const reason = String(rejectReason.value || '').trim()
  if (!reason) {
    rejectError.value = 'Reason wajib diisi.'
    return
  }

  actionLoadingId.value = id
  actionKind.value = 'reject'
  try {
    await inbox.reject({ services, requestId: id, reason })
    closeReject()
  } catch (e) {
    rejectError.value = e?.message || 'Gagal reject'
  } finally {
    actionLoadingId.value = null
    actionKind.value = ''
  }
}

async function copyOtp(otp) {
  try {
    await navigator.clipboard.writeText(String(otp || ''))
  } catch {
    // ignore
  }
}
</script>
