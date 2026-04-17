<template>
  <section class="space-y-6">
    <header class="ink-card overflow-hidden">
      <div class="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_360px]">
        <div class="p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Module</p>
              <h1 class="mt-2 truncate text-2xl font-semibold">{{ moduleTitle }}</h1>
              <p class="mt-2 line-clamp-2 text-sm font-semibold text-ink/60">{{ moduleDesc }}</p>
              <p v-if="moduleTeacher" class="mt-3 text-xs font-bold text-ink/50">by {{ moduleTeacher }}</p>
              <div v-if="showEnrollKey && enrollKey" class="mt-4 flex flex-wrap items-center gap-2">
                <span class="ink-chip bg-accent/60">Enroll Key</span>
                <span class="rounded-xl border-2 border-ink bg-cloud px-3 py-2 font-mono text-xs font-extrabold text-ink">{{ enrollKey }}</span>
                <button
                  type="button"
                  class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-xs font-extrabold shadow-ink-sm"
                  @click="copyKey"
                >
                  {{ keyCopied ? 'Copied' : 'Copy' }}
                </button>
              </div>
            </div>

            <RouterLink
              to="/courses"
              class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              Back
            </RouterLink>
          </div>
        </div>

        <div class="border-t-2 border-ink bg-cloud lg:border-l-2 lg:border-t-0">
          <div class="aspect-[16/9] w-full">
            <img :src="bannerSrc" alt="Module banner" class="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </header>

    <div class="grid gap-6 lg:grid-cols-[360px_1fr]">
      <aside class="space-y-4">
        <div class="ink-card p-6">
          <div class="flex items-center justify-between gap-4">
            <h2 class="text-lg font-semibold">Sesi</h2>
            <span class="ink-chip bg-accent/40">{{ sessions.length }}</span>
          </div>

          <p v-if="sessionsStatus === 'loading'" class="mt-4 text-sm font-semibold text-ink/60">Memuat sesi...</p>
          <p v-else-if="sessionsStatus === 'error'" class="mt-4 text-sm font-semibold text-ink/60">
            Gagal memuat sesi: <span class="font-extrabold">{{ sessionsError }}</span>
          </p>

          <div v-else class="mt-5 space-y-3">
            <SessionItem
              v-for="s in sessions"
              :key="s.id"
              :session="s"
              :selected="selectedSessionId === s.id"
              :can-manage="canManageSessions"
              @select="selectSession(s.id)"
              @edit="openEdit(s)"
              @delete="openDelete(s)"
            />
          </div>
        </div>

        <div class="ink-card p-6">
          <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Tips</p>
          <p class="mt-2 text-sm font-semibold text-ink/70">Klik sesi untuk melihat materi. Konten bisa berupa file, link, atau teks ringkasan.</p>
        </div>
      </aside>

      <main class="space-y-4">
        <div class="ink-card p-6">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Selected session</p>
              <h2 class="mt-2 text-xl font-semibold">{{ selectedSessionTitle }}</h2>
              <p class="mt-2 text-sm font-semibold text-ink/60">{{ selectedSessionDesc }}</p>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
                @click="reloadSelectedContents()"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div class="ink-card p-6">
          <div class="flex items-center justify-between gap-4">
            <h3 class="text-lg font-semibold">Konten</h3>
            <span class="ink-chip bg-accent/40">{{ contents.length }}</span>
          </div>

          <p v-if="contentsStatus === 'idle'" class="mt-4 text-sm font-semibold text-ink/60">Pilih sesi untuk melihat konten.</p>
          <p v-else-if="contentsStatus === 'loading'" class="mt-4 text-sm font-semibold text-ink/60">Memuat konten...</p>
          <p v-else-if="contentsStatus === 'error'" class="mt-4 text-sm font-semibold text-ink/60">
            Gagal memuat konten: <span class="font-extrabold">{{ contentsError }}</span>
          </p>

          <div v-else-if="!contents.length" class="mt-5 rounded-2xl border-2 border-ink bg-paper p-6 text-center shadow-ink-sm">
            <p class="text-sm font-extrabold">Belum ada konten.</p>
            <p class="mt-2 text-sm font-semibold text-ink/60">Konten bisa berupa file, URL, atau teks ringkasan.</p>
          </div>

          <div v-else class="mt-5 space-y-3">
            <article v-for="c in contents" :key="c.id" class="rounded-2xl border-2 border-ink bg-paper p-5 shadow-ink-sm">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">{{ c.typeLabel }}</p>
                  <p class="mt-2 truncate text-sm font-extrabold">{{ c.title }}</p>
                </div>
                <span class="ink-chip bg-accent/40">{{ c.type }}</span>
              </div>

              <div class="mt-3">
                <p v-if="c.type === 'text'" class="whitespace-pre-wrap text-sm font-semibold text-ink/70">{{ c.text }}</p>

                <a
                  v-else-if="c.type === 'url'"
                  :href="c.url"
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm hover:bg-accent/20"
                >
                  Buka Link
                  <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
                    <path d="M14 3h7v7" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <path d="M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  </svg>
                </a>

                <div v-else-if="c.type === 'file'" class="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm hover:bg-accent/20"
                    @click="downloadFile(c)"
                    :disabled="downloadStatusById[c.id] === 'loading'"
                  >
                    {{ downloadStatusById[c.id] === 'loading' ? 'Downloading...' : 'Download File' }}
                  </button>
                  <span class="text-xs font-bold text-ink/50">{{ c.fileName }}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>
    </div>

    <EditSessionModal
      :open="editOpen"
      :module-id="moduleId"
      :session="editSession"
      @close="closeEdit"
      @saved="onSessionSaved"
    />

    <ConfirmDialog
      :open="deleteOpen"
      title="Hapus Sesi"
      kicker="Danger"
      :message="deleteMessage"
      confirm-text="Ya, hapus"
      :is-loading="deleteLoading"
      @cancel="closeDelete"
      @confirm="confirmDelete"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import defaultBanner from '@/assets/images/module-banner-default.svg'
import { createServices } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useModulesStore } from '@/stores/modules'
import { useModuleBannersStore } from '@/stores/moduleBanners'
import SessionItem from '@/components/sessions/SessionItem.vue'
import EditSessionModal from '@/components/sessions/EditSessionModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const route = useRoute()
const services = createServices()

const auth = useAuthStore()

const modules = useModulesStore()
const banners = useModuleBannersStore()

const moduleId = computed(() => Number(route.params.moduleId))

const sessions = ref([])
const sessionsStatus = ref('idle')
const sessionsError = ref('')

const selectedSessionId = ref(null)

const canManageSessions = computed(() => {
  const r = auth.user?.role
  return r === 'teacher' || r === 'admin'
})

const editOpen = ref(false)
const editSession = ref(null)

const deleteOpen = ref(false)
const deleteSession = ref(null)
const deleteLoading = ref(false)

const contents = ref([])
const contentsStatus = ref('idle')
const contentsError = ref('')

const downloadStatusById = ref({})

const moduleItem = computed(() => modules.items.find((m) => Number(m.id) === moduleId.value))

const moduleTitle = computed(() => moduleItem.value?.title || `Module #${moduleId.value}`)
const moduleDesc = computed(() => moduleItem.value?.desc || ' ')
const moduleTeacher = computed(() => moduleItem.value?.teacherName || '')

const showEnrollKey = computed(() => {
  const r = auth.user?.role
  return r === 'teacher' || r === 'admin'
})

const enrollKey = ref('')
const keyCopied = ref(false)

const bannerSrc = computed(() => {
  const cached = banners.urlsById[moduleId.value]
  if (cached) return cached
  return defaultBanner
})

const selectedSession = computed(() => sessions.value.find((s) => s.id === selectedSessionId.value) || null)
const selectedSessionTitle = computed(() => selectedSession.value?.title || 'Pilih sesi')
const selectedSessionDesc = computed(() => selectedSession.value?.description || ' ')

onMounted(async () => {
  // Ensure modules list exists so title/teacher show.
  if (!modules.items.length) {
    try {
      await modules.fetchAll({ services })
    } catch {
      // ignore; sessions still can be fetched
    }
  }

  await loadSessions()
  await ensureModuleBanner()
  await ensureEnrollKey()
})

watch(moduleId, async () => {
  selectedSessionId.value = null
  contents.value = []
  contentsStatus.value = 'idle'
  await loadSessions()
  await ensureModuleBanner()
  await ensureEnrollKey()
})

async function ensureModuleBanner() {
  const m = moduleItem.value
  if (!m?.bannerDownloadUrl) return
  await banners.ensureBanner({ moduleId: moduleId.value, bannerPath: m.bannerDownloadUrl, services })
}

async function ensureEnrollKey() {
  if (!showEnrollKey.value) {
    enrollKey.value = ''
    return
  }

  const m = moduleItem.value
  if (m?.enrollKey) {
    enrollKey.value = m.enrollKey
    return
  }

  try {
    const res = await services.modules.getById(moduleId.value)
    const data = res?.data || res
    if (data?.enroll_key) enrollKey.value = data.enroll_key
  } catch {
    // ignore
  }
}

async function copyKey() {
  keyCopied.value = false
  if (!enrollKey.value) return
  try {
    await navigator.clipboard.writeText(String(enrollKey.value))
    keyCopied.value = true
    setTimeout(() => {
      keyCopied.value = false
    }, 1200)
  } catch {
    // ignore
  }
}

async function loadSessions() {
  sessionsStatus.value = 'loading'
  sessionsError.value = ''
  try {
    const res = await services.sessions.list(moduleId.value)
    const list = normalizeListResponse(res)
    sessions.value = list
      .map(mapSession)
      .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999))

    sessionsStatus.value = 'success'
    if (!selectedSessionId.value && sessions.value.length) {
      selectSession(sessions.value[0].id)
    }
  } catch (e) {
    sessionsStatus.value = 'error'
    sessionsError.value = e?.message || 'Gagal memuat sesi'
  }
}

function selectSession(id) {
  selectedSessionId.value = id
}

function openEdit(s) {
  editSession.value = s
  editOpen.value = true
}

function closeEdit() {
  editOpen.value = false
  editSession.value = null
}

async function onSessionSaved() {
  // refresh list + current contents
  await loadSessions()
  if (selectedSessionId.value) await loadContents(selectedSessionId.value)
  closeEdit()
}

const deleteMessage = computed(() => {
  const t = deleteSession.value?.title || 'sesi ini'
  return `Kamu yakin mau menghapus ${t}? Tindakan ini tidak bisa dibatalkan.`
})

function openDelete(s) {
  deleteSession.value = s
  deleteOpen.value = true
}

function closeDelete() {
  deleteOpen.value = false
  deleteSession.value = null
  deleteLoading.value = false
}

async function confirmDelete() {
  if (!deleteSession.value?.id) return
  deleteLoading.value = true
  try {
    await services.sessions.delete(moduleId.value, deleteSession.value.id)
    // Refresh sessions list
    await loadSessions()
    // Ensure selection is valid
    if (selectedSessionId.value === deleteSession.value.id) {
      selectedSessionId.value = sessions.value[0]?.id || null
    }
  } catch (e) {
    // surface error in main content area
    contentsError.value = e?.message || 'Gagal menghapus sesi'
  } finally {
    closeDelete()
  }
}

watch(selectedSessionId, async () => {
  if (!selectedSessionId.value) return
  await loadContents(selectedSessionId.value)
})

async function reloadSelectedContents() {
  if (!selectedSessionId.value) return
  await loadContents(selectedSessionId.value, { force: true })
}

async function loadContents(sessionId) {
  contentsStatus.value = 'loading'
  contentsError.value = ''
  try {
    const res = await services.sessions.listContents(moduleId.value, sessionId)
    const list = normalizeListResponse(res)
    contents.value = list.map(mapContent)
    contentsStatus.value = 'success'
  } catch (e) {
    contentsStatus.value = 'error'
    contentsError.value = e?.message || 'Gagal memuat konten'
  }
}

async function downloadFile(content) {
  const contentId = content?.id
  if (!contentId || !selectedSessionId.value) return

  downloadStatusById.value = { ...downloadStatusById.value, [contentId]: 'loading' }
  try {
    const blob = await services.sessions.downloadContentFile(moduleId.value, selectedSessionId.value, contentId)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = content.fileName || `content-${contentId}`
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } catch (e) {
    contentsError.value = e?.message || 'Gagal download file'
  } finally {
    downloadStatusById.value = { ...downloadStatusById.value, [contentId]: 'idle' }
  }
}

function normalizeListResponse(res) {
  if (Array.isArray(res)) return res
  if (res && typeof res === 'object') {
    if (Array.isArray(res.data)) return res.data
    if (res.data && Array.isArray(res.data.sessions)) return res.data.sessions
    if (res.data && Array.isArray(res.data.contents)) return res.data.contents
  }
  return []
}

function mapSession(s) {
  return {
    id: s?.id,
    title: s?.title || `Sesi ${s?.sort_order || ''}`.trim(),
    description: s?.description || '',
    sortOrder: typeof s?.sort_order === 'number' ? s.sort_order : typeof s?.sortOrder === 'number' ? s.sortOrder : 999,
  }
}

function mapContent(c) {
  const type = c?.content_type || c?.type || 'text'
  const title = c?.title || (type === 'file' ? 'File' : type === 'url' ? 'Link' : 'Text')

  return {
    id: c?.id,
    type,
    typeLabel: type === 'file' ? 'File' : type === 'url' ? 'URL' : 'Text',
    title,
    url: c?.url || '',
    text: c?.text_content || c?.text || '',
    fileName: c?.file_name || c?.filename || c?.original_name || 'file',
  }
}
</script>
