<template>
  <div class="min-h-dvh flex items-center justify-center px-4">

    <div class="w-full max-w-5xl">
      <div class="ink-card overflow-hidden w-full">

        <!-- ❗ FIX: no h-full -->
        <div class="grid grid-cols-1 md:grid-cols-2 md:min-h-[600px]">

          <!-- LEFT -->
          <section
            class="relative bg-ocean-500 px-4 py-3 md:px-10 md:py-12 flex items-center justify-center md:justify-start overflow-hidden">

            <!-- decorative (desktop only) -->
            <div class="pointer-events-none absolute inset-0 hidden md:block">
              <div class="absolute left-10 top-12 h-10 w-28 rounded-full bg-white/15" />
              <div class="absolute left-32 top-10 h-8 w-16 rounded-full bg-white/10" />
              <div class="absolute right-16 top-20 h-10 w-32 rounded-full bg-white/15" />
              <div class="absolute right-36 top-16 h-8 w-16 rounded-full bg-white/10" />
              <div class="absolute -left-24 bottom-14 h-56 w-56 rounded-full bg-ocean-600/40" />
              <div class="absolute -right-28 bottom-6 h-72 w-72 rounded-full bg-ocean-700/30" />
            </div>

            <!-- ❗ FIX: no h-full mobile -->
            <div class="relative flex flex-col items-center text-center md:items-start md:text-left md:h-full">

              <!-- Logo -->
              <header>
                <p class="font-display text-sm md:text-md font-semibold text-white/95">Scholarly</p>
                <p class="mt-1 text-[7px] md:text-[8px] font-extrabold uppercase tracking-[0.24em] text-white/75">
                  Academy
                </p>
              </header>

              <!-- ❗ FIX: no flex-1 mobile -->
              <div class="mt-2 md:mt-10 md:flex-1">

                <!-- illustration desktop only -->
                <div class="relative left-6 mx-auto w-full max-w-[120px] md:max-w-[520px] hidden md:block">
                  <img :src="continuousLearning" alt="Illustration"
                    class="relative mx-auto w-full select-none drop-shadow-[0_18px_40px_rgba(0,0,0,0.25)]" />
                </div>

                <!-- text desktop only -->
                <div class="mt-6 hidden md:block">
                  <p class="text-sm font-semibold text-white/90">Mulai perjalanan belajarmu.</p>
                  <p class="mt-1 text-sm font-semibold text-white/75">
                    Daftar pakai kode registrasi dari sekolah/kursus.
                  </p>
                </div>
              </div>

              <!-- footer desktop only -->
              <footer class="mt-8 hidden md:block">
                <p class="text-xs font-bold text-white/70">
                  Registrasi menentukan role otomatis dari kode.
                </p>
              </footer>
            </div>
          </section>

          <!-- RIGHT -->
          <section class="bg-paper px-4 py-4 md:px-12 md:py-12 flex items-center">

            <div class="mx-auto w-full max-w-sm">

              <!-- Title -->
              <div class="mt-4 md:mt-10 flex flex-col items-center text-center">
                <h1 class="text-2xl md:text-3xl font-semibold">Daftar</h1>
                <p class="mt-1 text-sm font-semibold text-ink/60">
                  Isi data dan kode registrasi untuk membuat akun.
                </p>
              </div>

              <!-- Form -->
              <form class="mt-4 space-y-3 md:mt-7 md:space-y-4" @submit.prevent="onSubmit">

                <!-- Nama -->
                <label class="block space-y-1.5">
                  <span class="text-sm font-semibold">Nama</span>
                  <input v-model.trim="name" class="ink-input py-2.5" placeholder="Siswa 1" autocomplete="name" />
                </label>

                <!-- Email -->
                <label class="block space-y-1.5">
                  <span class="text-sm font-semibold">Email</span>
                  <input v-model.trim="email" type="email" class="ink-input py-2.5" placeholder="student1@mail.com"
                    autocomplete="email" />
                </label>

                <!-- Password -->
                <label class="block space-y-1.5">
                  <span class="text-sm font-semibold">Password</span>
                  <div class="relative">
                    <input v-model="password" :type="showPassword ? 'text' : 'password'" class="ink-input py-2.5 pr-12"
                      placeholder="password123" autocomplete="new-password" />

                    <!-- ❗ TIDAK DIUBAH -->
                    <button type="button"
                      class="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-lg border-2 border-transparent text-ink/70 hover:border-ink hover:bg-accent/30"
                      @click="showPassword = !showPassword" aria-label="Toggle password visibility">
                      <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                        <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" stroke="currentColor" stroke-width="2" />
                        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" stroke-width="2" />
                      </svg>
                      <svg v-else viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                        <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" stroke="currentColor" stroke-width="2" />
                        <path d="M4 4l16 16" stroke="currentColor" stroke-width="2" />
                      </svg>
                    </button>
                  </div>
                </label>

                <!-- Kode -->
                <label class="block space-y-1.5">
                  <span class="text-sm font-semibold">Kode Registrasi</span>
                  <input v-model.trim="registrationCode" inputmode="numeric" class="ink-input py-2.5"
                    placeholder="938214" />
                  <p class="text-xs font-bold text-ink/50">
                    Role akan ditentukan otomatis dari kode.
                  </p>
                </label>

                <!-- Error -->
                <p v-if="errorMessage"
                  class="rounded-xl border-2 border-ink bg-accent/30 px-4 py-3 text-sm font-semibold text-ink">
                  {{ errorMessage }}
                </p>

                <!-- Success -->
                <p v-if="successMessage"
                  class="rounded-xl border-2 border-ink bg-paper px-4 py-3 text-sm font-semibold text-ink shadow-ink-sm">
                  {{ successMessage }}
                </p>

                <!-- Submit -->
                <BaseButton type="submit" class="w-full justify-center" :disabled="isLoading">
                  {{ isLoading ? 'Memproses...' : 'Daftar' }}
                </BaseButton>

                <!-- Login -->
                <p class="pt-2 text-center text-sm font-semibold text-ink/70">
                  Sudah punya akun?
                  <RouterLink to="/login"
                    class="font-extrabold text-ink underline decoration-accent decoration-[6px] underline-offset-[4px]">
                    Masuk
                  </RouterLink>
                </p>

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
      successMessage.value = res?.message || 'Registrasi berhasil.'
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