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

        <div v-if="isStudentNoEnrollment" class="mt-5 rounded-2xl border-2 border-ink bg-cloud p-5 shadow-ink-sm">
          <p class="text-sm font-extrabold">You are not enrolled in any modules yet.</p>
          <p class="mt-2 text-sm font-semibold text-ink/60">Masukkan enrollment key untuk mulai belajar dari dashboard.</p>

          <div class="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              v-model.trim="dashboardEnrollKey"
              class="ink-input"
              placeholder="Enter enrollment key"
              :disabled="dashboardEnrollLoading"
            />
            <button
              type="button"
              class="rounded-xl border-2 border-ink bg-accent px-4 py-2 text-sm font-extrabold shadow-ink-sm"
              :disabled="dashboardEnrollLoading || !dashboardEnrollKey"
              @click="enrollFromDashboard"
            >
              {{ dashboardEnrollLoading ? 'Memproses...' : 'Enroll' }}
            </button>
          </div>

          <p v-if="dashboardEnrollError" class="mt-3 text-xs font-bold text-rose-700">{{ dashboardEnrollError }}</p>
          <p v-if="dashboardEnrollSuccess" class="mt-3 text-xs font-bold text-emerald-700">{{ dashboardEnrollSuccess }}</p>
        </div>

        <div v-else class="mt-5 grid gap-4 md:grid-cols-2">
          <ModuleCard v-for="m in visibleModules" :key="m.id" :module="m" :open-to="`/courses/${m.id}`" />
        </div>

        <div v-if="modules.status === 'loading'" class="mt-4 text-sm font-semibold text-ink/60">Memuat modul...</div>
        <div v-else-if="modules.status === 'error'" class="mt-4 text-sm font-semibold text-ink/60">
          Gagal memuat modul: <span class="font-extrabold">{{ modules.error }}</span>
        </div>
      </div>

      <div class="gap-4">

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
import MiniCalendar from '@/components/dashboard/MiniCalendar.vue'
import { useEnrollmentsStore } from '@/stores/enrollments'
import { useModulesStore } from '@/stores/modules'
import { getServices } from '@/services'
import { normalizeListResponse } from '@/services/mappers/list'

const auth = useAuthStore()
const enrollments = useEnrollmentsStore()
const modules = useModulesStore()
const services = getServices()

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

const dashboardEnrollKey = ref('')
const dashboardEnrollLoading = ref(false)
const dashboardEnrollError = ref('')
const dashboardEnrollSuccess = ref('')

const visibleModules = computed(() => {
  const isStudent = auth.user?.role === 'student'
  const source = isStudent
    ? modules.items.filter((m) => enrollments.moduleIdSet.has(Number(m.id)))
    : modules.items
  return source.slice(0, 4)
})
const isStudentNoEnrollment = computed(() => auth.user?.role === 'student' && enrollments.moduleIds.length === 0)

onMounted(async () => {
  try {
    if (auth.user?.role === 'student') {
      await enrollments.fetchMine({ services, force: true })
    }
    await modules.fetchAll({ services })
  } catch {
    // error shown in UI
  }

  await loadUpcomingSessions()
})

async function enrollFromDashboard() {
  if (auth.user?.role !== 'student') return
  const key = dashboardEnrollKey.value.trim()
  if (!key) return

  dashboardEnrollError.value = ''
  dashboardEnrollSuccess.value = ''
  dashboardEnrollLoading.value = true
  try {
    await services.enrollments.enroll({ enroll_key: key })
    dashboardEnrollSuccess.value = 'Berhasil enroll. Modul kamu sudah diperbarui.'
    dashboardEnrollKey.value = ''
    await enrollments.fetchMine({ services, force: true })
    await modules.fetchAll({ services, force: true })
  } catch (e) {
    dashboardEnrollError.value = e?.message || 'Gagal enroll'
  } finally {
    dashboardEnrollLoading.value = false
  }
}

const quizzes = ref([
  { id: 1, title: 'Quiz 1 - Dasar Matrix', module: 'Aljabar Linear Matrix', questions: 10 },
  { id: 2, title: 'Quiz 2 - Semantik', module: 'Semantik Tingkat Lanjut', questions: 8 },
  { id: 3, title: 'Quiz 1 - Visual', module: 'Logik Visual 101', questions: 12 },
])

const upcomingStatus = ref('idle')
const upcomingError = ref('')
const sessions = ref([])

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

async function loadUpcomingSessions() {
  upcomingStatus.value = 'loading'
  upcomingError.value = ''
  sessions.value = []

  try {
    const now = Date.now()
    const res = await services.dashboard.upcomingSessions({ page: 1, perPage: 12 })
    const list = normalizeListResponse(res)

    const upcoming = list
      .map((s) => {
        const moduleId = s?.module_id || s?.moduleId || null
        const sessionId = s?.session_id || s?.sessionId || null
        const openAt = s?.open_at || s?.openAt || null
        if (!moduleId || !sessionId || !openAt) return null

        const d = new Date(openAt)
        if (Number.isNaN(d.getTime())) return null
        if (d.getTime() <= now) return null

        const canView = Boolean(s?.capabilities?.can_view ?? true)
        return {
          id: `${moduleId}-${sessionId}`,
          moduleId,
          sessionId,
          title: s?.title || `Sesi #${sessionId}`,
          subtitle: `${s?.module_name || s?.moduleName || 'Modul'} - ${formatTime(d)}`,
          startAt: d.toISOString(),
          canOpen: canView,
        }
      })
      .filter(Boolean)

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

</script>
