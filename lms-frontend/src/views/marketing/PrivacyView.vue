<template>
  <div>
    <MarketingHeader />

    <main class="mx-auto w-full max-w-6xl px-4 py-10">
      <section class="ink-card bg-paper-grid p-8">
        <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Legal</p>
        <h1 class="mt-2 text-4xl font-extrabold">Privacy Policy</h1>
        <p class="mt-4 max-w-3xl text-sm font-semibold text-ink/70">
          Ini versi ringkas untuk konteks MVP lomba. Kalau nanti dipakai produksi, kebijakan ini perlu disesuaikan dengan
          kebijakan institusi dan regulasi yang berlaku.
        </p>
      </section>

      <section class="mt-8 grid gap-4">
        <article class="ink-card p-6">
          <h2 class="text-xl font-extrabold">Data Yang Dikumpulkan</h2>
          <ul class="mt-3 list-disc pl-5 text-sm font-semibold text-ink/70">
            <li>Identitas akun: nama, email, role</li>
            <li>Aktivitas belajar: modul, sesi, attempts, skor</li>
            <li>Konten input: jawaban quiz, feedback penilaian</li>
          </ul>
        </article>

        <article class="ink-card p-6">
          <h2 class="text-xl font-extrabold">Tujuan Penggunaan</h2>
          <ul class="mt-3 list-disc pl-5 text-sm font-semibold text-ink/70">
            <li>Autentikasi dan otorisasi akses</li>
            <li>Menampilkan progres, nilai, dan leaderboard</li>
            <li>Perbaikan kualitas produk dan debugging</li>
          </ul>
        </article>

        <article class="ink-card p-6">
          <h2 class="text-xl font-extrabold">Penyimpanan & Keamanan</h2>
          <p class="mt-3 text-sm font-semibold text-ink/70">
            Data disimpan oleh backend aplikasi. Akses dibatasi dengan role-based access. Untuk demo MVP, beberapa bagian
            masih bersifat placeholder.
          </p>
        </article>
      </section>
    </main>

    <MarketingFooter />
  </div>
</template>

<script setup>
import MarketingHeader from '@/components/marketing/MarketingHeader.vue'
import MarketingFooter from '@/components/marketing/MarketingFooter.vue'
</script>
