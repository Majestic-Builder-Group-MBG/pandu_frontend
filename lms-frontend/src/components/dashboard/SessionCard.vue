<template>
  <button
    type="button"
    class="ink-card flex w-full items-center gap-4 p-5 text-left transition"
    :class="
      canOpen
        ? 'hover:bg-accent/20 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
        : 'cursor-not-allowed opacity-70'
    "
    :disabled="!canOpen"
    @click="openSession"
  >
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
  </button>
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
