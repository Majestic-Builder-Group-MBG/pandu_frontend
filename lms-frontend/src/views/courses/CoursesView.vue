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
        <span class="ink-chip bg-accent/60">All ({{ visibleCount }})</span>

        <div class="ml-auto flex items-center gap-3">
          <button
            v-if="canEnroll"
            type="button"
            class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm hover:bg-accent/20"
            @click="openEnroll = true"
          >
            Enroll dengan Key
          </button>
          <button
            v-if="canCreateModule"
            type="button"
            class="rounded-xl border-2 border-ink bg-accent px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            @click="openCreate = true"
          >
            + Buat Modul
          </button>
          <span class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Showing {{ filteredModules.length }}</span>
        </div>
      </div>
    </header>

    <div v-if="modules.status === 'loading'" class="ink-card p-10 text-center">
      <p class="text-sm font-extrabold">Memuat modul...</p>
    </div>

    <div v-else-if="modules.status === 'error'" class="ink-card p-10 text-center">
      <p class="text-sm font-extrabold">Gagal memuat modul</p>
      <p class="mt-2 text-sm font-semibold text-ink/60">{{ modules.error }}</p>
      <button
        type="button"
        class="mt-5 rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
        @click="reload()"
      >
        Coba lagi
      </button>
    </div>

    <div v-if="filteredModules.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <ModuleCard
        v-for="m in filteredModules"
        :key="m.id"
        :module="m"
        :open-to="`/courses/${m.id}`"
        :show-enroll-key="showEnrollKey"
      />
    </div>

    <div v-else-if="isStudentNoEnrollment" class="ink-card p-10 text-center">
      <p class="text-sm font-extrabold">You are not enrolled in any modules yet.</p>
      <p class="mt-2 text-sm font-semibold text-ink/60">Masukkan enrollment key untuk bergabung ke modul pertama kamu.</p>
      <button
        type="button"
        class="mt-5 rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
        @click="openEnroll = true"
      >
        Enroll
      </button>
    </div>

    <div v-else class="ink-card p-10 text-center">
      <p class="text-sm font-extrabold">No modules match your search/filter.</p>
      <p class="mt-2 text-sm font-semibold text-ink/60">Coba ubah kata kunci pencarian.</p>
      <button
        type="button"
        class="mt-5 rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
        @click="reset()"
      >
        Reset
      </button>
    </div>

    <CreateModuleModal :open="openCreate" @close="openCreate = false" @created="onCreated" />

    <EnrollModal :open="openEnroll" @close="openEnroll = false" @enrolled="onEnrolled" />
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import ModuleCard from '@/components/dashboard/ModuleCard.vue'
import CreateModuleModal from '@/components/modules/CreateModuleModal.vue'
import EnrollModal from '@/components/enroll/EnrollModal.vue'
import { useAuthStore } from '@/stores/auth'
import { useEnrollmentsStore } from '@/stores/enrollments'
import { useModulesStore } from '@/stores/modules'
import { getServices } from '@/services'

const query = ref('')
const modules = useModulesStore()
const enrollments = useEnrollmentsStore()
const services = getServices()
const auth = useAuthStore()
const router = useRouter()

const openCreate = ref(false)
const openEnroll = ref(false)

const canCreateModule = computed(() => {
  const r = auth.user?.role
  return r === 'teacher' || r === 'admin'
})

const canEnroll = computed(() => auth.user?.role === 'student')
const enrolledCount = computed(() => {
  if (auth.user?.role !== 'student') return modules.items.length
  const allowedIds = enrollments.moduleIdSet
  return modules.items.filter((m) => allowedIds.has(Number(m.id))).length
})
const isStudentNoEnrollment = computed(() => auth.user?.role === 'student' && enrolledCount.value === 0)
const visibleCount = computed(() => {
  const isStudent = auth.user?.role === 'student'
  if (!isStudent) return modules.items.length
  return enrolledCount.value
})

const showEnrollKey = computed(() => canCreateModule.value)

const filteredModules = computed(() => {
  const isStudent = auth.user?.role === 'student'
  const allowedIds = enrollments.moduleIdSet

  const source = isStudent
    ? modules.items.filter((m) => allowedIds.has(Number(m.id)))
    : modules.items

  const q = query.value.trim().toLowerCase()
  return source.filter((m) => {
    if (!q) return true
    return `${m.title} ${m.desc} ${m.teacherName || ''}`.toLowerCase().includes(q)
  })
})

function reset() {
  query.value = ''
}

async function reload() {
  try {
    if (auth.user?.role === 'student') {
      await enrollments.fetchMine({ services, force: true })
      await modules.fetchAll({ services, force: true })
      return
    }

    await modules.fetchAll({ services, force: true })
  } catch {
    // handled by UI
  }
}

onMounted(async () => {
  if (!modules.items.length) await reload()
})

function onCreated(newModule) {
  openCreate.value = false
  // After create, go to sessions page
  if (newModule?.id) router.push(`/courses/${newModule.id}`)
}

async function onEnrolled() {
  openEnroll.value = false
  await reload()
}
</script>
