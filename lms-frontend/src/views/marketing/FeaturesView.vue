<template>
  <div>
    <MarketingHeader />

    <main class="mx-auto w-full max-w-6xl px-4 pb-16 pt-28 sm:pt-32">
      <section class="relative overflow-hidden rounded-[3rem] bg-paper px-7 py-10 shadow-ink-sm sm:px-12 sm:py-12">
        <div class="pointer-events-none absolute inset-0 opacity-[0.9]">
          <div class="h-full w-full bg-paper-grid" />
        </div>
        <div class="pointer-events-none absolute -left-16 top-10 hidden h-44 w-44 -rotate-6 rounded-[2.5rem] bg-accent/30 sm:block" />
        <div class="pointer-events-none absolute -right-20 bottom-8 hidden h-56 w-56 rotate-6 rounded-[3rem] bg-ocean-50 sm:block" />

        <div class="relative grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Features</p>
            <h1 class="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Pandu LMS, fokus ke alur kelas.</h1>
            <p class="mt-5 max-w-xl text-sm font-semibold text-ink/70">
              MVP ini dirancang untuk demo lomba: jelas, cepat dipahami, dan nunjukin end-to-end flow dari modul, sesi, kuis,
              penilaian, sampai leaderboard.
            </p>

            <div class="mt-8 flex flex-wrap items-center gap-3">
              <RouterLink
                to="/contact"
                class="inline-flex rounded-xl border-2 border-ink bg-accent px-6 py-3 text-sm font-extrabold shadow-ink transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                Coba Demo AI
              </RouterLink>
              <RouterLink
                to="/"
                class="text-sm font-extrabold text-ink/70 hover:text-ink hover:underline underline-offset-4"
              >
                Kembali ke landing
              </RouterLink>
            </div>
          </div>

          <div class="relative">
            <div class="mx-auto w-full max-w-md">
              <img :src="featuresVector" alt="Pandu illustration" class="w-full select-none object-contain" />
            </div>
          </div>
        </div>
      </section>

      <section class="mt-12">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Core Flow</p>
            <h2 class="mt-2 text-3xl font-extrabold">Satu alur, dari kelas sampai nilai.</h2>
            <p class="mt-2 max-w-2xl text-sm font-semibold text-ink/70">
              Empat blok ini disusun buat presentasi: urut, ringkas, dan gampang di-follow tanpa banyak konteks.
            </p>
          </div>
        </div>

        <div class="mt-8 grid gap-5 md:grid-cols-2">
          <article class="rounded-[2.5rem] bg-paper p-7 shadow-[0_18px_40px_rgba(18,18,18,0.08)] ring-1 ring-ink/10">
            <div class="grid h-14 w-14 place-items-center rounded-2xl bg-accent/50">
              <svg viewBox="0 0 24 24" fill="none" class="h-7 w-7" aria-hidden="true">
                <path d="M4 6h16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                <path d="M4 12h10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                <path d="M4 18h16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
              </svg>
            </div>
            <h3 class="mt-5 text-2xl font-extrabold">Modules & Sessions</h3>
            <p class="mt-2 text-sm font-semibold text-ink/70">
              Struktur kelas yang rapi: modul sebagai container, sesi sebagai jadwal. Status sesi mengontrol akses quiz supaya student tidak bingung.
            </p>
            <ul class="mt-4 list-disc pl-5 text-sm font-semibold text-ink/70">
              <li>Jadwal sesi dan akses yang konsisten</li>
              <li>Materi dan quiz menempel ke sesi</li>
            </ul>
          </article>

          <article class="rounded-[2.5rem] bg-paper p-7 shadow-[0_18px_40px_rgba(18,18,18,0.08)] ring-1 ring-ink/10">
            <div class="grid h-14 w-14 place-items-center rounded-2xl bg-ocean-50 text-ocean-700">
              <svg viewBox="0 0 24 24" fill="none" class="h-7 w-7" aria-hidden="true">
                <path
                  d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10Z"
                  stroke="currentColor"
                  stroke-width="2.5"
                />
                <path
                  d="M9.2 9.2a3 3 0 1 1 4.6 2.6c-.9.6-1.8 1.3-1.8 2.7v.7"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path d="M12 18h.01" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
              </svg>
            </div>
            <h3 class="mt-5 text-2xl font-extrabold">Quiz Hub</h3>
            <p class="mt-2 text-sm font-semibold text-ink/70">
              Akses kuis dibuat sederhana: pilih modul dan sesi, lalu masuk ke quiz yang tersedia. Cocok untuk demo karena alurnya jelas.
            </p>
            <ul class="mt-4 list-disc pl-5 text-sm font-semibold text-ink/70">
              <li>Masuk kuis lewat konteks kelas</li>
              <li>Ringan untuk usage harian</li>
            </ul>
          </article>

          <article class="rounded-[2.5rem] bg-paper p-7 shadow-[0_18px_40px_rgba(18,18,18,0.08)] ring-1 ring-ink/10">
            <div class="grid h-14 w-14 place-items-center rounded-2xl bg-paper text-ink">
              <svg viewBox="0 0 24 24" fill="none" class="h-7 w-7" aria-hidden="true">
                <path d="M4 20h16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                <path d="M7 17V7a3 3 0 0 1 3-3h7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                <path d="M14 4h6v6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                <path d="M20 4l-8 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
              </svg>
            </div>
            <h3 class="mt-5 text-2xl font-extrabold">Attempts & Review</h3>
            <p class="mt-2 text-sm font-semibold text-ink/70">
              Penilaian dibuat transparan: MCQ auto, essay manual. Total score mengikuti kontrak points per soal untuk menjaga konsistensi.
            </p>
            <ul class="mt-4 list-disc pl-5 text-sm font-semibold text-ink/70">
              <li>Manual feedback dan manual points</li>
              <li>Agregasi nilai konsisten</li>
            </ul>
          </article>

          <article class="rounded-[2.5rem] bg-paper p-7 shadow-[0_18px_40px_rgba(18,18,18,0.08)] ring-1 ring-ink/10">
            <div class="grid h-14 w-14 place-items-center rounded-2xl bg-accent/30">
              <svg viewBox="0 0 24 24" fill="none" class="h-7 w-7" aria-hidden="true">
                <path d="M12 2v6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                <path d="M12 16v6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                <path d="M2 12h6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                <path d="M16 12h6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                <path d="M8.2 8.2l-4.2-4.2" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                <path d="M20 20l-4.2-4.2" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
              </svg>
            </div>
            <h3 class="mt-5 text-2xl font-extrabold">AI Generate (PDF)</h3>
            <p class="mt-2 text-sm font-semibold text-ink/70">
              Untuk demo: upload PDF, generate draft soal, lalu apply ke quiz. Teacher tetap punya kontrol untuk edit dan review.
            </p>
            <ul class="mt-4 list-disc pl-5 text-sm font-semibold text-ink/70">
              <li>Draft cepat untuk kelas besar</li>
              <li>Workflow tetap bisa diaudit</li>
            </ul>
          </article>
        </div>
      </section>

      <section class="mt-12 overflow-hidden rounded-[3rem] bg-cloud p-8 sm:p-10">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Also Included</p>
            <h2 class="mt-2 text-3xl font-extrabold">Detail yang bikin produk terasa matang.</h2>
            <p class="mt-2 max-w-2xl text-sm font-semibold text-ink/70">
              Dipilih yang relevan untuk demo: trust, kontrol akses, dan visual yang mudah dibaca.
            </p>
          </div>
        </div>

        <div class="mt-8 grid gap-5 lg:grid-cols-3">
          <article class="rounded-[2rem] bg-paper p-7 shadow-[0_14px_30px_rgba(18,18,18,0.08)] ring-1 ring-ink/10">
            <h3 class="text-xl font-extrabold">Leaderboard</h3>
            <p class="mt-2 text-sm font-semibold text-ink/70">
              Ranking rapi untuk kompetisi. Visibility bisa public/private sesuai kebutuhan kelas.
            </p>
          </article>
          <article class="rounded-[2rem] bg-paper p-7 shadow-[0_14px_30px_rgba(18,18,18,0.08)] ring-1 ring-ink/10">
            <h3 class="text-xl font-extrabold">Role-Based Access</h3>
            <p class="mt-2 text-sm font-semibold text-ink/70">
              Akses disesuaikan role: admin/teacher/student. Area admin dibatasi dengan roles di router.
            </p>
          </article>
          <article class="rounded-[2rem] bg-paper p-7 shadow-[0_14px_30px_rgba(18,18,18,0.08)] ring-1 ring-ink/10">
            <h3 class="text-xl font-extrabold">Neo-Brutal UI</h3>
            <p class="mt-2 text-sm font-semibold text-ink/70">
              Kontras tinggi, state mudah dibaca, dan interaksi tegas. Cocok untuk demo juri: cepat nangkep.
            </p>
          </article>
        </div>
      </section>
    </main>

    <MarketingFooter />
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

import MarketingHeader from '@/components/marketing/MarketingHeader.vue'
import MarketingFooter from '@/components/marketing/MarketingFooter.vue'

import featuresVector from '@/assets/images/continuous-learning.svg'
</script>
