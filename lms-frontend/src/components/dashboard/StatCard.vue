<template>
  <div class="ink-card p-5" :class="variantClass">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-3xl font-semibold leading-none">{{ value }}</p>
        <p class="mt-2 text-sm font-semibold" :class="variantTextClass">{{ title }}</p>
      </div>
      <div class="grid h-11 w-11 place-items-center rounded-2xl border-2 border-ink bg-paper/80 shadow-ink-sm">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  variant: { type: String, default: 'paper' },
})

const variantClass = computed(() => {
  if (props.variant === 'ocean') return 'bg-gradient-to-br from-ocean-500 to-ocean-700 text-white'
  return 'bg-paper'
})

const variantTextClass = computed(() => {
  if (props.variant === 'ocean') return 'text-white/90'
  return 'text-ink/70'
})
</script>
