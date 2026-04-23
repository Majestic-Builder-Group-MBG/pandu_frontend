<template>
  <div>
    <MarketingHeader />

    <main class="mx-auto w-full max-w-6xl px-4 py-10">
      <section class="ink-card bg-paper-grid p-8">
        <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">About</p>
        <h1 class="mt-2 text-4xl font-extrabold">Scholarly, versi tegas dari LMS.</h1>
        <p class="mt-4 max-w-3xl text-sm font-semibold text-ink/70">
          Halaman ini dummy untuk sekarang. Intinya: pengalaman belajar harus minim distraksi,
          penilaian harus konsisten, dan akses quiz harus jelas sesuai jadwal sesi.
        </p>

        <div class="mt-7 grid gap-4 lg:grid-cols-3">
          <article class="rounded-2xl border-2 border-ink bg-paper p-5 shadow-ink-sm">
            <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">1. Clarity</p>
            <p class="mt-2 text-sm font-extrabold">Status & aturan jelas</p>
            <p class="mt-2 text-sm font-semibold text-ink/70">Publish, schedule, submit, review: semuanya kebaca.</p>
          </article>
          <article class="rounded-2xl border-2 border-ink bg-accent/35 p-5 shadow-ink-sm">
            <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">2. Speed</p>
            <p class="mt-2 text-sm font-extrabold">AI bantu bikin soal</p>
            <p class="mt-2 text-sm font-semibold text-ink/70">PDF in, quiz out. Teacher fokus ke kualitas.</p>
          </article>
          <article class="rounded-2xl border-2 border-ink bg-ocean-50 p-5 shadow-ink-sm">
            <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ocean-700">3. Trust</p>
            <p class="mt-2 text-sm font-extrabold">Nilai ga ngaco</p>
            <p class="mt-2 text-sm font-semibold text-ink/70">Per-soal points & manual points match input.</p>
          </article>
        </div>
      </section>

      <section class="mt-8 grid gap-4 lg:grid-cols-2">
        <article class="ink-card p-6">
          <h2 class="text-2xl font-extrabold">FAQ (dummy)</h2>
          <div class="mt-4 space-y-3">
            <details class="rounded-2xl border-2 border-ink bg-paper p-4 shadow-ink-sm">
              <summary class="cursor-pointer text-sm font-extrabold">Kenapa dominan kuning?</summary>
              <p class="mt-2 text-sm font-semibold text-ink/70">Kuning = highlight. Putih = ruang. Biru = aksen untuk fokus.</p>
            </details>
            <details class="rounded-2xl border-2 border-ink bg-paper p-4 shadow-ink-sm">
              <summary class="cursor-pointer text-sm font-extrabold">AI generate dari apa?</summary>
              <p class="mt-2 text-sm font-semibold text-ink/70">Sekarang fokus PDF-only sesuai flow generate-draft.</p>
            </details>
            <details class="rounded-2xl border-2 border-ink bg-paper p-4 shadow-ink-sm">
              <summary class="cursor-pointer text-sm font-extrabold">Leaderboard bisa dipublikasi?</summary>
              <p class="mt-2 text-sm font-semibold text-ink/70">Bisa. Visibility diatur teacher/admin via endpoint leaderboard-visibility.</p>
            </details>
          </div>
        </article>

        <article class="ink-card bg-accent/25 p-6">
          <h2 class="text-2xl font-extrabold">Roadmap (ringkas)</h2>
          <ul class="mt-4 list-disc pl-5 text-sm font-semibold text-ink/70">
            <li>Export report nilai per modul</li>
            <li>Template quiz & bank soal</li>
            <li>AI: rangkum materi, generate rubrik essay</li>
            <li>Notifikasi web push untuk sesi yang dibuka</li>
          </ul>
          <RouterLink
            to="/contact"
            class="mt-6 inline-flex rounded-xl border-2 border-ink bg-ink px-4 py-2 text-sm font-extrabold text-paper shadow-ink-sm"
          >
            Kirim masukan
          </RouterLink>
        </article>
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
