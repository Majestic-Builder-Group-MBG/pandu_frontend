<template>
  <div>
    <MarketingHeader />

    <main class="mx-auto w-full max-w-6xl px-4 pb-10 pt-28 sm:pt-32">
      <section class="ink-card bg-paper-grid p-8">
        <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Legal</p>
        <h1 class="mt-2 text-4xl font-extrabold">Cookie Policy</h1>
        <p class="mt-4 max-w-3xl text-sm font-semibold text-ink/70">
          Pandu LMS menggunakan mekanisme penyimpanan sesi (mis. token) untuk menjaga pengguna tetap login dan meningkatkan
          pengalaman penggunaan.
        </p>
      </section>

      <section class="mt-8 grid gap-4">
        <article class="ink-card p-6">
          <h2 class="text-xl font-extrabold">Yang Dipakai</h2>
          <ul class="mt-3 list-disc pl-5 text-sm font-semibold text-ink/70">
            <li>Session/auth: mempertahankan status login</li>
            <li>Preferensi UI (jika ada): menyimpan pilihan dasar</li>
          </ul>
        </article>

        <article class="ink-card p-6">
          <h2 class="text-xl font-extrabold">Catatan</h2>
          <p class="mt-3 text-sm font-semibold text-ink/70">
            Implementasi detail bergantung pada backend dan konfigurasi deployment. Untuk demo MVP, kebijakan ini bersifat
            informatif.
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
