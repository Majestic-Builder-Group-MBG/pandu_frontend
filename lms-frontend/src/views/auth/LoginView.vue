<template>
  <div class="mx-auto w-full max-w-5xl">
    <div class="ink-card overflow-hidden">
      <div class="grid grid-cols-1 md:grid-cols-2">
        <!-- Left: illustration panel (desktop-style reference) -->
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
                <p class="text-sm font-semibold text-white/90">Belajar lebih rapi.</p>
                <p class="mt-1 text-sm font-semibold text-white/75">Materi, tugas, dan progress dalam satu tempat.</p>
                <div class="mt-4 flex flex-wrap gap-2">
                  <span class="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">Courses</span>
                  <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">Assignments</span>
                  <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">Progress</span>
                </div>
              </div>
            </div>

            <footer class="mt-8 hidden items-end justify-between md:flex">
              <div class="flex items-center gap-3">
                <a
                  href="#"
                  class="grid h-9 w-9 place-items-center rounded-xl border border-white/25 bg-white/10 hover:bg-white/15"
                  aria-label="Facebook"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4" aria-hidden="true">
                    <path
                      d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.6-1.6h1.7V4.8c-.3 0-1.4-.1-2.6-.1-2.6 0-4.3 1.6-4.3 4.5V11H7.3v3H10v8h3.5Z"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  class="grid h-9 w-9 place-items-center rounded-xl border border-white/25 bg-white/10 hover:bg-white/15"
                  aria-label="LinkedIn"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4" aria-hidden="true">
                    <path d="M6.5 6.9A2.1 2.1 0 1 1 6.5 2.7a2.1 2.1 0 0 1 0 4.2Z" />
                    <path d="M4.6 21.3h3.8V9H4.6v12.3Z" />
                    <path
                      d="M10.3 9h3.6v1.7h.1c.5-.9 1.8-2 3.8-2 4 0 4.7 2.6 4.7 6v6.6h-3.8v-5.9c0-1.4 0-3.3-2-3.3s-2.3 1.6-2.3 3.2v6h-3.8V9Z"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  class="grid h-9 w-9 place-items-center rounded-xl border border-white/25 bg-white/10 hover:bg-white/15"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
                    <path
                      d="M7.2 2.9h9.6a4.3 4.3 0 0 1 4.3 4.3v9.6a4.3 4.3 0 0 1-4.3 4.3H7.2A4.3 4.3 0 0 1 2.9 16.8V7.2A4.3 4.3 0 0 1 7.2 2.9Z"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <path d="M12 16.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Z" stroke="currentColor" stroke-width="2" />
                    <path d="M17.4 6.6h.01" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                  </svg>
                </a>
              </div>
              <p class="text-xs font-bold text-white/70">@Scholarly. All rights reserved</p>
            </footer>
          </div>

          <div class="pointer-events-none absolute -bottom-24 -right-24 hidden h-56 w-56 rounded-full bg-paper md:block" />
        </section>

        <!-- Right: form -->
        <section class="bg-paper px-8 py-10 md:px-12 md:py-12">
          <div class="mx-auto w-full max-w-sm">
            <header class="text-center">
              <p class="font-display text-sm font-semibold text-ink">Scholarly</p>
              <p class="mt-1 text-[11px] font-extrabold uppercase tracking-[0.24em] text-ink/60">Academy</p>
            </header>

            <div class="mt-8 flex w-full flex-col items-center text-center md:mt-10">
              <h1 class="text-3xl font-semibold">Masuk</h1>
              <p class="mt-2 text-sm font-semibold text-ink/60">Gunakan akun Pandu kamu untuk lanjut.</p>
            </div>

            <form class="mt-7 space-y-4" @submit.prevent="onSubmit">
              <label class="block space-y-2">
                <span class="text-sm font-semibold">Email</span>
                <input
                  v-model.trim="email"
                  type="email"
                  autocomplete="email"
                  class="ink-input"
                  placeholder="teacher1@mail.com"
                />
              </label>

              <label class="block space-y-2">
                <span class="text-sm font-semibold">Password</span>
                <div class="relative">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="current-password"
                    class="ink-input pr-12"
                    placeholder="password123"
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

              <div class="flex items-center justify-between">
                <label class="inline-flex items-center gap-2 text-sm font-bold text-ink/70">
                  <input v-model="remember" type="checkbox" class="h-4 w-4 rounded border-2 border-ink" />
                  Remember me
                </label>
                <button type="button" class="text-sm font-bold text-ink/70 hover:text-ink hover:underline">Lupa Password?</button>
              </div>

              <p v-if="errorMessage" class="rounded-xl border-2 border-ink bg-accent/30 px-4 py-3 text-sm font-semibold text-ink">
                {{ errorMessage }}
              </p>

              <BaseButton type="submit" class="w-full justify-center" :disabled="isLoading">
                {{ isLoading ? 'Memproses...' : 'Masuk' }}
              </BaseButton>

              <p class="pt-2 text-center text-sm font-semibold text-ink/70">
                Belum punya akun?
                <button type="button" class="font-extrabold text-ink underline decoration-accent decoration-[6px] underline-offset-[4px]">
                  Daftar Sekarang
                </button>
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
import { useRouter } from 'vue-router'

import BaseButton from '@/components/ui/BaseButton.vue'
import continuousLearning from '@/assets/images/continuous-learning.svg'
import { useAuthStore } from '@/stores/auth'
import { createServices } from '@/services'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const remember = ref(true)

const isLoading = ref(false)
const errorMessage = ref('')

const router = useRouter()
const auth = useAuthStore()
const services = createServices()

async function onSubmit() {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Email dan password wajib diisi.'
    return
  }

  isLoading.value = true
  try {
    await auth.login({ email: email.value, password: password.value }, { services, persist: remember.value })
    router.push('/dashboard')
  } catch (e) {
    errorMessage.value = auth.error || e?.message || 'Login gagal'
  } finally {
    isLoading.value = false
  }
}
</script>
