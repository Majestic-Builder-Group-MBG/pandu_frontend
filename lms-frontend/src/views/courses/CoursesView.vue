<template>
  <section class="space-y-6">
    <header class="ink-card bg-paper-grid p-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Library</p>
          <h1 class="mt-2 text-2xl font-semibold">Modul</h1>
          <p class="mt-2 text-sm font-semibold text-ink/60">Semua modul yang tersedia untuk pembelajaran.</p>
        </div>

        <div class="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[320px]">
          <label class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Search</label>
          <div class="relative">
            <input v-model.trim="query" class="ink-input pr-11" placeholder="Cari modul..." />
            <div class="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-lg border-2 border-transparent text-ink/60">
              <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                <path
                  d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="ink-chip"
          :class="level === 'all' ? 'bg-accent/60' : 'bg-paper hover:bg-accent/30'"
          @click="level = 'all'"
        >
          All ({{ allModules.length }})
        </button>
        <button
          type="button"
          class="ink-chip"
          :class="level === 'Basic' ? 'bg-accent/60' : 'bg-paper hover:bg-accent/30'"
          @click="level = 'Basic'"
        >
          Basic
        </button>
        <button
          type="button"
          class="ink-chip"
          :class="level === 'Intermediate' ? 'bg-accent/60' : 'bg-paper hover:bg-accent/30'"
          @click="level = 'Intermediate'"
        >
          Intermediate
        </button>
        <button
          type="button"
          class="ink-chip"
          :class="level === 'Advanced' ? 'bg-accent/60' : 'bg-paper hover:bg-accent/30'"
          @click="level = 'Advanced'"
        >
          Advanced
        </button>

        <span class="ml-auto text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">
          Showing {{ filteredModules.length }}
        </span>
      </div>
    </header>

    <div v-if="filteredModules.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <ModuleCard v-for="m in filteredModules" :key="m.id" :module="m" />
    </div>

    <div v-else class="ink-card p-10 text-center">
      <p class="text-sm font-extrabold">Tidak ada modul yang cocok.</p>
      <p class="mt-2 text-sm font-semibold text-ink/60">Coba ganti keyword atau filter level.</p>
      <button
        type="button"
        class="mt-5 rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
        @click="reset()"
      >
        Reset
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

import ModuleCard from '@/components/dashboard/ModuleCard.vue'
import { modules as allModules } from '@/data/modules'

const query = ref('')
const level = ref('all')

const filteredModules = computed(() => {
  const q = query.value.trim().toLowerCase()
  return allModules.filter((m) => {
    const matchesLevel = level.value === 'all' ? true : m.level === level.value
    const matchesQuery = !q ? true : `${m.title} ${m.desc}`.toLowerCase().includes(q)
    return matchesLevel && matchesQuery
  })
})

function reset() {
  query.value = ''
  level.value = 'all'
}
</script>
