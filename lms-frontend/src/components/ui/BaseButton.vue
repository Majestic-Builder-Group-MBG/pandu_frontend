<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ink px-4 py-2 text-sm font-bold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
    :class="variantClasses"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' },
})

const variantClasses = computed(() => {
  if (props.variant === 'ghost') return 'border-transparent bg-transparent text-ink hover:bg-accent/30'
  if (props.variant === 'paper') return 'bg-paper text-ink hover:bg-slate-50'
  if (props.variant === 'ink') return 'bg-ink text-paper hover:bg-ink/90'
  if (props.variant === 'danger') return 'bg-rose-600 text-white hover:bg-rose-700'
  return 'bg-accent text-ink hover:bg-accent/90'
})
</script>
