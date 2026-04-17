<template>
  <header class="sticky top-0 z-20 border-b-2 border-ink bg-paper/80 backdrop-blur">
    <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
      <RouterLink to="/dashboard" class="flex items-center gap-3">
        <span class="grid h-9 w-9 place-items-center rounded-xl border-2 border-ink bg-accent text-xs font-extrabold">
          LMS
        </span>
        <span class="font-display text-sm font-semibold tracking-tight text-ink">Scholarly</span>
      </RouterLink>

      <nav class="flex items-center gap-2">
        <RouterLink
          to="/dashboard"
          class="rounded-xl border-2 border-transparent px-3 py-2 text-sm font-semibold text-ink/80 hover:border-ink hover:bg-accent/40 hover:text-ink"
        >
          Dashboard
        </RouterLink>
        <RouterLink
          to="/courses"
          class="rounded-xl border-2 border-transparent px-3 py-2 text-sm font-semibold text-ink/80 hover:border-ink hover:bg-accent/40 hover:text-ink"
        >
          Courses
        </RouterLink>
        <RouterLink to="/login" class="rounded-xl border-2 border-ink bg-ink px-3 py-2 text-sm font-semibold text-paper shadow-ink-sm">
          Login
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
