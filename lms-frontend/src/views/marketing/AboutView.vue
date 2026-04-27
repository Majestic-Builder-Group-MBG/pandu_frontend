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
            <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Tentang</p>
            <h1 class="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Pandu,
              <span class="underline decoration-accent decoration-[12px] underline-offset-[8px]">LMS yang jelas</span>
              untuk kelas yang lebih terstruktur.
            </h1>
            <p class="mt-5 max-w-xl text-sm font-semibold text-ink/70">
              Pandu LMS membantu pengajar menyusun modul dan sesi, menjalankan kuis online, serta memantau hasil belajar dalam satu alur.
              Kamu bisa menyiapkan soal lebih cepat dari materi PDF, lalu review dan edit sebelum dipublikasikan.
              Hasilnya: kelas lebih rapi, aturan lebih jelas, dan penilaian lebih konsisten.
            </p>

          </div>

          <div class="relative">
            <div class="mx-auto w-full max-w-md">
              <img :src="aboutHeroVector" alt="Ilustrasi Pandu LMS" class="w-full select-none object-contain" />
            </div>
          </div>
        </div>
      </section>

      <section class="mt-12">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Fokus Kami</p>
            <h2 class="mt-2 text-3xl font-extrabold">Tiga hal yang paling kamu rasakan.</h2>
            <p class="mt-2 max-w-2xl text-sm font-semibold text-ink/70">
              Bukan sekadar menambah fitur, tapi memastikan pengalaman belajar terasa ringkas, jelas, dan nyaman digunakan.
            </p>
          </div>
        </div>

        <div class="mt-8 grid gap-5 lg:grid-cols-3">
          <article class="overflow-hidden rounded-[2.5rem] bg-paper p-7 shadow-[0_18px_40px_rgba(18,18,18,0.08)] ring-1 ring-ink/10">
            <div class="grid place-items-center rounded-2xl bg-cloud p-5">
              <img :src="aboutVectorQuestions" alt="Ilustrasi kejelasan alur belajar" class="h-28 w-auto select-none object-contain" />
            </div>
            <h3 class="mt-5 text-xl font-extrabold">Jelas</h3>
            <p class="mt-2 text-sm font-semibold text-ink/70">
              Status kelas dan aturan kuis mudah dipahami. Mulai, kumpulkan, review, sampai nilai ditampilkan dengan alur yang konsisten.
            </p>
          </article>

          <article class="overflow-hidden rounded-[2.5rem] bg-paper p-7 shadow-[0_18px_40px_rgba(18,18,18,0.08)] ring-1 ring-ink/10">
            <div class="grid place-items-center rounded-2xl bg-accent/20 p-5">
              <img :src="aboutVectorAi" alt="Ilustrasi pembuatan soal lebih cepat" class="h-28 w-auto select-none object-contain" />
            </div>
            <h3 class="mt-5 text-xl font-extrabold">Lebih Cepat</h3>
            <p class="mt-2 text-sm font-semibold text-ink/70">
              Buat draft soal dari PDF untuk menghemat waktu. Tetap ada proses review dan edit sebelum soal dipakai di kelas.
            </p>
          </article>

          <article class="overflow-hidden rounded-[2.5rem] bg-paper p-7 shadow-[0_18px_40px_rgba(18,18,18,0.08)] ring-1 ring-ink/10">
            <div class="grid place-items-center rounded-2xl bg-ocean-50 p-5">
              <img :src="aboutVectorTrust" alt="Ilustrasi penilaian yang terpercaya" class="h-28 w-auto select-none object-contain" />
            </div>
            <h3 class="mt-5 text-xl font-extrabold">Terpercaya</h3>
            <p class="mt-2 text-sm font-semibold text-ink/70">
              Penilaian transparan dan konsisten. Pilihan ganda bisa otomatis, esai bisa dinilai manual dengan rubrik dan poin yang jelas.
            </p>
          </article>
        </div>
      </section>

      <section class="mt-12 grid gap-5 lg:grid-cols-2">
        <article class="rounded-[3rem] bg-paper p-8 shadow-[0_18px_40px_rgba(18,18,18,0.08)] ring-1 ring-ink/10">
          <h2 class="text-2xl font-extrabold">FAQ</h2>
          <div class="mt-5 space-y-3">
            <details class="rounded-2xl bg-cloud p-5 ring-1 ring-ink/10">
              <summary class="cursor-pointer text-sm font-extrabold">Pandu LMS cocok untuk siapa?</summary>
              <p class="mt-2 text-sm font-semibold text-ink/70">
                Pandu cocok untuk sekolah, bootcamp, trainer, dan pengajar yang ingin alur kelas lebih terstruktur: modul, sesi per pertemuan, kuis online, dan rekap nilai.
              </p>
            </details>

            <details class="rounded-2xl bg-cloud p-5 ring-1 ring-ink/10">
              <summary class="cursor-pointer text-sm font-extrabold">Bagaimana alur modul dan sesi bekerja?</summary>
              <p class="mt-2 text-sm font-semibold text-ink/70">
                Susun materi ke dalam modul, lalu buat sesi untuk tiap pertemuan. Kuis bisa diakses dari sesi agar siswa langsung tahu tugas yang relevan dengan pertemuan tersebut.
              </p>
            </details>

            <details class="rounded-2xl bg-cloud p-5 ring-1 ring-ink/10">
              <summary class="cursor-pointer text-sm font-extrabold">Bisa buat soal dari materi PDF?</summary>
              <p class="mt-2 text-sm font-semibold text-ink/70">
                Bisa. Kamu dapat mengubah materi PDF menjadi draft soal untuk mempercepat persiapan kuis. Setelah itu, pengajar bisa review dan edit sebelum dipublikasikan.
              </p>
            </details>

            <details class="rounded-2xl bg-cloud p-5 ring-1 ring-ink/10">
              <summary class="cursor-pointer text-sm font-extrabold">Bagaimana penilaian pilihan ganda dan esai?</summary>
              <p class="mt-2 text-sm font-semibold text-ink/70">
                Pilihan ganda dapat dinilai otomatis. Untuk esai, pengajar dapat memberi penilaian dan umpan balik secara manual agar hasilnya lebih akurat.
              </p>
            </details>

            <details class="rounded-2xl bg-cloud p-5 ring-1 ring-ink/10">
              <summary class="cursor-pointer text-sm font-extrabold">Apa itu attempts dan review?</summary>
              <p class="mt-2 text-sm font-semibold text-ink/70">
                Attempts adalah riwayat pengerjaan kuis oleh siswa. Review membantu pengajar meninjau jawaban, memberi umpan balik, dan memastikan penilaian konsisten.
              </p>
            </details>

            <details class="rounded-2xl bg-cloud p-5 ring-1 ring-ink/10">
              <summary class="cursor-pointer text-sm font-extrabold">Leaderboard bisa ditampilkan untuk siapa saja?</summary>
              <p class="mt-2 text-sm font-semibold text-ink/70">
                Bisa disesuaikan. Kamu dapat menampilkan leaderboard untuk semua peserta, atau membatasinya hanya untuk kelas tertentu.
              </p>
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
