<template>
  <div class="mx-auto w-full max-w-5xl">
    <div class="ink-card overflow-hidden">
      <div class="grid grid-cols-1 md:grid-cols-2">
        <!-- Left: keep the same feel as login -->
        <section class="relative bg-ocean-500 px-8 py-10 text-white md:px-10 md:py-12">
          <div class="pointer-events-none absolute inset-0">
            <div class="absolute left-8 top-10 h-9 w-24 rounded-full bg-white/15 md:left-10 md:top-12 md:h-10 md:w-28" />
            <div class="absolute left-28 top-8 h-7 w-14 rounded-full bg-white/10 md:left-32 md:top-10 md:h-8 md:w-16" />
            <div class="absolute right-12 top-16 h-9 w-28 rounded-full bg-white/15 md:right-16 md:top-20 md:h-10 md:w-32" />
            <div class="absolute right-28 top-12 h-7 w-14 rounded-full bg-white/10 md:right-36 md:top-16 md:h-8 md:w-16" />
            <div class="absolute -left-24 bottom-14 hidden h-56 w-56 rounded-full bg-ocean-600/40 md:block" />
            <div class="absolute -right-28 bottom-6 hidden h-72 w-72 rounded-full bg-ocean-700/30 md:block" />
          </div>

          <div class="relative flex h-full flex-col">
            <header>
              <p class="font-display text-lg font-semibold">Scholarly</p>
              <p class="mt-1 text-[11px] font-extrabold uppercase tracking-[0.24em] text-white/75">Academy</p>
            </header>

            <div class="mt-8 flex-1 md:mt-10">
              <div class="relative mx-auto w-full max-w-[360px] md:max-w-[520px]">
                <div class="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 md:h-[420px] md:w-[420px]" />
                <div class="absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 md:h-[300px] md:w-[300px]" />
                <img
                  :src="continuousLearning"
                  alt="Illustration"
                  class="relative mx-auto w-full select-none drop-shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
                  style="filter: brightness(1.08) contrast(1.02) saturate(1.05);"
                />
              </div>

              <div class="mt-6 hidden max-w-[420px] md:block">
                <p class="text-sm font-semibold text-white/90">Mulai perjalanan belajarmu.</p>
                <p class="mt-1 text-sm font-semibold text-white/75">Daftar pakai kode registrasi dari sekolah/kursus.</p>
              </div>
            </div>

            <footer class="mt-8 hidden md:block">
              <p class="text-xs font-bold text-white/70">Registrasi menentukan role otomatis dari kode.</p>
            </footer>
          </div>

          <div class="pointer-events-none absolute -bottom-24 -right-24 hidden h-56 w-56 rounded-full bg-paper md:block" />
        </section>

        <!-- Right: registration form -->
        <section class="bg-paper px-8 py-10 md:px-12 md:py-12">
          <div class="mx-auto w-full max-w-sm">
            <header class="text-center">
              <p class="font-display text-sm font-semibold text-ink">Scholarly</p>
              <p class="mt-1 text-[11px] font-extrabold uppercase tracking-[0.24em] text-ink/60">Academy</p>
            </header>

            <div class="mt-8 flex w-full flex-col items-center text-center md:mt-10">
              <h1 class="text-3xl font-semibold">Daftar</h1>
              <p class="mt-2 text-sm font-semibold text-ink/60">Isi data dan kode registrasi untuk membuat akun.</p>
            </div>

            <form class="mt-7 space-y-4" @submit.prevent="onSubmit">
              <label class="block space-y-2">
                <span class="text-sm font-semibold">Nama</span>
                <input v-model.trim="name" class="ink-input" placeholder="Siswa 1" autocomplete="name" />
              </label>

              <label class="block space-y-2">
                <span class="text-sm font-semibold">Email</span>
                <input
                  v-model.trim="email"
                  type="email"
                  class="ink-input"
                  placeholder="student1@mail.com"
                  autocomplete="email"
                />
              </label>

              <label class="block space-y-2">
                <span class="text-sm font-semibold">Password</span>
                <div class="relative">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="ink-input pr-12"
                    placeholder="password123"
                    autocomplete="new-password"
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-lg border-2 border-transparent text-ink/70 hover:border-ink hover:bg-accent/30"
                    @click="showPassword = !showPassword"
                    aria-label="Toggle password visibility"
                  >
                    <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                      <path
                        d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z"
                        stroke="currentColor"
                        stroke-width="2"
                      />
                      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" stroke-width="2" />
                    </svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                      <path
                        d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z"
                        stroke="currentColor"
                        stroke-width="2"
                      />
                      <path d="M4 4l16 16" stroke="currentColor" stroke-width="2" />
                    </svg>
                  </button>
                </div>
              </label>

              <label class="block space-y-2">
                <span class="text-sm font-semibold">Kode Registrasi</span>
                <input
                  v-model.trim="registrationCode"
                  inputmode="numeric"
                  class="ink-input"
                  placeholder="938214"
                  autocomplete="one-time-code"
                />
                <p class="text-xs font-bold text-ink/50">Role (admin/teacher/student) akan ditentukan otomatis dari kode.</p>
              </label>

              <p v-if="errorMessage" class="rounded-xl border-2 border-ink bg-accent/30 px-4 py-3 text-sm font-semibold text-ink">
                {{ errorMessage }}
              </p>

              <p v-if="successMessage" class="rounded-xl border-2 border-ink bg-paper px-4 py-3 text-sm font-semibold text-ink shadow-ink-sm">
                {{ successMessage }}
              </p>

              <BaseButton type="submit" class="w-full justify-center" :disabled="isLoading">
                {{ isLoading ? 'Memproses...' : 'Daftar' }}
              </BaseButton>

              <p class="pt-2 text-center text-sm font-semibold text-ink/70">
                Sudah punya akun?
                <RouterLink
                  to="/login"
                  class="font-extrabold text-ink underline decoration-accent decoration-[6px] underline-offset-[4px]"
                >
                  Masuk
                </RouterLink>
              </p>
            </form>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import BaseButton from '@/components/ui/BaseButton.vue'
import continuousLearning from '@/assets/images/continuous-learning.svg'
import { createServices } from '@/services'

const router = useRouter()
const services = createServices()

const name = ref('')
const email = ref('')
const password = ref('')
const registrationCode = ref('')
const showPassword = ref(false)

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function onSubmit() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!name.value || !email.value || !password.value || !registrationCode.value) {
    errorMessage.value = 'Nama, email, password, dan kode registrasi wajib diisi.'
    return
  }

  isLoading.value = true
  try {
    const res = await services.auth.register({
      name: name.value,
      email: email.value,
      password: password.value,
      registration_code: registrationCode.value,
    })

    if (res?.success) {
      successMessage.value = res?.message || 'Registrasi berhasil. Silakan login.'
      setTimeout(() => {
        router.push({ name: 'login', query: { email: email.value } })
      }, 600)
      return
    }

    errorMessage.value = res?.message || 'Registrasi gagal'
  } catch (e) {
    errorMessage.value = e?.message || 'Registrasi gagal'
  } finally {
    isLoading.value = false
  }
}
</script>
