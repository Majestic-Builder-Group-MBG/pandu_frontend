<template>
  <div class="min-h-dvh flex items-center justify-center px-4 py-3">
    <div class="w-full max-w-5xl">
      <div class="ink-card w-full overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-2 md:min-h-[600px]">
          <section class="relative bg-ocean-500 px-4 py-6 md:px-10 md:py-12 flex items-center justify-center md:justify-start overflow-hidden">
            <div class="pointer-events-none absolute inset-0 hidden md:block">
              <div class="absolute left-10 top-12 h-10 w-28 rounded-full bg-white/15" />
              <div class="absolute left-32 top-10 h-8 w-16 rounded-full bg-white/10" />
              <div class="absolute right-16 top-20 h-10 w-32 rounded-full bg-white/15" />
              <div class="absolute right-36 top-16 h-8 w-16 rounded-full bg-white/10" />
              <div class="absolute -left-24 bottom-14 h-56 w-56 rounded-full bg-ocean-600/40" />
              <div class="absolute -right-28 bottom-6 h-72 w-72 rounded-full bg-ocean-700/30" />
            </div>

            <div class="relative flex flex-col items-center text-center md:items-start md:text-left md:h-full">
              <header>
                <p class="font-display text-sm md:text-md font-semibold text-white/95">Pandu</p>
                <p class="mt-1 text-[7px] md:text-[8px] font-extrabold uppercase tracking-[0.24em] text-white/75">Academy</p>
              </header>

              <div class="mt-4 md:mt-10 md:flex-1">
                <h1 class="text-xl md:text-3xl font-semibold text-white">Ganti Password</h1>
                <p class="mt-2 max-w-sm text-sm font-semibold text-white/80">
                  1) Request password baru. 2) Minta OTP 3 digit dari teacher/admin. 3) Konfirmasi OTP. Setelah sukses, kamu login ulang.
                </p>

                <div class="mt-6 w-full max-w-sm space-y-2 rounded-2xl border-2 border-ink bg-white/10 px-4 py-3 text-left">
                  <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-white/80">Catatan</p>
                  <p class="text-xs font-semibold text-white/80">OTP disampaikan manual (internal flow). Perhatikan expiry dan batas percobaan.</p>
                </div>
              </div>

              <footer class="mt-8 flex w-full items-center justify-center md:justify-between">
                <RouterLink
                  to="/profile"
                  class="rounded-2xl border-2 border-ink bg-paper px-4 py-3 text-sm font-extrabold shadow-ink-sm"
                >
                  Kembali ke Profile
                </RouterLink>
                <p class="hidden md:block text-xs font-bold text-white/70">@Pandu</p>
              </footer>
            </div>
          </section>

          <section class="bg-paper px-4 py-5 md:px-12 md:py-12 flex items-center">
            <div class="mx-auto w-full max-w-sm">
              <div class="mt-2 md:mt-10 flex flex-col items-center text-center">
                <h2 class="text-2xl md:text-3xl font-semibold">OTP Flow</h2>
                <p class="mt-1 text-sm font-semibold text-ink/60">Masukkan data sesuai step dokumentasi.</p>
              </div>

              <form class="mt-4 space-y-3 md:mt-7 md:space-y-4" @submit.prevent>
                <div class="rounded-2xl border-2 border-ink bg-cloud p-4">
                  <p class="text-sm font-extrabold">1) Request</p>

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
                    :disabled="pwRequestStatus === 'loading' || pwConfirmStatus === 'loading'"
                    @click="requestPasswordChange"
                  >
                    {{ pwRequestStatus === 'loading' ? 'Memproses...' : 'Request OTP' }}
                  </button>
                </div>

                <div class="rounded-2xl border-2 border-ink bg-paper p-4 shadow-ink-sm">
                  <p class="text-sm font-extrabold">2) Konfirmasi OTP</p>

                  <label class="mt-3 block space-y-1.5">
                    <span class="text-sm font-semibold">Request ID</span>
                    <input
                      v-model.number="pwRequestId"
                      type="number"
                      min="1"
                      class="ink-input py-2.5"
                      placeholder="12"
                      :disabled="pwConfirmStatus === 'loading'"
                    />
                  </label>

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
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import { getServices } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'

const router = useRouter()
const services = getServices()
const auth = useAuthStore()
const profile = useProfileStore()

const pwNew = ref('')
const pwRequestId = ref(null)
const pwOtp = ref('')

const pwRequestStatus = ref('idle')
const pwRequestError = ref('')
const pwRequestSuccess = ref('')

const pwConfirmStatus = ref('idle')
const pwConfirmError = ref('')

async function requestPasswordChange() {
  pwRequestError.value = ''
  pwRequestSuccess.value = ''
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
    await auth.logout({ services })
    profile.clear()
    router.push('/login')
  } catch (e) {
    pwConfirmError.value = e?.message || 'Gagal konfirmasi OTP'
  } finally {
    pwConfirmStatus.value = 'idle'
  }
}
</script>
