<template>
  <div>
    <MarketingHeader />

    <main class="mx-auto w-full max-w-6xl px-4 py-10">
      <section class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article class="ink-card bg-paper-grid p-7">
          <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Contact</p>
          <h1 class="mt-2 text-4xl font-extrabold">Kontak & report</h1>
          <p class="mt-4 text-sm font-semibold text-ink/70">
            Kirim bug, saran fitur, atau request improvement. Untuk demo lomba, kamu bisa pakai form ini sebagai
            bukti bahwa alur feedback sudah dipikirkan.
          </p>

          <div class="mt-6 grid gap-3">
            <div class="rounded-2xl border-2 border-ink bg-paper p-4 shadow-ink-sm">
              <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Email</p>
              <p class="mt-1 text-sm font-extrabold">admin@example.com</p>
            </div>
            <div class="rounded-2xl border-2 border-ink bg-ocean-50 p-4 shadow-ink-sm">
              <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ocean-700">Jam respon</p>
              <p class="mt-1 text-sm font-extrabold">Senin-Jumat, 09.00-17.00</p>
            </div>
            <div class="rounded-2xl border-2 border-ink bg-accent/35 p-4 shadow-ink-sm">
              <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Catatan</p>
              <p class="mt-1 text-sm font-extrabold">Sertakan modul/sesi/attempt id kalau report bug quiz.</p>
            </div>
          </div>
        </article>

        <section>
          <ReportForm />
        </section>
      </section>
    </main>

    <MarketingFooter />
  </div>
</template>

<script setup>
import MarketingHeader from '@/components/marketing/MarketingHeader.vue'
import MarketingFooter from '@/components/marketing/MarketingFooter.vue'
import ReportForm from '@/components/marketing/ReportForm.vue'
</script>
