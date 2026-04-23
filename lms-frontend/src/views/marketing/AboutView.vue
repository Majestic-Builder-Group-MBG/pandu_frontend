<template>
  <div>
    <MarketingHeader />

    <main class="mx-auto w-full max-w-6xl px-4 pb-10 pt-28 sm:pt-32">
      <section class="relative overflow-hidden rounded-[3rem] bg-paper px-7 py-10 shadow-ink-sm sm:px-12 sm:py-12">
        <div class="pointer-events-none absolute inset-0 opacity-[0.9]">
          <div class="h-full w-full bg-paper-grid" />
        </div>
        <div class="pointer-events-none absolute -left-16 top-12 hidden h-44 w-44 -rotate-6 rounded-[2.5rem] bg-accent/30 sm:block" />
        <div class="pointer-events-none absolute -right-20 bottom-10 hidden h-56 w-56 rotate-6 rounded-[3rem] bg-ocean-50 sm:block" />

        <div class="relative grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">About</p>
            <h1 class="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Pandu,
              <span class="underline decoration-accent decoration-[12px] underline-offset-[8px]">LMS yang jelas</span>
              untuk demo MVP.
            </h1>
            <p class="mt-5 max-w-xl text-sm font-semibold text-ink/70">
              Project ini dibuat sebagai MVP untuk demo lomba. Fokusnya bukan hanya daftar fitur, tapi juga flow yang rapi
              dan mudah dibuktikan: modul dan sesi sebagai struktur kelas, kuis yang bisa dibuat cepat (termasuk dari PDF),
              serta penilaian yang konsisten supaya hasilnya bisa dipertanggungjawabkan.
            </p>

          </div>

          <div class="relative">
            <div class="mx-auto w-full max-w-md">
              <img :src="aboutHeroVector" alt="Pandu" class="w-full select-none object-contain" />
            </div>
          </div>
        </div>
      </section>

      <section class="mt-12">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">What We Optimize</p>
            <h2 class="mt-2 text-3xl font-extrabold">Tiga hal yang bikin flow terasa enak.</h2>
            <p class="mt-2 max-w-2xl text-sm font-semibold text-ink/70">
              Bukan “fitur banyak”, tapi keputusan desain yang membuat demo terlihat matang dan mudah dinilai.
            </p>
          </div>
        </div>

        <div class="mt-8 grid gap-5 lg:grid-cols-3">
          <article class="overflow-hidden rounded-[2.5rem] bg-paper p-7 shadow-[0_18px_40px_rgba(18,18,18,0.08)] ring-1 ring-ink/10">
            <div class="grid place-items-center rounded-2xl bg-cloud p-5">
              <img :src="aboutVectorQuestions" alt="Clarity" class="h-28 w-auto select-none object-contain" />
            </div>
            <h3 class="mt-5 text-xl font-extrabold">Clarity</h3>
            <p class="mt-2 text-sm font-semibold text-ink/70">
              Status dan aturan kebaca. Publish, schedule, submit, review: jelas, konsisten, dan tidak bikin user menebak.
            </p>
          </article>

          <article class="overflow-hidden rounded-[2.5rem] bg-paper p-7 shadow-[0_18px_40px_rgba(18,18,18,0.08)] ring-1 ring-ink/10">
            <div class="grid place-items-center rounded-2xl bg-accent/20 p-5">
              <img :src="aboutVectorAi" alt="Speed" class="h-28 w-auto select-none object-contain" />
            </div>
            <h3 class="mt-5 text-xl font-extrabold">Speed</h3>
            <p class="mt-2 text-sm font-semibold text-ink/70">
              AI bantu bikin draft soal dari PDF. Teacher tetap pegang kontrol untuk edit dan review sebelum dipakai.
            </p>
          </article>

          <article class="overflow-hidden rounded-[2.5rem] bg-paper p-7 shadow-[0_18px_40px_rgba(18,18,18,0.08)] ring-1 ring-ink/10">
            <div class="grid place-items-center rounded-2xl bg-ocean-50 p-5">
              <img :src="aboutVectorTrust" alt="Trust" class="h-28 w-auto select-none object-contain" />
            </div>
            <h3 class="mt-5 text-xl font-extrabold">Trust</h3>
            <p class="mt-2 text-sm font-semibold text-ink/70">
              Scoring tidak ngaco: MCQ bisa auto, essay bisa manual. Total score mengikuti kontrak points per soal.
            </p>
          </article>
        </div>
      </section>

      <section class="mt-12 grid gap-5 lg:grid-cols-2">
        <article class="rounded-[3rem] bg-paper p-8 shadow-[0_18px_40px_rgba(18,18,18,0.08)] ring-1 ring-ink/10">
          <h2 class="text-2xl font-extrabold">FAQ</h2>
          <div class="mt-5 space-y-3">
            <details class="rounded-2xl bg-cloud p-5 ring-1 ring-ink/10">
              <summary class="cursor-pointer text-sm font-extrabold">Kenapa dominan kuning?</summary>
              <p class="mt-2 text-sm font-semibold text-ink/70">Kuning = highlight. Putih = ruang. Biru = aksen untuk fokus.</p>
            </details>
            <details class="rounded-2xl bg-cloud p-5 ring-1 ring-ink/10">
              <summary class="cursor-pointer text-sm font-extrabold">AI generate dari apa?</summary>
              <p class="mt-2 text-sm font-semibold text-ink/70">Untuk MVP, fokus PDF-only sesuai flow generate-draft dan demo page.</p>
            </details>
            <details class="rounded-2xl bg-cloud p-5 ring-1 ring-ink/10">
              <summary class="cursor-pointer text-sm font-extrabold">Leaderboard bisa dipublikasi?</summary>
              <p class="mt-2 text-sm font-semibold text-ink/70">Bisa. Visibility diatur teacher/admin via endpoint leaderboard-visibility.</p>
            </details>
          </div>
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

import aboutHeroVector from '@/assets/images/undraw_my-app_jscv.svg'
import aboutVectorQuestions from '@/assets/images/undraw_questions_52ic.svg'
import aboutVectorAi from '@/assets/images/undraw_ai-code-assistant_5xop.svg'
import aboutVectorTrust from '@/assets/images/undraw_investor-update_ou4c.svg'
</script>
