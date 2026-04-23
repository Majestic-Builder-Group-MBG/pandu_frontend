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

      <section id="features" class="min-h-dvh">
        <div class="mx-auto flex min-h-dvh w-full max-w-6xl items-center px-4 py-12">
          <div class="w-full">
            <div class="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Features</p>
                <h2 class="mt-2 text-3xl font-extrabold">Fitur utama yang beneran kepake</h2>
                <p class="mt-2 max-w-2xl text-sm font-semibold text-ink/70">
                  Fokus ke alur kelas: jadwal sesi, akses quiz yang jelas, review essay yang bisa dipantau, dan leaderboard yang rapi.
                </p>
              </div>
              <span class="hidden rounded-2xl border-2 border-ink bg-accent/40 px-3 py-2 text-xs font-extrabold shadow-ink-sm sm:inline-flex">
                Dominan kuning + putih, aksen biru seperlunya
              </span>
            </div>

            <div class="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <article class="ink-card p-5">
            <div class="flex items-center justify-between gap-3">
              <h3 class="text-lg font-extrabold">Modul & Sesi</h3>
              <span class="grid h-10 w-10 place-items-center rounded-2xl border-2 border-ink bg-accent shadow-ink-sm">
                <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                  <path d="M4 6h16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M4 12h10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M4 18h16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                </svg>
              </span>
            </div>
            <p class="mt-3 text-sm font-semibold text-ink/70">
              Sesi bisa dijadwalkan, akses quiz ikut status sesi. Tidak bikin student bingung.
            </p>
          </article>

          <article class="ink-card p-5">
            <div class="flex items-center justify-between gap-3">
              <h3 class="text-lg font-extrabold">AI Generate Quiz</h3>
              <span class="grid h-10 w-10 place-items-center rounded-2xl border-2 border-ink bg-ocean-50 text-ocean-700 shadow-ink-sm">
                <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                  <path d="M12 2v6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M12 16v6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M2 12h6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M16 12h6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M8.2 8.2l-4.2-4.2" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M20 20l-4.2-4.2" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                </svg>
              </span>
            </div>
            <p class="mt-3 text-sm font-semibold text-ink/70">
              Upload PDF, generate MCQ + essay, lalu apply ke quiz. Cepat untuk kelas besar.
            </p>
          </article>

          <article class="ink-card p-5">
            <div class="flex items-center justify-between gap-3">
              <h3 class="text-lg font-extrabold">Review Essay</h3>
              <span class="grid h-10 w-10 place-items-center rounded-2xl border-2 border-ink bg-accent shadow-ink-sm">
                <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                  <path d="M4 20h16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M7 17V7a3 3 0 0 1 3-3h7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M14 4h6v6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M20 4l-8 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                </svg>
              </span>
            </div>
            <p class="mt-3 text-sm font-semibold text-ink/70">
              Set manual points dan feedback. Nilai essay ikut input teacher, agregasi ikut kontrak API.
            </p>
          </article>

          <article class="ink-card p-5">
            <div class="flex items-center justify-between gap-3">
              <h3 class="text-lg font-extrabold">Leaderboard</h3>
              <span class="grid h-10 w-10 place-items-center rounded-2xl border-2 border-ink bg-paper shadow-ink-sm">
                <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                  <path d="M7 20V10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M12 20V4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M17 20v-8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                </svg>
              </span>
            </div>
            <p class="mt-3 text-sm font-semibold text-ink/70">
              Visibility public/private. Tampilkan rank, attempt no, submitted at, final score.
            </p>
          </article>

          <article class="ink-card p-5">
            <div class="flex items-center justify-between gap-3">
              <h3 class="text-lg font-extrabold">Mobile Friendly</h3>
              <span class="grid h-10 w-10 place-items-center rounded-2xl border-2 border-ink bg-ocean-50 text-ocean-700 shadow-ink-sm">
                <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                  <path d="M8 4h8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M7 7h10v13H7z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" />
                  <path d="M12 18h.01" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
                </svg>
              </span>
            </div>
            <p class="mt-3 text-sm font-semibold text-ink/70">
              Navigasi, modal, dan card tetap kebaca di layar kecil.
            </p>
          </article>

          <article class="ink-card bg-accent/25 p-5">
            <div class="flex items-center justify-between gap-3">
              <h3 class="text-lg font-extrabold">Integrasi</h3>
              <span class="grid h-10 w-10 place-items-center rounded-2xl border-2 border-ink bg-ocean-500 text-paper shadow-ink-sm">
                <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                  <path d="M8 12h8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M12 8v8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                  <path d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" />
                </svg>
              </span>
            </div>
            <p class="mt-3 text-sm font-semibold text-ink/70">
              Siap disambungkan: web push, analytics, dan export report (roadmap).
            </p>
          </article>
            </div>
          </div>
        </div>
      </section>

      <section id="about" class="min-h-dvh border-y-2 border-ink bg-paper">
        <div class="mx-auto flex min-h-dvh w-full max-w-6xl items-center px-4 py-12">
          <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div class="ink-card p-6">
              <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">About</p>
              <h2 class="mt-2 text-3xl font-extrabold">Kenapa tampilannya tegas?</h2>
              <p class="mt-3 text-sm font-semibold text-ink/70">
                Karena di kelas, yang paling mahal itu perhatian. Neo-brutalism bikin elemen UI kontras,
                status gampang dibaca, dan keputusan (publish, submit, review) lebih jelas.
              </p>

              <div class="mt-5 grid gap-3 sm:grid-cols-2">
                <div class="rounded-2xl border-2 border-ink bg-cloud p-4 shadow-ink-sm">
                  <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Prinsip</p>
                  <p class="mt-2 text-sm font-extrabold">Jelas dulu, cantik belakangan</p>
                </div>
                <div class="rounded-2xl border-2 border-ink bg-ocean-50 p-4 shadow-ink-sm">
                  <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ocean-700">Aksen</p>
                  <p class="mt-2 text-sm font-extrabold">Biru kecil, untuk highlight</p>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <article class="ink-card p-5">
                <p class="text-sm font-extrabold">"AI generate-nya bikin hemat waktu."</p>
                <p class="mt-2 text-sm font-semibold text-ink/70">
                  Bisa generate dari PDF dan apply langsung ke quiz, jadi teacher tinggal review.
                </p>
                <p class="mt-3 text-xs font-bold text-ink/60">Dummy Review • Teacher</p>
              </article>
              <article class="ink-card p-5">
                <p class="text-sm font-extrabold">"Nilai lebih kebaca, ga ngaco."</p>
                <p class="mt-2 text-sm font-semibold text-ink/70">
                  Per-soal points ikut setting, essay ikut manual points, total score konsisten.
                </p>
                <p class="mt-3 text-xs font-bold text-ink/60">Dummy Review • Student</p>
              </article>
              <article class="ink-card bg-accent/25 p-5">
                <p class="text-sm font-extrabold">"Leaderboard public buat kompetisi."</p>
                <p class="mt-2 text-sm font-semibold text-ink/70">
                  Bisa dibuka/tutup oleh pengampu, urutannya jelas.
                </p>
                <p class="mt-3 text-xs font-bold text-ink/60">Dummy Review • Admin</p>
              </article>
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

import MarketingHeader from '@/components/marketing/MarketingHeader.vue'
import MarketingFooter from '@/components/marketing/MarketingFooter.vue'
import ReportForm from '@/components/marketing/ReportForm.vue'

const auth = useAuthStore()
</script>
