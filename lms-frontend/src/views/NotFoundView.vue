<template>
  <section class="space-y-4 text-center">
    <h1 class="text-xl font-semibold tracking-tight">Page not found</h1>
    <p class="text-sm text-slate-600">Route tidak ditemukan.</p>
    <RouterLink to="/" class="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
      Kembali ke Home
    </RouterLink>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
