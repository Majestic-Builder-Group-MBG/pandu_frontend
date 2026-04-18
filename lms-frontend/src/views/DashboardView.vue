<template>
  <div class="grid gap-6 lg:grid-cols-[1fr_360px]">
    <section class="space-y-6">
      <header class="ink-card bg-paper-grid p-6 motion-safe:animate-rise">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Scholarly</p>
            <h1 class="mt-2 text-2xl font-semibold leading-tight">
              <span class="text-ink/60">Selamat datang,</span><br />
              <span class="underline decoration-accent decoration-[10px] underline-offset-[6px]">{{ displayName }}</span>
            </h1>
            <p class="mt-2 text-sm font-semibold text-ink/60">Role: {{ roleLabel }}</p>
          </div>
          <div class="grid h-12 w-12 place-items-center rounded-2xl border-2 border-ink bg-paper shadow-ink-sm">
            <span class="text-sm font-extrabold">{{ initials }}</span>
          </div>
        </div>
      </header>

      <div class="grid gap-4 sm:grid-cols-2">
        <StatCard title="Kelas Diampu" :value="stats.classes">
          <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
            <path
              d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3Z"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              d="M8 11c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3Z"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              d="M3.5 19c.4-2.3 2.3-4 4.7-4h.6c2.4 0 4.3 1.7 4.7 4"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M14 19c.3-2 1.9-3.5 4-3.8"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </StatCard>

        <StatCard title="Kursus Aktif" :value="stats.activeCourses" variant="ocean">
          <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
            <path d="M4 6.5L12 3l8 3.5-8 3.5-8-3.5Z" stroke="currentColor" stroke-width="2" />
            <path d="M4 10.5l8 3.5 8-3.5" stroke="currentColor" stroke-width="2" />
            <path d="M4 14.5l8 3.5 8-3.5" stroke="currentColor" stroke-width="2" />
          </svg>
        </StatCard>
      </div>

      <div class="ink-card p-6">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Quiz Terbaru</p>
            <p class="mt-2 text-4xl font-semibold leading-none">{{ stats.newQuizzes }}</p>
            <p class="mt-2 text-sm font-semibold text-ink/60">Ada kuis yang baru dibuat minggu ini.</p>
          </div>
          <span class="ink-chip bg-accent">NEW</span>
        </div>
      </div>

      <div class="ink-card p-6">
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-lg font-semibold">Modul</h2>
          <RouterLink
            to="/courses"
            class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            View all
          </RouterLink>
        </div>

        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <ModuleCard v-for="m in visibleModules" :key="m.id" :module="m" :open-to="`/courses/${m.id}`" />
        </div>

        <div v-if="modules.status === 'loading'" class="mt-4 text-sm font-semibold text-ink/60">Memuat modul...</div>
        <div v-else-if="modules.status === 'error'" class="mt-4 text-sm font-semibold text-ink/60">
          Gagal memuat modul: <span class="font-extrabold">{{ modules.error }}</span>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="ink-card p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Materi</h2>
            <span class="ink-chip bg-accent/40">{{ materials.length }}</span>
          </div>
          <div class="mt-4 space-y-3">
            <div v-for="item in materials" :key="item.id" class="rounded-2xl border-2 border-ink bg-paper p-4 shadow-ink-sm">
              <p class="text-sm font-extrabold">{{ item.title }}</p>
              <p class="mt-1 text-xs font-bold text-ink/60">{{ item.module }} - {{ item.meta }}</p>
            </div>
          </div>
        </div>

        <div class="ink-card p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Kuis</h2>
            <span class="ink-chip bg-accent/40">{{ quizzes.length }}</span>
          </div>
          <div class="mt-4 space-y-3">
            <div v-for="q in quizzes" :key="q.id" class="rounded-2xl border-2 border-ink bg-paper p-4 shadow-ink-sm">
              <p class="text-sm font-extrabold">{{ q.title }}</p>
              <p class="mt-1 text-xs font-bold text-ink/60">{{ q.module }} - {{ q.questions }} soal</p>
            </div>
          </div>
        </div>
      </div>

      <div class="ink-card p-6">
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-lg font-semibold">Sesi Mendatang</h2>
          <button
            type="button"
            class="rounded-xl border-2 border-transparent px-3 py-2 text-sm font-extrabold text-ink/70 hover:border-ink hover:bg-accent/30 hover:text-ink"
            @click="scrollToCalendar"
          >
            View Calendar
          </button>
        </div>

        <div class="mt-5 space-y-4">
          <div v-if="upcomingStatus === 'loading'" class="text-sm font-semibold text-ink/60">Memuat sesi mendatang...</div>
          <div v-else-if="upcomingStatus === 'error'" class="text-sm font-semibold text-ink/60">
            Gagal memuat sesi mendatang: <span class="font-extrabold">{{ upcomingError }}</span>
          </div>
          <div v-else-if="!sessions.length" class="text-sm font-semibold text-ink/60">Belum ada sesi terjadwal.</div>
          <SessionCard v-else v-for="s in sessions" :key="s.id" :session="s" />
        </div>
      </div>

      <div class="ink-card p-6">
        <h2 class="text-lg font-semibold">Aktivitas Terbaru</h2>
        <div class="mt-5 space-y-4">
          <ActivityItem
            v-for="a in activities"
            :key="a.id"
            :title="a.title"
            :subtitle="a.subtitle"
            :time="a.time"
          >
            <component :is="a.icon" />
          </ActivityItem>
        </div>
      </div>
    </section>

    <aside class="space-y-6">
      <div ref="calendarEl" class="ink-card p-6">
        <MiniCalendar
          :year="calendar.year"
          :month="calendar.month"
          :highlights="calendarHighlights"
          @prev="prevMonth"
          @next="nextMonth"
        />
      </div>

      <div class="ink-card p-6">
        <h3 class="text-base font-semibold">MVP Checklist</h3>
        <div class="mt-4 space-y-3">
          <div class="flex items-center justify-between rounded-2xl border-2 border-ink bg-paper p-4 shadow-ink-sm">
            <p class="text-sm font-extrabold">Modules</p>
            <span class="ink-chip bg-accent/40">OK</span>
          </div>
          <div class="flex items-center justify-between rounded-2xl border-2 border-ink bg-paper p-4 shadow-ink-sm">
            <p class="text-sm font-extrabold">Materi</p>
            <span class="ink-chip bg-accent/40">OK</span>
          </div>
          <div class="flex items-center justify-between rounded-2xl border-2 border-ink bg-paper p-4 shadow-ink-sm">
            <p class="text-sm font-extrabold">Kuis</p>
            <span class="ink-chip bg-accent/40">OK</span>
          </div>
          <div class="flex items-center justify-between rounded-2xl border-2 border-ink bg-paper p-4 shadow-ink-sm">
            <p class="text-sm font-extrabold">Kalender</p>
            <span class="ink-chip bg-accent/40">OK</span>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import StatCard from '@/components/dashboard/StatCard.vue'
import ModuleCard from '@/components/dashboard/ModuleCard.vue'
import SessionCard from '@/components/dashboard/SessionCard.vue'
import ActivityItem from '@/components/dashboard/ActivityItem.vue'
import MiniCalendar from '@/components/dashboard/MiniCalendar.vue'
import { useModulesStore } from '@/stores/modules'
import { createServices } from '@/services'

const auth = useAuthStore()
const modules = useModulesStore()
const services = createServices()

const displayName = computed(() => auth.user?.name || 'User')
const roleLabel = computed(() => auth.user?.role || 'student')
const initials = computed(() => {
  const name = String(displayName.value || '').trim()
  if (!name) return 'U'
  const parts = name.split(/\s+/)
  const first = parts[0]?.[0] || 'U'
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
})

const stats = ref({
  classes: 5,
  activeCourses: 3,
  newQuizzes: 5,
})

const visibleModules = computed(() => modules.items.slice(0, 4))

onMounted(async () => {
  try {
    await modules.fetchAll({ services })
  } catch {
    // error shown in UI
  }

  await loadUpcomingSessions()
})

const materials = ref([
  { id: 1, title: 'Bab 4 - Matriks (Ringkasan)', module: 'Aljabar Linear Matrix', meta: 'PDF - 12 halaman' },
  { id: 2, title: 'Lesson 2 - Konteks & Makna', module: 'Semantik Tingkat Lanjut', meta: 'Video - 18 menit' },
  { id: 3, title: 'Worksheet - Visual Reasoning', module: 'Logik Visual 101', meta: 'Doc - latihan' },
])

const quizzes = ref([
  { id: 1, title: 'Quiz 1 - Dasar Matrix', module: 'Aljabar Linear Matrix', questions: 10 },
  { id: 2, title: 'Quiz 2 - Semantik', module: 'Semantik Tingkat Lanjut', questions: 8 },
  { id: 3, title: 'Quiz 1 - Visual', module: 'Logik Visual 101', questions: 12 },
])

const upcomingStatus = ref('idle')
const upcomingError = ref('')
const sessions = ref([])

const activities = ref([
  {
    id: 1,
    title: 'Quiz Terselesaikan',
    subtitle: "12 murid selesai 'Calculus II'",
    time: '2m lalu',
    icon: {
      template:
        '<svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true"><path d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" stroke="currentColor" stroke-width="2"/><path d="M8 12l2.5 2.5L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
  },
  {
    id: 2,
    title: 'Upload Materi Terbaru',
    subtitle: "Bab 4 - 'Aljabar Linier Matrix'",
    time: '1j lalu',
    icon: {
      template:
        '<svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true"><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2"/><path d="M6 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="2"/><path d="M8 12h8M8 16h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    },
  },
])

const calendarEl = ref(null)
const now = new Date()
const calendar = ref({ year: now.getFullYear(), month: now.getMonth() })

const calendarHighlights = computed(() => {
  const y = calendar.value.year
  const m = calendar.value.month
  return sessions.value
    .map((s) => new Date(s.startAt))
    .filter((d) => d.getFullYear() === y && d.getMonth() === m)
    .map((d) => d.getDate())
})

function prevMonth() {
  const d = new Date(calendar.value.year, calendar.value.month - 1, 1)
  calendar.value = { year: d.getFullYear(), month: d.getMonth() }
}

function nextMonth() {
  const d = new Date(calendar.value.year, calendar.value.month + 1, 1)
  calendar.value = { year: d.getFullYear(), month: d.getMonth() }
}

function scrollToCalendar() {
  calendarEl.value?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
}

function nextDateISO(daysFromNow, hh, mm) {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  d.setHours(hh, mm, 0, 0)
  return d.toISOString()
}

async function loadUpcomingSessions() {
  upcomingStatus.value = 'loading'
  upcomingError.value = ''
  sessions.value = []

  try {
    if (!modules.items.length) {
      await modules.fetchAll({ services, force: true })
    }

    const moduleItems = modules.items
    if (!moduleItems.length) throw new Error('Modul tidak ditemukan')

    // 1) Fetch sessions per module (limited parallelism).
    const sessionsByModule = await mapLimit(moduleItems, 4, async (m) => {
      try {
        const res = await services.sessions.list(m.id)
        const list = normalizeListResponse(res)
        return list.map((s) => ({ module: m, session: s }))
      } catch {
        return []
      }
    })

    const pairs = sessionsByModule.flat()

    // 2) Resolve open_at for each session.
    const now = Date.now()
    const upcoming = []

    await mapLimit(pairs, 8, async ({ module: m, session: s }) => {
      const moduleId = m.id
      const sessionId = s?.id
      if (!moduleId || !sessionId) return

      let openAt = s?.open_at || s?.openAt || null
      if (!openAt) {
        try {
          const res = await services.sessions.getSchedule(moduleId, sessionId)
          openAt = res?.data?.open_at || res?.data?.openAt || res?.open_at || res?.openAt || null
        } catch {
          // If schedule isn't accessible (e.g. 403), skip.
          return
        }
      }

      const d = new Date(openAt)
      if (Number.isNaN(d.getTime())) return
      if (d.getTime() <= now) return

      upcoming.push({
        id: `${moduleId}-${sessionId}`,
        title: s?.title || `Sesi #${sessionId}`,
        subtitle: `${m.title} - ${formatTime(d)}`,
        startAt: d.toISOString(),
      })
    })

    upcoming.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
    sessions.value = upcoming.slice(0, 6)
    upcomingStatus.value = 'success'
  } catch (e) {
    upcomingStatus.value = 'error'
    upcomingError.value = e?.message || 'Gagal memuat jadwal'
  }
}

function formatTime(d) {
  try {
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
}

function normalizeListResponse(res) {
  if (Array.isArray(res)) return res
  if (res && typeof res === 'object') {
    if (Array.isArray(res.data)) return res.data
  }
  return []
}

async function mapLimit(items, limit, worker) {
  const out = new Array(items.length)
  let nextIndex = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const i = nextIndex++
      out[i] = await worker(items[i], i)
    }
  })
  await Promise.all(workers)
  return out
}
</script>
