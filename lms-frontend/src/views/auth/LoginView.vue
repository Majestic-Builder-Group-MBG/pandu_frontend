<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-3">

    <div class="w-full max-w-5xl">
      <div class="ink-card overflow-hidden w-full">

        <!-- ❗ FIX: jangan pakai h-full di mobile -->
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

            <!-- ❗ FIX: no h-full on mobile -->
            <div class="relative flex flex-col items-center text-center md:items-start md:text-left md:h-full">

              <!-- Logo -->
              <header>
                <p class="font-display text-sm md:text-md font-semibold text-white/95">Scholarly</p>
                <p class="mt-1 text-[7px] md:text-[8px] font-extrabold uppercase tracking-[0.24em] text-white/75">
                  Academy
                </p>
              </header>

              <!-- ❗ FIX: remove flex-1 on mobile -->
              <div class="mt-2 md:mt-10 md:flex-1">

                <!-- illustration desktop only -->
                <div class="relative left-6 mx-auto w-full max-w-[120px] md:max-w-[520px] hidden md:block">
                  <img :src="continuousLearning" alt="Illustration"
                    class="relative mx-auto w-full select-none drop-shadow-[0_18px_40px_rgba(0,0,0,0.25)]" />
                </div>

                <!-- text desktop only -->
                <div class="mt-6 hidden md:block">
                  <p class="text-sm font-semibold text-white/90">Belajar lebih rapi.</p>
                  <p class="mt-1 text-sm font-semibold text-white/75">
                    Materi, tugas, dan progress dalam satu tempat.
                  </p>
                </div>
              </div>

              <!-- footer desktop only -->
              <footer class="mt-8 hidden md:flex justify-between items-center w-full">
                <div class="flex items-center gap-3">
                  <div class="h-9 w-9 rounded-xl bg-white/10" />
                  <div class="h-9 w-9 rounded-xl bg-white/10" />
                  <div class="h-9 w-9 rounded-xl bg-white/10" />
                </div>
                <p class="text-xs font-bold text-white/70">@Scholarly</p>
              </footer>
            </div>
          </section>

          <!-- RIGHT -->
          <section class="bg-paper px-4 py-4 md:px-12 md:py-12 flex items-center">

            <div class="mx-auto w-full max-w-sm">

              <!-- title -->
              <div class="mt-4 md:mt-10 flex flex-col items-center text-center">
                <h1 class="text-2xl md:text-3xl font-semibold">Masuk</h1>
                <p class="mt-1 text-sm font-semibold text-ink/60">
                  Gunakan akun Pandu kamu untuk lanjut.
                </p>
              </div>

              <!-- form -->
              <form class="mt-4 space-y-3 md:mt-7 md:space-y-4" @submit.prevent="onSubmit">

                <!-- email -->
                <label class="block space-y-1.5">
                  <span class="text-sm font-semibold">Email</span>
                  <input v-model.trim="email" type="email" autocomplete="email" class="ink-input py-2.5"
                    placeholder="teacher1@mail.com" />
                </label>

                <!-- password -->
                <label class="block space-y-1.5">
                  <span class="text-sm font-semibold">Password</span>
                  <div class="relative">
                    <input v-model="password" :type="showPassword ? 'text' : 'password'" class="ink-input py-2.5 pr-12"
                      placeholder="password123" autocomplete="new-password" />

                    <button type="button"
                      class="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-lg border-2 border-transparent text-ink/70 hover:border-ink hover:bg-accent/30"
                      @click="showPassword = !showPassword" aria-label="Toggle password visibility">
                      <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                        <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" stroke="currentColor" stroke-width="2" />
                        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" stroke-width="2" />
                      </svg>

                      <svg v-else viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                        <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" stroke="currentColor" stroke-width="2" />
                        <path d="M4 4l16 16" stroke="currentColor" stroke-width="2" />
                      </svg>
                    </button>
                  </div>
                </label>

                <!-- options -->
                <div class="flex items-center justify-between">
                  <label class="inline-flex items-center gap-2 text-sm font-bold text-ink/70">
                    <input v-model="remember" type="checkbox" class="h-4 w-4 rounded border-2 border-ink" />
                    Remember me
                  </label>
                  <button type="button" class="text-sm font-bold text-ink/70 hover:text-ink hover:underline">
                    Lupa Password?
                  </button>
                </div>

                <!-- error -->
                <p v-if="errorMessage"
                  class="rounded-xl border-2 border-ink bg-accent/30 px-4 py-3 text-sm font-semibold text-ink">
                  {{ errorMessage }}
                </p>

                <!-- submit -->
                <BaseButton type="submit" class="w-full justify-center" :disabled="isLoading">
                  {{ isLoading ? 'Memproses...' : 'Masuk' }}
                </BaseButton>

                <!-- register -->
                <p class="pt-2 text-center text-sm font-semibold text-ink/70">
                  Belum punya akun?
                  <RouterLink to="/register"
                    class="font-extrabold text-ink underline decoration-accent decoration-[6px] underline-offset-[4px]">
                    Daftar Sekarang
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
import { useRouter, RouterLink } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import continuousLearning from '@/assets/images/continuous-learning.svg'
import { useAuthStore } from '@/stores/auth'
import { getServices } from '@/services'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const remember = ref(true)

const isLoading = ref(false)
const errorMessage = ref('')

const router = useRouter()
const auth = useAuthStore()
const services = getServices()

async function onSubmit() {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Email dan password wajib diisi.'
    return
  }

  isLoading.value = true
  try {
    await auth.login(
      { email: email.value, password: password.value },
      { services, persist: remember.value }
    )
    router.push('/dashboard')
  } catch (e) {
    errorMessage.value = auth.error || e?.message || 'Login gagal'
  } finally {
    isLoading.value = false
  }
}
</script>
