<template>
  <div v-if="open" class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-ink/40" @click="$emit('close')" />
    <div class="absolute inset-0 overflow-y-auto">
      <div class="mx-auto flex min-h-dvh w-full max-w-xl items-center px-4 py-10">
        <div class="ink-card w-full bg-paper p-6 shadow-ink">
          <header class="flex items-start justify-between gap-4">
            <div>
              <p v-if="kicker" class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">{{ kicker }}</p>
              <h2 class="mt-1 text-xl font-semibold">{{ title }}</h2>
              <p v-if="subtitle" class="mt-2 text-sm font-semibold text-ink/60">{{ subtitle }}</p>
            </div>
            <button
              type="button"
              class="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-paper shadow-ink-sm"
              aria-label="Close"
              @click="$emit('close')"
            >
              <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </button>
          </header>

          <div class="mt-6">
            <slot />
          </div>

          <div v-if="$slots.actions" class="mt-6 flex flex-wrap items-center justify-end gap-2">
            <slot name="actions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  kicker: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})

const emit = defineEmits(['close'])

function onKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault()
    if (props.open) emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>
