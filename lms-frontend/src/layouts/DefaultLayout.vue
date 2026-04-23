<template>
  <div class="min-h-dvh bg-cloud">
    <AppHeader />
    <main class="w-full px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
</script>
