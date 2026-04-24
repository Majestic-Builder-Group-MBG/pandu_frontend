<template>
  <div class="grid gap-8 lg:grid-cols-[1fr_360px]">
    <section class="space-y-8">
      <header class="ink-card bg-paper-grid p-6 motion-safe:animate-rise">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Pandu</p>
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

      <div class="grid gap-4 lg:grid-cols-3">
        <StatCard title="Kelas Diampu" :value="classesCount">
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

        <StatCard title="Kursus Aktif" :value="activeCoursesCount" variant="ocean">
           <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
            <path d="M4 6.5L12 3l8 3.5-8 3.5-8-3.5Z" stroke="currentColor" stroke-width="2" />
            <path d="M4 10.5l8 3.5 8-3.5" stroke="currentColor" stroke-width="2" />
            <path d="M4 14.5l8 3.5 8-3.5" stroke="currentColor" stroke-width="2" />
          </svg>
        </StatCard>

        <div class="ink-card p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Quiz Terbaru</p>
              <p class="mt-2 text-4xl font-semibold leading-none">{{ quizzesCount }}</p>
              <p class="mt-2 text-sm font-semibold text-ink/60">{{ quizzesSummaryLabel }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
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

        <div class="ink-card p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Kuis</h2>
          </div>
          <div class="mt-4 space-y-3">
            <RouterLink
              v-for="q in quizzes"
              :key="q.id"
              :to="q.to"
              class="block rounded-2xl bg-paper p-4 shadow-[0_14px_26px_rgba(18,18,18,0.08)] ring-1 ring-ink/10 transition hover:bg-accent/20"
              :title="`Buka quiz: ${q.title}`"
            >
              <p class="text-sm font-extrabold">{{ q.title }}</p>
              <p class="mt-1 text-xs font-bold text-ink/60">{{ q.module }} - {{ q.questions }} soal</p>
            </RouterLink>

            <p v-if="quizzesStatus === 'loading'" class="text-sm font-semibold text-ink/60">Memuat kuis...</p>
            <p v-else-if="quizzesStatus === 'error'" class="text-sm font-semibold text-ink/60">
              Gagal memuat kuis: <span class="font-extrabold">{{ quizzesError }}</span>
            </p>
            <p v-else-if="!quizzes.length" class="text-sm font-semibold text-ink/60">Belum ada kuis.</p>
          </div>
        </div>
      </div>

    </section>

    <aside class="space-y-6 self-start lg:sticky lg:top-24 lg:h-fit">
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

        <div class="mt-5 max-h-[460px] space-y-3 overflow-auto pr-1">
          <div v-if="upcomingStatus === 'loading'" class="text-sm font-semibold text-ink/60">Memuat sesi mendatang...</div>
          <div v-else-if="upcomingStatus === 'error'" class="text-sm font-semibold text-ink/60">
            Gagal memuat sesi mendatang: <span class="font-extrabold">{{ upcomingError }}</span>
          </div>
          <div v-else-if="!sessions.length" class="text-sm font-semibold text-ink/60">Belum ada sesi terjadwal.</div>
          <SessionCard v-else v-for="s in sessions" :key="s.id" :session="s" />
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
const isStudent = computed(() => auth.user?.role === 'student')
const initials = computed(() => {
  const name = String(displayName.value || '').trim()
  if (!name) return 'U'
  const parts = name.split(/\s+/)
  const first = parts[0]?.[0] || 'U'
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
})

const managedModulesCount = computed(() => {
  // Use backend capabilities when available.
  const list = modules.items || []
  const managed = list.filter((m) => Boolean(m?.capabilities?.canManageSessions || m?.capabilities?.canEdit))
  // Fallback: for teacher/admin without capabilities, treat visible modules as managed.
  if (!managed.length && !isStudent.value && list.length) return list.length
  return managed.length
})

const classesCount = computed(() => {
  if (isStudent.value) return enrollments.moduleIds.length
  return managedModulesCount.value
})

const activeCoursesCount = computed(() => {
  if (isStudent.value) return enrollments.moduleIds.length
  return modules.items.length
})

const quizzesCount = computed(() => quizzes.value.length)
const quizzesSummaryLabel = computed(() => {
  if (!quizzesCount.value) return 'Belum ada kuis yang tersedia.'
  if (isStudent.value) return 'Kuis yang siap kamu kerjakan.'
  return 'Kuis yang siap kamu kelola.'
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

  await Promise.all([loadUpcomingSessions(), loadDashboardQuizzes()])
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
    await loadDashboardQuizzes({ force: true })
  } catch (e) {
    dashboardEnrollError.value = e?.message || 'Gagal enroll'
  } finally {
    dashboardEnrollLoading.value = false
  }
}

function pickList(res) {
  return normalizeListResponse(res)
}

async function mapWithConcurrency(items, limit, fn) {
  const queue = [...items]
  const workers = Array.from({ length: Math.max(1, Number(limit) || 1) }, async () => {
    while (queue.length) {
      const item = queue.shift()
      // eslint-disable-next-line no-await-in-loop
      await fn(item)
    }
  })
  await Promise.all(workers)
}

async function loadDashboardQuizzes({ force = false } = {}) {
  // Best-effort dashboard list: find existing quizzes across accessible modules.
  if (!force && quizzes.value.length) return

  quizzesStatus.value = 'loading'
  quizzesError.value = ''
  quizzes.value = []

  try {
    const isStudent = auth.user?.role === 'student'

    const accessibleModules = isStudent
      ? modules.items.filter((m) => enrollments.moduleIdSet.has(Number(m.id)))
      : modules.items

    // Avoid too many calls on large datasets.
    const moduleIds = accessibleModules
      .map((m) => Number(m.id))
      .filter((id) => Number.isFinite(id) && id > 0)
      .slice(0, 12)

    const sessionPairs = []

    await mapWithConcurrency(moduleIds, 4, async (mid) => {
      try {
        const res = await services.sessions.list(mid)
        const list = pickList(res)
        for (const s of list) {
          const sid = Number(s?.id)
          if (!Number.isFinite(sid) || sid <= 0) continue
          const hasQuiz = Boolean(s?.has_quiz ?? s?.hasQuiz ?? s?.quiz?.exists)
          if (!hasQuiz) continue

          const quizIsPublished = Boolean(s?.quiz?.is_published ?? s?.quiz?.isPublished)
          if (isStudent && !quizIsPublished) continue

          sessionPairs.push({ moduleId: mid, sessionId: sid })
        }
      } catch {
        // ignore
      }
    })

    const found = []
    await mapWithConcurrency(sessionPairs.slice(0, 80), 6, async ({ moduleId, sessionId }) => {
      try {
        const res = await services.quizzes.getQuiz(moduleId, sessionId)
        const data = res?.data || res
        if (res?.success === false) return

        const isPublished = Boolean(data?.is_published ?? data?.isPublished)
        // Dashboard hanya menampilkan kuis yang sudah dipublish.
        if (!isPublished) return

        const qs = Array.isArray(data?.questions)
          ? data.questions
          : Array.isArray(data?.data?.questions)
            ? data.data.questions
            : []

        found.push({
          id: `${moduleId}-${sessionId}`,
          moduleId,
          sessionId,
          title: data?.title || `Quiz Sesi #${sessionId}`,
          module: modules.getById(moduleId)?.title || `Modul #${moduleId}`,
          questions: qs.length,
          to: `/courses/${moduleId}/sessions/${sessionId}/quiz`,
        })
      } catch (e) {
        // 404 = quiz belum dibuat, 403 = student belum boleh lihat
        if (e?.status === 404 || e?.status === 403) return
      }
    })

    found.sort((a, b) => (b.sessionId || 0) - (a.sessionId || 0))
    quizzes.value = found.slice(0, 6)
    quizzesStatus.value = 'success'
  } catch (e) {
    quizzesStatus.value = 'error'
    quizzesError.value = e?.message || 'Gagal memuat kuis'
  }
}

const quizzes = ref([
  // hydrated from API
])

const quizzesStatus = ref('idle')
const quizzesError = ref('')

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
