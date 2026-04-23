<template>
  <div class="relative min-h-dvh overflow-hidden bg-paper">
    <div class="absolute inset-0 opacity-[0.9]">
      <div class="h-full w-full bg-paper-grid" />
    </div>

    <div class="pointer-events-none absolute -left-24 top-20 hidden h-64 w-64 -rotate-6 rounded-[3rem] border-2 border-ink bg-accent/20 shadow-ink sm:block" />
    <div class="pointer-events-none absolute -right-28 bottom-16 hidden h-72 w-72 rotate-6 rounded-[3rem] border-2 border-ink bg-ocean-50 shadow-ink sm:block" />

    <main class="relative z-10 mx-auto min-h-dvh w-full max-w-6xl flex justify-center overflow-hidden">
      <slot />
    </main>
  </div>
</template>

<script setup></script>
