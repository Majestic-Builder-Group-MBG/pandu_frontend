<template>
  <div class="flex items-start gap-4">
    <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-2 border-ink bg-paper shadow-ink-sm">
      <slot />
    </div>
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-extrabold">{{ title }}</p>
      <p class="mt-0.5 truncate text-xs font-bold text-ink/60">{{ subtitle }}</p>
    </div>
    <p class="shrink-0 text-xs font-bold text-ink/50">{{ time }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  time: { type: String, required: true },
})
</script>
