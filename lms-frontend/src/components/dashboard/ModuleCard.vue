<template>
  <article
    class="ink-card overflow-hidden"
    :class="cardClass"
    :role="isClickable ? 'link' : undefined"
    :tabindex="isClickable ? 0 : undefined"
    @click="openModule"
    @keydown.enter.prevent="openModule"
    @keydown.space.prevent="openModule"
  >
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
      </header>

      <div v-if="showEnrollKey && module.enrollKey" class="mt-4 flex items-center justify-between gap-2 rounded-2xl border-2 border-ink bg-cloud px-4 py-3">
        <div class="min-w-0">
          <p class="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink/60">Enroll Key</p>
          <p class="mt-1 truncate font-mono text-sm font-extrabold text-ink">{{ module.enrollKey }}</p>
        </div>
        <button
          type="button"
          class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-xs font-extrabold shadow-ink-sm"
          @click.stop="copyEnrollKey"
        >
          {{ copied ? 'Copied' : 'Copy' }}
        </button>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <span class="ink-chip bg-paper">{{ safeNum(module.sessions, 3) }} sesi</span>
        <span class="ink-chip bg-paper">{{ safeNum(module.materials, 0) }} materi</span>
        <span class="ink-chip bg-paper">{{ safeNum(module.quizzes, 0) }} kuis</span>
      </div>

    </div>
  </article>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
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

const router = useRouter()

const isClickable = computed(() => Boolean(props.openTo))

const cardClass = computed(() => {
  if (!isClickable.value) return ''
  // Match the previous "Buka" button's press interaction.
  return 'cursor-pointer select-none transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-cloud'
})

function openModule() {
  if (!props.openTo) return
  router.push(props.openTo)
}

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
