<template>
  <section class="space-y-8">
    <header class="ink-card bg-paper-grid p-6">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div class="min-w-0">
          <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Library</p>
          <h1 class="mt-2 text-2xl font-semibold">Quiz Hub</h1>
          <p class="mt-2 max-w-2xl text-sm font-semibold text-ink/60">
            Pilih modul, lalu pilih sesi untuk membuka kuis. Tombol "Buka/Kelola" hanya muncul jika kuis sudah tersedia.
          </p>
        </div>

        <div class="flex w-full flex-col gap-2 lg:w-auto lg:min-w-[360px]">
          <label class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Search Modul</label>
          <div class="relative">
            <input v-model.trim="query" class="ink-input pr-11" placeholder="Cari modul..." />
            <div class="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-lg border-2 border-transparent text-ink/60">
              <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="currentColor" stroke-width="2" />
                <path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5 flex flex-wrap items-center gap-2">
        <span class="ink-chip bg-accent/60">Modules ({{ filteredModules.length }})</span>
        <span class="ink-chip bg-paper">Sesi: {{ sessions.length }}</span>
        <span class="ink-chip bg-paper">Status: {{ sessionsStatus }}</span>
      </div>
    </header>

    <div class="grid gap-6 lg:grid-cols-[360px_1fr]">
      <aside class="ink-card p-6 lg:sticky lg:top-24 lg:self-start">
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-lg font-semibold">Modul</h2>
          <RouterLink
            to="/courses"
            class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-xs font-extrabold shadow-ink-sm"
            title="Lihat semua modul"
          >
            Courses
          </RouterLink>
        </div>

        <p v-if="modules.status === 'loading'" class="mt-4 text-sm font-semibold text-ink/60">Memuat modul...</p>
        <p v-else-if="modules.status === 'error'" class="mt-4 text-sm font-semibold text-ink/60">
          Gagal memuat modul: <span class="font-extrabold">{{ modules.error }}</span>
        </p>

        <div v-else class="mt-5 flex gap-2 overflow-x-auto pb-2 lg:block lg:max-h-[560px] lg:space-y-2 lg:overflow-auto lg:pb-0 lg:pr-1">
          <button
            v-for="m in filteredModules"
            :key="m.id"
            type="button"
            class="w-[260px] shrink-0 rounded-2xl border-2 border-ink px-4 py-3 text-left shadow-ink-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-cloud sm:w-[300px] lg:w-full"
            :class="selectedModuleId === Number(m.id) ? 'bg-accent/40' : 'bg-paper hover:bg-accent/20'"
            @click="selectModule(m.id)"
          >
            <p class="truncate text-sm font-extrabold">{{ m.title }}</p>
            <p class="mt-1 line-clamp-2 text-xs font-bold text-ink/50">{{ m.desc || ' ' }}</p>
          </button>
        </div>
      </aside>

      <main class="space-y-4">
        <article class="ink-card p-6">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Sesi</p>
              <p class="mt-2 text-base font-extrabold text-ink/80">
                {{ selectedModuleLabel }}
              </p>
            </div>

            <button
              type="button"
              class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
              :disabled="!selectedModuleId || sessionsStatus === 'loading'"
              @click="loadSessions({ force: true })"
            >
              {{ sessionsStatus === 'loading' ? 'Memuat...' : 'Refresh' }}
            </button>
          </div>

          <p v-if="sessionsStatus === 'idle'" class="mt-4 text-sm font-semibold text-ink/60">Pilih modul untuk melihat sesi.</p>
          <p v-else-if="sessionsStatus === 'loading'" class="mt-4 text-sm font-semibold text-ink/60">Memuat sesi...</p>
          <p v-else-if="sessionsStatus === 'error'" class="mt-4 text-sm font-semibold text-ink/60">
            Gagal memuat sesi: <span class="font-extrabold">{{ sessionsError }}</span>
          </p>
        </article>

        <div v-if="sessionsStatus === 'success' && !sessions.length" class="ink-card p-10 text-center">
          <p class="text-sm font-extrabold">Belum ada sesi.</p>
          <p class="mt-2 text-sm font-semibold text-ink/60">Buat sesi dulu di halaman course.</p>
        </div>

        <div v-else-if="sessionsStatus === 'success'" class="grid gap-4">
          <article
            v-for="s in sessions"
            :key="s.id"
            class="rounded-2xl border-2 border-ink bg-paper p-5 shadow-ink-sm transition hover:bg-accent/10"
          >
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div class="min-w-0">
                <p class="text-base font-extrabold">{{ s.title }}</p>
                <p v-if="s.description" class="mt-1 line-clamp-2 text-sm font-semibold text-ink/60">{{ s.description }}</p>

                <p v-if="sessionsMetaStatusById[s.id] === 'loading'" class="mt-3 inline-flex rounded-full bg-cloud px-3 py-1 text-xs font-extrabold text-ink/60">
                  Mengecek ketersediaan kuis...
                </p>

                <p v-else-if="sessionsMetaById[s.id]?.reason" class="mt-3 inline-flex rounded-full bg-cloud px-3 py-1 text-xs font-extrabold text-ink/60">
                  {{ sessionsMetaById[s.id].reason }}
                </p>
              </div>

              <RouterLink
                v-if="canOpenQuizFromHub(s.id)"
                :to="`/courses/${selectedModuleId}/sessions/${s.id}/quiz`"
                class="shrink-0 rounded-xl border-2 border-ink bg-accent px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                {{ canManage ? 'Kelola Quiz' : 'Buka Quiz' }}
              </RouterLink>
            </div>
          </article>
        </div>
      </main>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

import { getServices } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useEnrollmentsStore } from '@/stores/enrollments'
import { useModulesStore } from '@/stores/modules'
import { normalizeListResponse } from '@/services/mappers/list'

const services = getServices()
const auth = useAuthStore()
const enrollments = useEnrollmentsStore()
const modules = useModulesStore()

const canManage = computed(() => auth.user?.role === 'admin' || auth.user?.role === 'teacher')
const isStudent = computed(() => auth.user?.role === 'student')

const query = ref('')
const selectedModuleId = ref(null)

const filteredModules = computed(() => {
  const allowedIds = enrollments.moduleIdSet
  const source = isStudent.value
    ? modules.items.filter((m) => allowedIds.has(Number(m.id)))
    : modules.items

  const q = query.value.trim().toLowerCase()
  if (!q) return source

  return source.filter((m) => `${m.title} ${m.desc} ${m.teacherName || ''}`.toLowerCase().includes(q))
})

const selectedModuleLabel = computed(() => {
  if (!selectedModuleId.value) return 'Pilih modul dari daftar.'
  const m = modules.getById(selectedModuleId.value)
  return m?.title ? `Modul: ${m.title}` : `Modul #${selectedModuleId.value}`
})

const sessionsStatus = ref('idle')
const sessionsError = ref('')
const sessions = ref([])

// Per-session availability used by the Quiz hub. We only show the "Kelola/Buka" button
// once the session has an open schedule AND the quiz already exists.
const sessionsMetaById = ref({})
const sessionsMetaStatusById = ref({})

function mapSession(s) {
  return {
    id: s?.id,
    title: s?.title || `Sesi ${s?.sort_order || ''}`.trim(),
    description: s?.description || '',
    sortOrder: typeof s?.sort_order === 'number' ? s.sort_order : typeof s?.sortOrder === 'number' ? s.sortOrder : 999,
  }
}

async function loadBase() {
  if (isStudent.value && !enrollments.items.length) {
    try {
      await enrollments.fetchMine({ services, force: true })
    } catch {
      // ignore
    }
  }

  if (!modules.items.length) {
    try {
      await modules.fetchAll({ services, force: true })
    } catch {
      // handled by module store state
    }
  }
}

function selectModule(id) {
  const n = Number(id)
  if (!Number.isFinite(n) || n <= 0) return
  selectedModuleId.value = n
}

async function loadSessions({ force = false } = {}) {
  if (!selectedModuleId.value) return
  sessionsStatus.value = 'loading'
  sessionsError.value = ''
  try {
    const res = await services.sessions.list(selectedModuleId.value)
    const list = normalizeListResponse(res)
    sessions.value = list.map(mapSession).sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999))
    sessionsStatus.value = 'success'

    // Hydrate availability for current module sessions.
    await hydrateSessionsMeta()
  } catch (e) {
    sessionsStatus.value = 'error'
    sessionsError.value = e?.message || 'Gagal memuat sesi'
  }
}

function clearSessionMeta() {
  sessionsMetaById.value = {}
  sessionsMetaStatusById.value = {}
}

function setSessionMeta(sessionId, meta) {
  sessionsMetaById.value = { ...sessionsMetaById.value, [sessionId]: meta }
}

function setSessionMetaStatus(sessionId, status) {
  sessionsMetaStatusById.value = { ...sessionsMetaStatusById.value, [sessionId]: status }
}

async function hydrateSessionsMeta() {
  if (!selectedModuleId.value) return
  const moduleId = selectedModuleId.value
  const ids = sessions.value.map((s) => s.id).filter(Boolean)
  if (!ids.length) return

  await Promise.all(
    ids.map(async (sessionId) => {
      setSessionMetaStatus(sessionId, 'loading')

      // 1) Session must have schedule open_at set.
      let openAt = null
      try {
        const res = await services.sessions.getSchedule(moduleId, sessionId)
        openAt = res?.data?.open_at || res?.data?.openAt || res?.open_at || res?.openAt || null
      } catch {
        openAt = null
      }

      if (!openAt) {
        setSessionMeta(sessionId, { ok: false, reason: 'Sesi belum dibuka (jadwal open_at belum diset).' })
        setSessionMetaStatus(sessionId, 'success')
        return
      }

      // 2) Quiz must exist. If backend returns 404 (not created) or 403 (not visible for student), hide.
      try {
        const res = await services.quizzes.getQuiz(moduleId, sessionId)
        const data = res?.data || res || {}
        const isPublished = Boolean(data?.is_published ?? data?.isPublished)

        // Student: still require published.
        if (!canManage.value && !isPublished) {
          setSessionMeta(sessionId, { ok: false, reason: 'Quiz belum dipublish.' })
          setSessionMetaStatus(sessionId, 'success')
          return
        }

        setSessionMeta(sessionId, { ok: true })
        setSessionMetaStatus(sessionId, 'success')
      } catch (e) {
        const status = e?.status
        if (status === 404) {
          setSessionMeta(sessionId, { ok: false, reason: 'Quiz belum dibuat.' })
        } else if (status === 403) {
          setSessionMeta(sessionId, { ok: false, reason: 'Quiz belum tersedia.' })
        } else {
          setSessionMeta(sessionId, { ok: false, reason: 'Gagal mengecek quiz.' })
        }
        setSessionMetaStatus(sessionId, 'success')
      }
    })
  )
}

function canOpenQuizFromHub(sessionId) {
  const meta = sessionsMetaById.value?.[sessionId]
  return Boolean(meta?.ok)
}

onMounted(async () => {
  await loadBase()

  if (!selectedModuleId.value && filteredModules.value.length) {
    selectedModuleId.value = Number(filteredModules.value[0].id)
  }

  if (selectedModuleId.value) await loadSessions()
})

watch(
  () => filteredModules.value.map((m) => Number(m.id)).join(','),
  async () => {
    if (selectedModuleId.value && filteredModules.value.some((m) => Number(m.id) === selectedModuleId.value)) return
    selectedModuleId.value = filteredModules.value.length ? Number(filteredModules.value[0].id) : null
    sessions.value = []
    sessionsStatus.value = selectedModuleId.value ? 'loading' : 'idle'
    sessionsError.value = ''
    if (selectedModuleId.value) await loadSessions({ force: true })
  }
)

watch(selectedModuleId, async () => {
  sessions.value = []
  sessionsStatus.value = selectedModuleId.value ? 'loading' : 'idle'
  sessionsError.value = ''
  clearSessionMeta()
  if (selectedModuleId.value) await loadSessions({ force: true })
})
</script>
