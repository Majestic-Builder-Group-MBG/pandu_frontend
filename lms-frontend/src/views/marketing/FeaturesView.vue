<template>
  <div>
    <MarketingHeader />

    <main class="mx-auto w-full max-w-6xl px-4 py-10">
      <section class="ink-card bg-paper-grid p-8">
        <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Features</p>
        <h1 class="mt-2 text-4xl font-extrabold">Pandu LMS, fokus ke alur kelas.</h1>
        <p class="mt-4 max-w-3xl text-sm font-semibold text-ink/70">
          MVP ini dirancang untuk demo lomba: jelas, cepat dipahami, dan nunjukin end-to-end flow dari modul, sesi, kuis,
          penilaian, sampai leaderboard.
        </p>
      </section>

      <section class="mt-8 grid gap-4 md:grid-cols-2">
        <article class="ink-card p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-2xl font-extrabold">Modules & Sessions</h2>
              <p class="mt-2 text-sm font-semibold text-ink/70">
                Struktur kelas yang rapi: modul sebagai container, sesi sebagai jadwal. Status sesi mengontrol akses quiz
                supaya student tidak bingung.
              </p>
            </div>
            <span class="ink-chip bg-accent/40">core</span>
          </div>
          <ul class="mt-4 list-disc pl-5 text-sm font-semibold text-ink/70">
            <li>Jadwal sesi dan akses yang konsisten</li>
            <li>Materi dan quiz menempel ke sesi</li>
          </ul>
        </article>

        <article class="ink-card bg-ocean-50 p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-2xl font-extrabold">Quiz Hub</h2>
              <p class="mt-2 text-sm font-semibold text-ink/70">
                Akses kuis dibuat sederhana: pilih modul dan sesi, lalu masuk ke quiz yang tersedia.
              </p>
            </div>
            <span class="ink-chip bg-paper">flow</span>
          </div>
          <ul class="mt-4 list-disc pl-5 text-sm font-semibold text-ink/70">
            <li>Masuk kuis lewat konteks kelas</li>
            <li>Ringan untuk demo dan usage harian</li>
          </ul>
        </article>

        <article class="ink-card p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-2xl font-extrabold">Attempts & Review</h2>
              <p class="mt-2 text-sm font-semibold text-ink/70">
                Penilaian dibuat transparan: MCQ auto, essay manual. Total score mengikuti kontrak points per soal.
              </p>
            </div>
            <span class="ink-chip bg-accent/40">trust</span>
          </div>
          <ul class="mt-4 list-disc pl-5 text-sm font-semibold text-ink/70">
            <li>Manual feedback dan manual points</li>
            <li>Agregasi nilai konsisten</li>
          </ul>
        </article>

        <article class="ink-card bg-accent/20 p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-2xl font-extrabold">AI Generate (PDF)</h2>
              <p class="mt-2 text-sm font-semibold text-ink/70">
                Untuk demo: upload PDF, generate draft soal, lalu apply ke quiz. Teacher tetap punya kontrol untuk edit.
              </p>
            </div>
            <span class="ink-chip bg-paper">speed</span>
          </div>
          <ul class="mt-4 list-disc pl-5 text-sm font-semibold text-ink/70">
            <li>Draft cepat untuk kelas besar</li>
            <li>Workflow tetap bisa diaudit</li>
          </ul>
        </article>
      </section>

      <section class="mt-8 grid gap-4 lg:grid-cols-3">
        <article class="ink-card p-6">
          <h2 class="text-xl font-extrabold">Leaderboard</h2>
          <p class="mt-2 text-sm font-semibold text-ink/70">
            Ranking yang rapi untuk kompetisi. Visibility bisa public/private sesuai kebutuhan kelas.
          </p>
        </article>

        <article class="ink-card p-6">
          <h2 class="text-xl font-extrabold">Role-Based Access</h2>
          <p class="mt-2 text-sm font-semibold text-ink/70">
            Alur akses disesuaikan role: admin/teacher/student. Area admin dibatasi dengan roles di router.
          </p>
        </article>

        <article class="ink-card p-6">
          <h2 class="text-xl font-extrabold">Neo-Brutal UI</h2>
          <p class="mt-2 text-sm font-semibold text-ink/70">
            Kontras tinggi, state mudah dibaca, dan interaksi terasa "tegas". Cocok untuk demo juri: cepat nangkep.
          </p>
        </article>
      </section>

      <section class="mt-8 ink-card bg-paper p-7">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Next</p>
            <p class="mt-2 text-sm font-semibold text-ink/70">
              Mau lihat langsung? Masuk ke dashboard untuk lihat data modul/sesi/quiz, atau coba alur register/login.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <RouterLink
              to="/login"
              class="rounded-xl border-2 border-ink bg-ink px-4 py-2 text-sm font-extrabold text-paper shadow-ink-sm"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/register"
              class="rounded-xl border-2 border-ink bg-accent px-4 py-2 text-sm font-extrabold shadow-ink-sm"
            >
              Register
            </RouterLink>
          </div>
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
</script>
