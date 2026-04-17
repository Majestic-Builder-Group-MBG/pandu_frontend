<template>
  <article class="ink-card overflow-hidden">
    <div class="relative">
      <div class="aspect-[16/9] w-full border-b-2 border-ink bg-cloud">
        <img :src="bannerSrc" alt="Module banner" class="h-full w-full object-cover" />
      </div>

      <div class="absolute left-4 top-4 flex items-center gap-2">
        <span class="ink-chip bg-accent/60">{{ module.level }}</span>
        <span v-if="!hasCustomBanner" class="ink-chip bg-paper">Default banner</span>
      </div>
    </div>

    <div class="p-5">
      <header class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/50">Module</p>
          <h3 class="mt-2 truncate text-base font-semibold">{{ module.title }}</h3>
          <p class="mt-1 line-clamp-2 text-sm font-semibold text-ink/60">{{ module.desc }}</p>
        </div>
        <div class="grid h-10 w-10 place-items-center rounded-2xl border-2 border-ink bg-paper shadow-ink-sm" aria-label="Module">
          <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
            <path d="M4 6.5L12 3l8 3.5-8 3.5-8-3.5Z" stroke="currentColor" stroke-width="2" />
            <path d="M4 10.5l8 3.5 8-3.5" stroke="currentColor" stroke-width="2" />
          </svg>
        </div>
      </header>

      <div class="mt-4 flex flex-wrap gap-2">
        <span class="ink-chip bg-paper">{{ module.sessions }} sesi</span>
        <span class="ink-chip bg-paper">{{ module.materials }} materi</span>
        <span class="ink-chip bg-paper">{{ module.quizzes }} kuis</span>
      </div>

      <div class="mt-5 flex items-center justify-between">
        <button class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
          Buka
        </button>
        <button class="rounded-xl border-2 border-transparent px-3 py-2 text-sm font-bold text-ink/70 hover:border-ink hover:bg-accent/30 hover:text-ink">
          Detail
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import defaultBanner from '@/assets/images/module-banner-default.svg'

const props = defineProps({
  module: {
    type: Object,
    required: true,
  },
})

const hasCustomBanner = computed(() => {
  return Boolean(props.module?.bannerUrl || props.module?.banner)
})

const bannerSrc = computed(() => {
  return props.module?.bannerUrl || props.module?.banner || defaultBanner
})
</script>
