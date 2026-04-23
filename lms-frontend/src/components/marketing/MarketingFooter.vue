<template>
  <footer class="border-t-2 border-ink bg-paper">
    <div class="mx-auto w-full max-w-6xl px-4 py-10">
      <div class="grid gap-6 sm:grid-cols-2">
        <div>
          <div class="flex items-center gap-3">
            <span class="grid h-9 w-9 place-items-center rounded-xl border-2 border-ink bg-accent text-xs font-extrabold">LMS</span>
            <p class="font-display text-sm font-semibold">Scholarly</p>
          </div>
          <p class="mt-3 max-w-md text-sm font-semibold text-ink/70">
            Neo-brutal learning platform untuk modul, kuis, AI generate soal dari PDF, dan penilaian essay yang jelas.
          </p>
        </div>

        <div class="grid gap-3 sm:justify-self-end">
          <div class="flex flex-wrap gap-2">
            <RouterLink to="/" class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-sm font-extrabold shadow-ink-sm">Home</RouterLink>
            <RouterLink to="/about" class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-sm font-extrabold shadow-ink-sm">About</RouterLink>
            <RouterLink to="/contact" class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-sm font-extrabold shadow-ink-sm">Contact</RouterLink>
            <RouterLink to="/login" class="rounded-xl border-2 border-ink bg-ink px-3 py-2 text-sm font-extrabold text-paper shadow-ink-sm">Login</RouterLink>
          </div>
          <p class="text-xs font-bold text-ink/60">© {{ year }} Scholarly LMS. All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const year = new Date().getFullYear()
</script>
