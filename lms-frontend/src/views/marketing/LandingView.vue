<template>
  <div>
    <MarketingHeader />

    <main>
      <section class="relative min-h-dvh overflow-hidden border-b-2 border-ink bg-paper">
        <div class="absolute inset-0 opacity-[0.9]">
          <div class="h-full w-full bg-paper-grid" />
        </div>
        <div class="pointer-events-none absolute -right-24 top-24 hidden h-72 w-72 rotate-6 rounded-[3rem] border-2 border-ink bg-accent/25 shadow-ink sm:block" />

        <div class="relative mx-auto flex min-h-dvh w-full max-w-6xl items-center px-4 pb-16 pt-28 sm:pt-32">
          <div class="grid items-center gap-10 lg:grid-cols-2">
            <div class="animate-rise">

              <h1 class="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
                Belajar
                <span class="underline decoration-accent decoration-[12px] underline-offset-[8px]">lebih rapi</span>,
                quiz cepat, penilaian jelas.
              </h1>

              <p class="mt-5 max-w-xl text-base font-semibold text-ink/70">
                Pandu menyatukan modul, sesi, kuis, AI generate dari PDF, dan leaderboard.
                Fokus ke flow yang gampang dipahami dan enak dipresentasikan.
              </p>

              <div class="mt-7 flex flex-wrap items-center gap-4">
                <RouterLink
                  v-if="auth.token"
                  to="/dashboard"
                  class="rounded-xl border-2 border-ink bg-accent px-6 py-3 text-sm font-extrabold shadow-ink transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  Buka Dashboard
                </RouterLink>

                <RouterLink
                  v-else
                  to="/register"
                  class="rounded-xl border-2 border-ink bg-accent px-6 py-3 text-sm font-extrabold shadow-ink transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  Mulai Sekarang
                </RouterLink>

                <RouterLink to="/features" class="text-sm font-extrabold text-ink/70 hover:text-ink hover:underline underline-offset-4">
                  Lihat fitur
                </RouterLink>

                <RouterLink
                  v-if="!auth.token"
                  to="/login"
                  class="text-sm font-extrabold text-ink/70 hover:text-ink hover:underline underline-offset-4"
                >
                  Login
                </RouterLink>
              </div>

            </div>

            <div class="relative">
              <div class="mx-auto w-full max-w-xl rounded-[3rem] p-6 sm:p-10">
                <div class="grid place-items-center">
                  <img :src="heroVector" alt="Illustration" class="w-full max-w-md select-none object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="relative border-b-2 border-ink bg-cloud">
        <div class="pointer-events-none absolute -left-20 top-10 hidden h-64 w-64 -rotate-6 rounded-[3rem] border-2 border-ink bg-paper shadow-ink sm:block" />

        <div class="mx-auto w-full max-w-6xl px-4 py-20 sm:py-24">
          <div class="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Our Service</p>
              <h2 class="mt-2 text-3xl font-extrabold">3 fitur yang paling sering dipakai</h2>
              <p class="mt-2 max-w-2xl text-sm font-semibold text-ink/70">
                Cukup tiga ini untuk nunjukin flow LMS yang lengkap: struktur kelas, pembuatan kuis yang cepat, dan UI yang enak di mobile.
              </p>
            </div>

            <RouterLink
              to="/features"
              class="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-5 py-2 text-sm font-extrabold shadow-ink-sm transition hover:bg-accent/30 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              View All Features
              <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
                <path d="M7 17L17 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                <path d="M9 7h8v8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </RouterLink>
          </div>

          <div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <article class="h-full rounded-3xl border-2 border-ink bg-paper p-7 shadow-ink-sm">
              <div class="grid h-14 w-14 place-items-center rounded-2xl border-2 border-ink bg-accent/40 shadow-ink-sm">
                <svg viewBox="0 0 24 24" fill="none" class="h-7 w-7" aria-hidden="true">
                  <path d="M4 6h16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M4 12h10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M4 18h16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                </svg>
              </div>
              <h3 class="mt-5 text-lg font-extrabold">Modul & Sesi</h3>
              <p class="mt-2 text-sm font-semibold text-ink/70">
                Struktur kelas yang rapi: modul sebagai container, sesi sebagai jadwal. Akses kuis mengikuti status sesi.
              </p>
            </article>

            <article class="h-full rounded-3xl border-2 border-ink bg-paper p-7 shadow-ink-sm">
              <div class="grid h-14 w-14 place-items-center rounded-2xl border-2 border-ink bg-ocean-50 text-ocean-700 shadow-ink-sm">
                <svg viewBox="0 0 24 24" fill="none" class="h-7 w-7" aria-hidden="true">
                  <path d="M12 2v6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M12 16v6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M2 12h6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M16 12h6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M8.2 8.2l-4.2-4.2" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M20 20l-4.2-4.2" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                </svg>
              </div>
              <h3 class="mt-5 text-lg font-extrabold">AI Generated Kuis</h3>
              <p class="mt-2 text-sm font-semibold text-ink/70">
                Upload PDF, generate draft MCQ dan essay, lalu apply ke quiz. Teacher tetap bisa edit dan review.
              </p>
            </article>

            <article class="h-full rounded-3xl border-2 border-ink bg-paper p-7 shadow-ink-sm">
              <div class="grid h-14 w-14 place-items-center rounded-2xl border-2 border-ink bg-paper shadow-ink-sm">
                <svg viewBox="0 0 24 24" fill="none" class="h-7 w-7" aria-hidden="true">
                  <path d="M8 4h8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M7 7h10v13H7z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" />
                  <path d="M12 18h.01" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
                </svg>
              </div>
              <h3 class="mt-5 text-lg font-extrabold">Mobile Friendly</h3>
              <p class="mt-2 text-sm font-semibold text-ink/70">
                Navigasi jelas, card dan modal tetap kebaca. Cocok untuk student yang akses lewat HP.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="about" class="relative overflow-hidden border-y-2 border-ink bg-paper">
        <div class="pointer-events-none absolute -right-24 top-16 hidden h-72 w-72 rotate-6 rounded-[3rem] border-2 border-ink bg-ocean-50 shadow-ink sm:block" />

        <div class="sm:h-[42rem] mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
          <div class="grid items-center justify-center gap-10 lg:grid-cols-2">
            <div class="relative min-w-0">
              <div class="pointer-events-none absolute -left-6 -top-6 hidden h-10 w-10 rotate-12 rounded-2xl border-2 border-ink bg-accent shadow-ink-sm lg:block" />
              <div class="mx-auto aspect-square w-full max-w-[480px] overflow-hidden">
                <div class="grid h-full w-full place-items-center p-10 sm:p-14">
                  <img :src="aboutVector" alt="Pandu preview" class="w-full select-none object-contain" />
                </div>
              </div>
              <div class="pointer-events-none absolute -bottom-6 right-10 hidden h-12 w-12 -rotate-6 rounded-2xl border-2 border-ink bg-paper shadow-ink-sm lg:block" />
            </div>

            <div class="min-w-0">
              <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">About</p>
              <h2 class="mt-3 text-3xl font-extrabold sm:text-4xl">
                UI tegas, flow jelas, siap buat demo.
              </h2>
              <p class="mt-4 max-w-xl break-words text-sm font-semibold text-ink/70 text-justify">
                Pandu dibuat untuk nunjukin alur LMS tanpa ribet: modul dan sesi sebagai struktur kelas, akses kuis yang
                mengikuti status sesi, serta penilaian yang konsisten supaya student dan teacher sama-sama paham aturan main.
                Untuk demo MVP, kamu juga bisa generate draft soal dari PDF dan langsung apply ke quiz, lalu lanjut ke flow
                attempts dan review. Semuanya dibungkus UI neo-brutal yang kontras dan tegas, biar status penting cepat kebaca
                dan presentasi ke juri terasa jelas.
              </p>

              <div class="mt-8 flex flex-wrap items-center gap-3">
                <RouterLink
                  to="/about"
                  class="inline-flex rounded-xl border-2 border-ink bg-ink px-5 py-3 text-sm font-extrabold text-paper shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  Baca Tentang Pandu
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="report" class="min-h-dvh">
        <div class="mx-auto flex min-h-dvh w-full max-w-6xl items-center px-4 py-12">
          <div class="w-full">
            <ReportForm />
          </div>
        </div>
      </section>
    </main>

    <MarketingFooter />
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import heroVector from '@/assets/images/undraw_all-checked_d3u6.svg'
import aboutVector from '@/assets/images/undraw_my-app_jscv.svg'

import MarketingHeader from '@/components/marketing/MarketingHeader.vue'
import MarketingFooter from '@/components/marketing/MarketingFooter.vue'
import ReportForm from '@/components/marketing/ReportForm.vue'

const auth = useAuthStore()
</script>
