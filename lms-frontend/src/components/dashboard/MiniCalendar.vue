<template>
  <div>
    <header class="flex items-center justify-between">
      <p class="text-sm font-extrabold">{{ monthName }} {{ year }}</p>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="grid h-9 w-9 place-items-center rounded-xl border-2 border-ink bg-paper shadow-ink-sm"
          aria-label="Prev month"
          @click="$emit('prev')"
        >
          <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
            <path d="M14 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          class="grid h-9 w-9 place-items-center rounded-xl border-2 border-ink bg-paper shadow-ink-sm"
          aria-label="Next month"
          @click="$emit('next')"
        >
          <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
            <path d="M10 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </header>

    <div class="mt-4 grid grid-cols-7 gap-2 text-center">
      <p v-for="d in days" :key="d" class="text-[11px] font-extrabold text-ink/60">{{ d }}</p>
      <div v-for="(cell, idx) in cells" :key="idx" class="grid place-items-center">
        <div
          v-if="cell"
          class="grid h-9 w-9 place-items-center rounded-xl border-2 border-ink text-xs font-extrabold"
          :class="isHighlighted(cell) ? 'bg-accent' : 'bg-paper'"
        >
          {{ cell }}
        </div>
        <div v-else class="h-9 w-9" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  highlights: { type: Array, default: () => [] },
})

defineEmits(['prev', 'next'])

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const monthName = computed(() => {
  const names = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  return names[props.month] || ''
})

const firstDayOfWeek = computed(() => new Date(props.year, props.month, 1).getDay())
const daysInMonth = computed(() => new Date(props.year, props.month + 1, 0).getDate())

const cells = computed(() => {
  const arr = []
  for (let i = 0; i < firstDayOfWeek.value; i += 1) arr.push(null)
  for (let d = 1; d <= daysInMonth.value; d += 1) arr.push(d)
  while (arr.length % 7 !== 0) arr.push(null)
  return arr
})

function isHighlighted(day) {
  return props.highlights.includes(day)
}
</script>
