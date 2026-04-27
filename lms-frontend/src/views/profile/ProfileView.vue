<template>
  <section class="space-y-6">

    <header class="ink-card bg-paper-grid p-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Account</p>
          <h1 class="mt-2 text-2xl font-semibold">Profile</h1>
        </div>

        <RouterLink
          to="/dashboard"
          class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
        >
          Back
        </RouterLink>
      </div>
    </header>

    <div class="grid gap-6 lg:grid-cols-[420px_1fr]">
      <article class="ink-card p-6">
        <div class="flex flex-col items-center text-center">
          <div class="h-24 w-24 overflow-hidden rounded-full border-2 border-ink bg-paper shadow-ink-sm">
            <img :src="photoSrc" alt="Profile" class="h-full w-full object-cover" />
          </div>

          <p class="mt-4 text-base font-extrabold">{{ displayName }}</p>
          <p v-if="emailLabel" class="mt-1 text-xs font-bold text-ink/60">{{ emailLabel }}</p>
          <p v-if="roleLabel" class="mt-2 text-xs font-bold text-ink/60">{{ roleLabel }}</p>

          <button
            type="button"
            class="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-accent px-5 py-3 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            @click="editOpen = true"
          >
            Edit Profile
          </button>
        </div>
      </article>

      <main class="space-y-3">
        <button
          type="button"
          class="flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-paper px-5 py-4 text-left text-sm font-extrabold shadow-ink-sm hover:bg-accent/20"
          @click="pwOpen = true"
        >
          Change Password
          <span class="text-ink/60">›</span>
        </button>

        <div class="pt-2">
          <button
            type="button"
            class="w-full rounded-2xl border-2 border-ink bg-ink px-5 py-4 text-sm font-extrabold text-paper shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            @click="logout"
          >
            Logout
          </button>
        </div>
      </main>
    </div>

      <BaseModal
        :open="editOpen"
        title="Edit Profile"
        kicker="Profile"
        @close="editOpen = false"
      >
        <form class="space-y-4" @submit.prevent>
          <div class="flex items-center gap-4">
          <div class="relative h-16 w-16 overflow-hidden rounded-full border-2 border-ink bg-paper shadow-ink-sm">
            <img :src="photoSrc" alt="Profile" class="h-full w-full object-cover" />

            <button
              type="button"
              class="absolute inset-0 grid place-items-center bg-ink/50 text-paper transition hover:bg-ink/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed"
              aria-label="Ubah foto profile"
              title="Ubah foto profile"
              :disabled="profile.photoStatus === 'loading'"
              @click="pickPhoto"
            >
              <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                <path
                  d="M4 20h4l10.5-10.5a2 2 0 0 0 0-3L16.5 4.5a2 2 0 0 0-3 0L3 15v5Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
                <path d="M12.5 6.5l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <div class="min-w-0">
            <p class="truncate text-sm font-extrabold">{{ displayName }}</p>
            <p v-if="emailLabel" class="mt-1 truncate text-xs font-bold text-ink/60">{{ emailLabel }}</p>
          </div>
        </div>

          <label class="block space-y-2">
            <span class="text-sm font-semibold">Nama</span>
            <input v-model.trim="nameDraft" class="ink-input" placeholder="Nama kamu" :disabled="profile.status === 'loading'" />
          </label>

          <p class="text-xs font-bold text-ink/50">
            Ubah foto: klik icon pensil di avatar. Foto akan dicrop dulu sebelum diupload.
          </p>

        <p v-if="profile.error" class="rounded-xl border-2 border-rose-700 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900">
          {{ profile.error }}
        </p>
        <p v-if="profile.photoError" class="text-xs font-bold text-rose-700">{{ profile.photoError }}</p>
      </form>

      <template #actions>
        <button
          type="button"
          class="rounded-xl border-2 border-ink bg-accent px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="profile.status === 'loading'"
          @click="saveName"
        >
          {{ profile.status === 'loading' ? 'Menyimpan...' : 'Simpan' }}
        </button>
      </template>
    </BaseModal>

    <BaseModal
      :open="pwOpen"
      title="Change Password"
      kicker="Security"
      subtitle="Flow OTP 3 digit: request dulu, lalu konfirmasi OTP. Setelah sukses, kamu akan logout dan perlu login ulang."
      :full-height="true"
      @close="closePw"
    >
      <form class="space-y-4" @submit.prevent>
        <section class="rounded-2xl border-2 border-ink bg-cloud p-4">
          <p class="text-sm font-extrabold">Request</p>

          <label class="mt-3 block space-y-1.5">
            <span class="text-sm font-semibold">Password baru</span>
            <input
              v-model="pwNew"
              type="password"
              class="ink-input py-2.5"
              placeholder="passwordBaru123"
              :disabled="pwRequestStatus === 'loading' || pwConfirmStatus === 'loading'"
            />
          </label>

          <p v-if="pwRequestError" class="mt-3 text-xs font-bold text-rose-700">{{ pwRequestError }}</p>
          <p v-if="pwRequestSuccess" class="mt-3 text-xs font-bold text-emerald-800">{{ pwRequestSuccess }}</p>

          <button
            type="button"
            class="mt-4 w-full rounded-xl border-2 border-ink bg-accent px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="pwRequestStatus === 'loading' || pwConfirmStatus === 'loading' || pwHasRequestId"
            @click="requestPasswordChange"
          >
            {{ pwRequestStatus === 'loading' ? 'Memproses...' : 'Change Password' }}
          </button>
        </section>

        <section v-if="pwHasRequestId" class="rounded-2xl border-2 border-ink bg-paper p-4 shadow-ink-sm">
          <p class="text-sm font-extrabold">Konfirmasi OTP</p>
          <p class="mt-2 text-xs font-bold text-ink/60">
            OTP 3 digit akan diberikan oleh teacher/admin. Request ID terisi otomatis.
          </p>

          <label class="mt-3 block space-y-1.5">
            <span class="text-sm font-semibold">OTP (3 digit)</span>
            <input
              v-model.trim="pwOtp"
              inputmode="numeric"
              class="ink-input py-2.5"
              placeholder="482"
              :disabled="pwConfirmStatus === 'loading'"
            />
          </label>

          <p v-if="pwConfirmError" class="mt-3 text-xs font-bold text-rose-700">{{ pwConfirmError }}</p>

          <button
            type="button"
            class="mt-4 w-full rounded-xl border-2 border-ink bg-ink px-4 py-2 text-sm font-extrabold text-paper shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="pwConfirmStatus === 'loading'"
            @click="confirmPasswordChange"
          >
            {{ pwConfirmStatus === 'loading' ? 'Mengonfirmasi...' : 'Konfirmasi & Logout' }}
          </button>
        </section>
      </form>
    </BaseModal>

    <BaseModal
      :open="cropOpen"
      title="Sesuaikan Foto"
      kicker="Profile"
      subtitle="Geser untuk mengatur posisi. Gunakan slider untuk zoom."
      :full-height="true"
      @close="closeCrop"
    >
      <div class="space-y-4">
        <div
          ref="cropViewportRef"
          class="relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-3xl border-2 border-ink bg-cloud shadow-ink-sm touch-none"
          @pointerdown="onCropPointerDown"
          @pointermove="onCropPointerMove"
          @pointerup="onCropPointerUp"
          @pointercancel="onCropPointerUp"
        >
          <img
            v-if="cropPreviewUrl"
            ref="cropImgRef"
            :src="cropPreviewUrl"
            alt="Preview"
            class="absolute left-1/2 top-1/2 max-w-none select-none"
            :style="cropImgStyle"
            draggable="false"
            @load="onCropImageLoad"
          />
          <div class="pointer-events-none absolute inset-0 ring-2 ring-ink/20" />
        </div>

        <label class="block space-y-2">
          <span class="text-sm font-semibold">Zoom</span>
          <input v-model.number="cropZoom" type="range" min="1" max="3" step="0.01" class="w-full" />
        </label>

        <p v-if="cropError" class="rounded-xl border-2 border-rose-700 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900">
          {{ cropError }}
        </p>
      </div>

      <template #actions>
        <button
          type="button"
          class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
          :disabled="cropStatus === 'loading'"
          @click="resetCrop"
        >
          Reset
        </button>
        <button
          type="button"
          class="rounded-xl border-2 border-ink bg-accent px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="cropStatus === 'loading'"
          @click="confirmCropAndUpload"
        >
          {{ cropStatus === 'loading' ? 'Uploading...' : 'Pakai Foto' }}
        </button>
      </template>
    </BaseModal>

    <input ref="photoInputRef" type="file" accept="image/*" class="hidden" @change="onPickPhoto" />
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import defaultPhoto from '@/assets/icons/default.webp'
import { getServices } from '@/services'
import { useProfileStore } from '@/stores/profile'
import { useAuthStore } from '@/stores/auth'
import BaseModal from '@/components/ui/BaseModal.vue'

const router = useRouter()
const services = getServices()
const profile = useProfileStore()
const auth = useAuthStore()

const photoInputRef = ref(null)
const editOpen = ref(false)

const pwOpen = ref(false)
const pwNew = ref('')
const pwRequestId = ref(null)
const pwOtp = ref('')
const pwRequestStatus = ref('idle')
const pwRequestError = ref('')
const pwRequestSuccess = ref('')
const pwConfirmStatus = ref('idle')
const pwConfirmError = ref('')

const pwHasRequestId = computed(() => {
  const n = Number(pwRequestId.value)
  return Number.isFinite(n) && n > 0
})

const cropOpen = ref(false)
const cropStatus = ref('idle')
const cropError = ref('')
const cropPreviewUrl = ref('')
const cropViewportRef = ref(null)
const cropImgRef = ref(null)

const cropZoom = ref(1)
const cropOffsetX = ref(0)
const cropOffsetY = ref(0)
const cropNaturalW = ref(0)
const cropNaturalH = ref(0)
let cropPointerDown = false
let cropPointerId = null
let cropPointerStart = { x: 0, y: 0 }
let cropOffsetStart = { x: 0, y: 0 }

const displayName = computed(() => {
  return String(profile.me?.name || auth.user?.name || auth.user?.full_name || auth.user?.fullName || 'User')
})

const roleLabel = computed(() => {
  const r = String(profile.me?.role || auth.user?.role || '').toLowerCase()
  return r ? `Role: ${r}` : ''
})

const emailLabel = computed(() => {
  const email = profile.me?.email || auth.user?.email || ''
  return String(email || '').trim() || ''
})

const photoSrc = computed(() => profile.photoUrl || defaultPhoto)

const nameDraft = ref('')

watch(editOpen, (open) => {
  if (!open) return
  // Keep draft in sync with the latest stored profile.
  nameDraft.value = String(profile.me?.name || auth.user?.name || auth.user?.full_name || auth.user?.fullName || '')
  profile.error = null
})

onMounted(async () => {
  try {
    await profile.fetchMe({ services })
  } catch {
    // ignore; page still usable
  }

  // Best-effort load photo (404 => fallback to default.webp).
  await profile.fetchMyPhoto({ services })
  nameDraft.value = String(profile.me?.name || auth.user?.name || auth.user?.full_name || auth.user?.fullName || '')
})

// NOTE: don't revoke profile.photoUrl on unmount.
// Navbar uses it; we revoke on logout / when replacing the photo.

async function saveName() {
  const next = String(nameDraft.value || '').trim()
  if (!next) {
    profile.error = 'Nama wajib diisi.'
    return
  }

  try {
    await profile.updateMe({ services, name: next })
    // Verify latest data from backend before closing.
    try {
      await profile.fetchMe({ services, force: true })
    } catch {
      // ignore; update already succeeded
    }
    // Keep auth session display name in sync.
    if (auth.user) {
      auth.setSession({ user: { ...auth.user, name: next, full_name: next, fullName: next }, token: auth.token }, { persist: true })
    }

    editOpen.value = false
  } catch {
    // store already sets error
  }
}

async function logout() {
  await auth.logout({ services })
  router.push('/login')
}

function closePw() {
  pwOpen.value = false
  pwRequestStatus.value = 'idle'
  pwRequestError.value = ''
  pwRequestSuccess.value = ''
  pwConfirmStatus.value = 'idle'
  pwConfirmError.value = ''
  pwNew.value = ''
  pwRequestId.value = null
  pwOtp.value = ''
}

async function requestPasswordChange() {
  pwRequestError.value = ''
  pwRequestSuccess.value = ''
  pwConfirmError.value = ''
  const next = String(pwNew.value || '')
  if (next.trim().length < 6) {
    pwRequestError.value = 'Password baru minimal 6 karakter.'
    return
  }

  pwRequestStatus.value = 'loading'
  try {
    const res = await services.profile.requestPasswordChange({ new_password: next })
    if (res?.success === false) throw new Error(res?.message || 'Gagal request ganti password')
    const data = res?.data ?? res
    const reqId = data?.request_id ?? data?.requestId ?? data?.data?.request_id ?? data?.data?.requestId
    if (reqId != null) pwRequestId.value = Number(reqId)
    pwRequestSuccess.value = 'Request dibuat. Minta OTP ke teacher/admin, lalu konfirmasi.'
  } catch (e) {
    pwRequestError.value = e?.message || 'Gagal request ganti password'
  } finally {
    pwRequestStatus.value = 'idle'
  }
}

async function confirmPasswordChange() {
  pwConfirmError.value = ''
  const rid = Number(pwRequestId.value)
  const otp = String(pwOtp.value || '').trim()
  if (!Number.isFinite(rid) || rid <= 0) {
    pwConfirmError.value = 'Request ID tidak valid.'
    return
  }
  if (!/^\d{3}$/.test(otp)) {
    pwConfirmError.value = 'OTP harus 3 digit.'
    return
  }

  pwConfirmStatus.value = 'loading'
  try {
    const res = await services.profile.confirmPasswordChange({ request_id: rid, otp })
    if (res?.success === false) throw new Error(res?.message || 'OTP tidak valid')

    // Token revoked by backend. Force logout and redirect.
    closePw()
    await logout()
  } catch (e) {
    pwConfirmError.value = e?.message || 'Gagal konfirmasi OTP'
  } finally {
    pwConfirmStatus.value = 'idle'
  }
}

function pickPhoto() {
  if (photoInputRef.value) photoInputRef.value.click()
}

function onPickPhoto(e) {
  const file = e?.target?.files?.[0]
  if (!file) return
  if (!String(file.type || '').toLowerCase().startsWith('image/')) {
    profile.photoError = 'Foto harus berupa gambar.'
    return
  }

  openCrop(file)

  // allow re-pick same file
  if (e?.target) e.target.value = ''
}

function openCrop(file) {
  cropError.value = ''
  cropStatus.value = 'idle'

  if (cropPreviewUrl.value) {
    try {
      URL.revokeObjectURL(cropPreviewUrl.value)
    } catch {
      // ignore
    }
  }

  cropPreviewUrl.value = URL.createObjectURL(file)
  cropZoom.value = 1
  cropOffsetX.value = 0
  cropOffsetY.value = 0
  cropNaturalW.value = 0
  cropNaturalH.value = 0
  cropOpen.value = true
}

function closeCrop() {
  cropOpen.value = false
  cropError.value = ''
  cropStatus.value = 'idle'
  cropPointerDown = false
  cropPointerId = null
  if (cropPreviewUrl.value) {
    try {
      URL.revokeObjectURL(cropPreviewUrl.value)
    } catch {
      // ignore
    }
  }
  cropPreviewUrl.value = ''
}

function resetCrop() {
  cropZoom.value = 1
  cropOffsetX.value = 0
  cropOffsetY.value = 0
  clampCropOffsets()
}

function onCropImageLoad() {
  const img = cropImgRef.value
  if (!img) return
  cropNaturalW.value = img.naturalWidth || 0
  cropNaturalH.value = img.naturalHeight || 0
  clampCropOffsets()
}

function viewportRect() {
  const el = cropViewportRef.value
  if (!el) return null
  return el.getBoundingClientRect()
}

function baseScaleForCover(vw, vh) {
  const nw = Number(cropNaturalW.value)
  const nh = Number(cropNaturalH.value)
  if (!nw || !nh) return 1
  return Math.max(vw / nw, vh / nh)
}

function clampCropOffsets() {
  const rect = viewportRect()
  if (!rect) return
  const vw = rect.width
  const vh = rect.height
  const nw = Number(cropNaturalW.value)
  const nh = Number(cropNaturalH.value)
  if (!nw || !nh) return

  const scale = baseScaleForCover(vw, vh) * Number(cropZoom.value)
  const dispW = nw * scale
  const dispH = nh * scale

  const maxX = Math.max(0, (dispW - vw) / 2)
  const maxY = Math.max(0, (dispH - vh) / 2)

  cropOffsetX.value = Math.min(maxX, Math.max(-maxX, Number(cropOffsetX.value)))
  cropOffsetY.value = Math.min(maxY, Math.max(-maxY, Number(cropOffsetY.value)))
}

watch(cropZoom, () => {
  clampCropOffsets()
})

function onCropPointerDown(e) {
  if (!cropOpen.value) return
  cropPointerDown = true
  cropPointerId = e.pointerId
  cropPointerStart = { x: e.clientX, y: e.clientY }
  cropOffsetStart = { x: Number(cropOffsetX.value), y: Number(cropOffsetY.value) }
  try {
    e.currentTarget?.setPointerCapture?.(e.pointerId)
  } catch {
    // ignore
  }
}

function onCropPointerMove(e) {
  if (!cropPointerDown) return
  if (cropPointerId != null && e.pointerId !== cropPointerId) return
  const dx = e.clientX - cropPointerStart.x
  const dy = e.clientY - cropPointerStart.y
  cropOffsetX.value = cropOffsetStart.x + dx
  cropOffsetY.value = cropOffsetStart.y + dy
  clampCropOffsets()
}

function onCropPointerUp(e) {
  if (cropPointerId != null && e.pointerId !== cropPointerId) return
  cropPointerDown = false
  cropPointerId = null
}

const cropImgStyle = computed(() => {
  const rect = viewportRect()
  const vw = rect?.width || 320
  const vh = rect?.height || 320
  const scale = baseScaleForCover(vw, vh) * Number(cropZoom.value)
  return {
    transform: `translate(calc(-50% + ${Number(cropOffsetX.value)}px), calc(-50% + ${Number(cropOffsetY.value)}px)) scale(${scale})`,
  }
})

async function confirmCropAndUpload() {
  cropError.value = ''
  const rect = viewportRect()
  const img = cropImgRef.value
  if (!rect || !img) {
    cropError.value = 'Gagal memuat preview.'
    return
  }

  const vw = rect.width
  const vh = rect.height
  const nw = img.naturalWidth
  const nh = img.naturalHeight
  if (!nw || !nh) {
    cropError.value = 'Gagal membaca gambar.'
    return
  }

  cropStatus.value = 'loading'
  try {
    const base = Math.max(vw / nw, vh / nh)
    const scale = base * Number(cropZoom.value)
    const dispW = nw * scale
    const dispH = nh * scale

    const x0 = vw / 2 - dispW / 2 + Number(cropOffsetX.value)
    const y0 = vh / 2 - dispH / 2 + Number(cropOffsetY.value)

    let sx = (0 - x0) / scale
    let sy = (0 - y0) / scale
    let sw = vw / scale
    let sh = vh / scale

    // Clamp source rect inside the image.
    sx = Math.max(0, Math.min(nw, sx))
    sy = Math.max(0, Math.min(nh, sy))
    sw = Math.max(1, Math.min(nw - sx, sw))
    sh = Math.max(1, Math.min(nh - sy, sh))

    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas not supported')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/webp', 0.92)
    })
    if (!blob) throw new Error('Gagal membuat gambar')

    const outFile = new File([blob], 'profile.webp', { type: 'image/webp' })
    await profile.updateMyPhoto({ services, file: outFile })
    closeCrop()
  } catch (e) {
    cropError.value = e?.message || 'Gagal upload foto'
  } finally {
    cropStatus.value = 'idle'
  }
}

</script>
