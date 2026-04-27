<template>
  <footer class="border-t-2 border-ink bg-paper">
    <div class="mx-auto w-full max-w-6xl px-4 py-10">
      <div class="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div class="flex items-center gap-3">
            <img :src="logoPandu" alt="Pandu" class="h-12 w-12 shrink-0 object-contain" />
            <p class="font-display text-sm font-semibold">Pandu</p>
          </div>
          <p class="mt-3 max-w-md text-sm font-semibold text-ink/70">
            Pandu LMS membantu mengelola kelas, materi, sesi, dan kuis online dalam satu dashboard.
            Buat draft soal dari PDF, review, lalu publikasikan saat sudah siap.
          </p>
        </div>

        <div class="grid gap-8 sm:grid-cols-3">
          <div class="grid gap-2">
            <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Produk</p>
            <RouterLink to="/" class="footer-link">Beranda</RouterLink>
            <RouterLink to="/features" class="footer-link">Fitur</RouterLink>
            <RouterLink to="/dashboard" class="footer-link">Dashboard</RouterLink>
          </div>

          <div class="grid gap-2">
            <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Tentang</p>
            <RouterLink to="/about" class="footer-link">Tentang Pandu</RouterLink>
            <RouterLink to="/contact" class="footer-link">Demo</RouterLink>
            <RouterLink to="/login" class="footer-link">Login</RouterLink>
          </div>

          <div class="grid gap-2">
            <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Legal</p>
            <RouterLink to="/privacy" class="footer-link">Kebijakan Privasi</RouterLink>
            <RouterLink to="/terms" class="footer-link">Syarat & Ketentuan</RouterLink>
            <RouterLink to="/cookies" class="footer-link">Kebijakan Cookie</RouterLink>
          </div>
        </div>
      </div>

      <div class="mt-10 flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink pt-6">
        <p class="text-xs font-bold text-ink/60">© {{ year }} Pandu LMS. All rights reserved.</p>
        <p class="text-xs font-bold text-ink/60">Dibangun untuk alur belajar yang jelas.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'

import logoPandu from '@/assets/logo_pandu_.png'

const year = new Date().getFullYear()
</script>

<style scoped>
.footer-link {
  @apply text-sm font-semibold text-ink/70 hover:text-ink hover:underline underline-offset-4;
}
</style>
