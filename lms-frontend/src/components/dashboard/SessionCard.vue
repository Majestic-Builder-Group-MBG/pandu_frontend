<template>
  <article class="ink-card flex items-center gap-4 p-5">
    <div class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border-2 border-ink bg-cloud shadow-ink-sm">
      <div class="text-center">
        <p class="text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink/60">{{ monthShort }}</p>
        <p class="text-xl font-extrabold leading-none">{{ day }}</p>
      </div>
    </div>

    <div class="min-w-0 flex-1">
      <h4 class="truncate text-sm font-semibold">{{ session.title }}</h4>
      <p class="mt-1 truncate text-xs font-bold text-ink/60">{{ session.subtitle }}</p>
    </div>

    <button
      type="button"
      class="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-paper shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
      aria-label="Buka sesi"
      title="Buka"
      @click="openSession"
      :disabled="!canOpen"
    >
      <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
        <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  session: { type: Object, required: true },
})

const router = useRouter()

const canOpen = computed(() => {
  if (typeof props.session?.canOpen === 'boolean') return props.session.canOpen
  return Boolean(props.session?.moduleId)
})

function openSession() {
  const moduleId = props.session?.moduleId
  if (!moduleId) return
  const sessionId = props.session?.sessionId

  router.push({
    name: 'module-sessions',
    params: { moduleId },
    query: sessionId ? { sessionId } : {},
  })
}

const dt = computed(() => new Date(props.session.startAt))
const day = computed(() => dt.value.getDate())

const monthShort = computed(() => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return months[dt.value.getMonth()] || ''
})
</script>
