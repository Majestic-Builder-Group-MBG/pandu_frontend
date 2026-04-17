<template>
  <article class="ink-card overflow-hidden">
    <div class="relative">
      <div class="aspect-[16/9] w-full border-b-2 border-ink bg-cloud">
        <img :src="bannerSrc" alt="Module banner" class="h-full w-full object-cover" />
      </div>

      <div class="absolute left-4 top-4 flex items-center gap-2">
        <span class="ink-chip bg-accent/60">{{ module.level || 'Module' }}</span>
        <span v-if="bannerStatus === 'loading'" class="ink-chip bg-paper">Loading banner...</span>
        <span v-else-if="bannerStatus === 'error'" class="ink-chip bg-paper">Banner failed</span>
        <span v-else-if="!hasCustomBanner" class="ink-chip bg-paper">Default banner</span>
      </div>
    </div>

    <div class="p-5">
      <header class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/50">Module</p>
          <h3 class="mt-2 truncate text-base font-semibold">{{ module.title }}</h3>
          <p class="mt-1 line-clamp-2 text-sm font-semibold text-ink/60">{{ module.desc }}</p>
          <p v-if="metaLine" class="mt-2 truncate text-xs font-bold text-ink/50">{{ metaLine }}</p>
        </div>
        <div class="grid h-10 w-10 place-items-center rounded-2xl border-2 border-ink bg-paper shadow-ink-sm" aria-label="Module">
          <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
            <path d="M4 6.5L12 3l8 3.5-8 3.5-8-3.5Z" stroke="currentColor" stroke-width="2" />
            <path d="M4 10.5l8 3.5 8-3.5" stroke="currentColor" stroke-width="2" />
          </svg>
        </div>
      </header>

      <div v-if="showEnrollKey && module.enrollKey" class="mt-4 flex items-center justify-between gap-2 rounded-2xl border-2 border-ink bg-cloud px-4 py-3">
        <div class="min-w-0">
          <p class="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink/60">Enroll Key</p>
          <p class="mt-1 truncate font-mono text-sm font-extrabold text-ink">{{ module.enrollKey }}</p>
        </div>
        <button
          type="button"
          class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-xs font-extrabold shadow-ink-sm"
          @click="copyEnrollKey"
        >
          {{ copied ? 'Copied' : 'Copy' }}
        </button>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <span class="ink-chip bg-paper">{{ safeNum(module.sessions, 3) }} sesi</span>
        <span class="ink-chip bg-paper">{{ safeNum(module.materials, 0) }} materi</span>
        <span class="ink-chip bg-paper">{{ safeNum(module.quizzes, 0) }} kuis</span>
      </div>

      <div class="mt-5 flex items-center justify-between">
        <RouterLink
          v-if="openTo"
          :to="openTo"
          class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          Buka
        </RouterLink>
        <button
          v-else
          type="button"
          class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          Buka
        </button>

        <RouterLink
          v-if="detailTo"
          :to="detailTo"
          class="rounded-xl border-2 border-transparent px-3 py-2 text-sm font-bold text-ink/70 hover:border-ink hover:bg-accent/30 hover:text-ink"
        >
          Detail
        </RouterLink>
        <button
          v-else
          type="button"
          class="rounded-xl border-2 border-transparent px-3 py-2 text-sm font-bold text-ink/70 hover:border-ink hover:bg-accent/30 hover:text-ink"
        >
          Detail
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import defaultBanner from '@/assets/images/module-banner-default.svg'
import { createServices } from '@/services'
import { useModuleBannersStore } from '@/stores/moduleBanners'

const props = defineProps({
  module: {
    type: Object,
    required: true,
  },
  openTo: { type: String, default: '' },
  detailTo: { type: String, default: '' },
  showEnrollKey: { type: Boolean, default: false },
})

const hasCustomBanner = computed(() => {
  return Boolean(props.module?.bannerDownloadUrl || props.module?.hasBanner)
})

const bannerSrc = computed(() => {
  const cached = banners.urlsById[props.module?.id]
  if (cached) return cached
  return defaultBanner
})

const bannerStatus = computed(() => {
  const id = props.module?.id
  if (!id) return 'idle'
  return banners.statusById[id] || 'idle'
})

const metaLine = computed(() => {
  const teacher = props.module?.teacherName
  const createdAt = props.module?.createdAt
  const parts = []
  if (teacher) parts.push(`by ${teacher}`)
  if (createdAt) {
    const d = new Date(createdAt)
    if (!Number.isNaN(d.getTime())) parts.push(d.toLocaleDateString())
  }
  return parts.join(' - ')
})

function safeNum(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback
}

const copied = ref(false)

async function copyEnrollKey() {
  copied.value = false
  const val = props.module?.enrollKey
  if (!val) return

  try {
    await navigator.clipboard.writeText(String(val))
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1200)
  } catch {
    // ignore
  }
}

const services = createServices()
const banners = useModuleBannersStore()

onMounted(async () => {
  const id = props.module?.id
  const dl = props.module?.bannerDownloadUrl

  // Always use authenticated banner endpoint when available.
  if (!id || !dl) return
  await banners.ensureBanner({ moduleId: id, bannerPath: dl, services })
})
</script>
