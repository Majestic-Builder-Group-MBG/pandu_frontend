<template>
  <div>
    <MarketingHeader />

    <main class="mx-auto w-full max-w-6xl px-4 py-10">
      <section class="ink-card bg-paper-grid p-8">
        <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Legal</p>
        <h1 class="mt-2 text-4xl font-extrabold">Terms & Conditions</h1>
        <p class="mt-4 max-w-3xl text-sm font-semibold text-ink/70">
          Dokumen ringkas untuk kebutuhan MVP lomba. Dengan menggunakan Pandu LMS, kamu setuju dengan ketentuan berikut.
        </p>
      </section>

      <section class="mt-8 grid gap-4">
        <article class="ink-card p-6">
          <h2 class="text-xl font-extrabold">Akun & Akses</h2>
          <ul class="mt-3 list-disc pl-5 text-sm font-semibold text-ink/70">
            <li>Jaga kerahasiaan kredensial akun</li>
            <li>Role dan izin ditentukan oleh sistem (mis. lewat kode registrasi)</li>
          </ul>
        </article>

        <article class="ink-card p-6">
          <h2 class="text-xl font-extrabold">Penggunaan Yang Dilarang</h2>
          <ul class="mt-3 list-disc pl-5 text-sm font-semibold text-ink/70">
            <li>Mengganggu layanan atau mencoba akses tanpa izin</li>
            <li>Mengunggah konten yang melanggar hukum/hak cipta</li>
          </ul>
        </article>

        <article class="ink-card p-6">
          <h2 class="text-xl font-extrabold">Disclaimer MVP</h2>
          <p class="mt-3 text-sm font-semibold text-ink/70">
            Ini proyek MVP untuk demo. Fitur dan kebijakan bisa berubah. Untuk penggunaan produksi, perlu review keamanan,
            legal, dan SLA.
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
