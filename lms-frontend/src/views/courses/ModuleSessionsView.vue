<template>
  <section class="space-y-6">
    <header class="ink-card relative z-20 overflow-visible">
      <div class="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_360px]">
        <div class="p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Modul</p>
              <h1 class="mt-2 truncate text-2xl font-semibold">{{ moduleTitle }}</h1>
              <p class="mt-2 line-clamp-2 text-sm font-semibold text-ink/60">{{ moduleDesc }}</p>
              <p v-if="moduleTeacher" class="mt-3 text-xs font-bold text-ink/50">by {{ moduleTeacher }}</p>
              <div v-if="showEnrollKey" class="mt-4 space-y-3">
                <div
                  v-if="feedback.message"
                  class="rounded-xl border-2 px-4 py-3 text-sm font-semibold shadow-ink-sm"
                  :class="feedbackClasses"
                >
                  {{ feedback.message }}
                </div>

                <div class="relative inline-flex flex-wrap items-center gap-2">
                  <span class="ink-chip bg-accent/60">Kode Akses</span>

                  <template v-if="isEditingEnrollKey">
                    <input
                      v-model.trim="enrollKeyDraft"
                      type="text"
                      class="min-w-[240px] rounded-xl border-2 border-ink bg-paper px-3 py-2 text-sm font-extrabold text-ink shadow-ink-sm outline-none focus:bg-cloud"
                      placeholder="TRIGONOMETRI-KELAS-7A"
                    />
                    <button
                      type="button"
                      class="inline-flex items-center gap-2 rounded-xl border-2 border-emerald-700 bg-emerald-500 px-3 py-2 text-xs font-extrabold text-white shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
                      :disabled="moduleActionLoading === 'saving'"
                      @click="saveEnrollKey"
                    >
                      <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
                        <path d="M5 12.5l4 4L19 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      {{ moduleActionLoading === 'saving' ? 'Menyimpan...' : 'Simpan' }}
                    </button>
                    <button
                      type="button"
                      class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-xs font-extrabold shadow-ink-sm"
                      :disabled="moduleActionLoading === 'saving'"
                      @click="cancelEnrollKeyEdit"
                    >
                      Batal
                    </button>
                  </template>

                  <template v-else>
                    <span class="rounded-xl border-2 border-ink bg-cloud px-3 py-2 font-mono text-xs font-extrabold text-ink">
                      {{ enrollKey || 'Loading...' }}
                    </span>
                    <div ref="menuRef" class="relative">
                      <button
                        ref="menuButtonRef"
                        type="button"
                        class="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-paper shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        @click="toggleEnrollMenu"
                        aria-label="Enroll key actions"
                      >
                        <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                          <path d="M5 12h.01M12 12h.01M19 12h.01" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" />
                        </svg>
                      </button>

                      <div
                        v-if="menuOpen"
                        class="fixed z-[60] rounded-2xl border-2 border-ink bg-paper p-2 shadow-ink"
                        :style="menuStyle"
                      >
                        <button
                          type="button"
                          class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-extrabold hover:bg-accent/30"
                          @click="startEditEnrollKey"
                        >
                          <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4 shrink-0" aria-hidden="true">
                            <path d="M4 20h4l10.5-10.5a2 2 0 0 0 0-3L16.5 4.5a2 2 0 0 0-3 0L3 15v5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
                          </svg>
                          Ubah
                        </button>
                        <button
                          type="button"
                          class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-extrabold hover:bg-accent/30"
                          @click="regenerateEnrollKey"
                        >
                          <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4 shrink-0" aria-hidden="true">
                            <path d="M21 12a9 9 0 1 1-3-6.7" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            <path d="M21 4v6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          Buat Ulang
                        </button>
                        <button
                          type="button"
                          class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-extrabold text-rose-700 hover:bg-rose-50"
                          @click="openDeleteModuleConfirm"
                        >
                          <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4 shrink-0" aria-hidden="true">
                            <path d="M4 7h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            <path d="M10 11v7M14 11v7" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            <path d="M6 7l1 14h10l1-14" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
                            <path d="M9 7V4h6v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    </div>
                  </template>
                </div>
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
              <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/60">Sesi Aktif</p>
              <h2 class="mt-2 text-xl font-semibold">{{ selectedSessionTitle }}</h2>
              <p class="mt-2 text-sm font-semibold text-ink/60">{{ selectedSessionDesc }}</p>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
                @click="reloadSelectedContents()"
              >
                Muat Ulang
              </button>
            </div>
          </div>
        </div>

        <div class="ink-card p-6">
          <div class="flex items-center justify-between gap-4">
            <h3 class="text-lg font-semibold">Materi</h3>
            <span class="ink-chip bg-accent/40">{{ contents.length }}</span>
          </div>

          <p v-if="contentsStatus === 'idle'" class="mt-4 text-sm font-semibold text-ink/60">Pilih sesi untuk melihat materi.</p>
          <p v-else-if="contentsStatus === 'loading'" class="mt-4 text-sm font-semibold text-ink/60">Memuat materi...</p>
          <p v-else-if="contentsStatus === 'error'" class="mt-4 text-sm font-semibold text-ink/60">
            Gagal memuat materi: <span class="font-extrabold">{{ contentsError }}</span>
          </p>

          <div v-else-if="!contents.length" class="mt-5 rounded-2xl border-2 border-ink bg-paper p-6 text-center shadow-ink-sm">
            <p class="text-sm font-extrabold">Belum ada materi.</p>
            <p class="mt-2 text-sm font-semibold text-ink/60">Materi dapat berupa berkas, tautan, atau ringkasan teks.</p>
          </div>

          <div v-else class="mt-5 space-y-3">
            <article v-for="c in contents" :key="c.id" class="rounded-2xl border-2 border-ink bg-paper p-5 shadow-ink-sm">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <p class="text-sm font-extrabold">{{ c.title }}</p>
                  <p class="mt-1 text-xs font-semibold text-ink/60">{{ c.typeLabel }}</p>
                </div>
                <span class="ink-chip bg-accent/40">{{ c.typeBadge }}</span>
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
                  Buka Tautan
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
                    {{ downloadStatusById[c.id] === 'loading' ? 'Mengunduh...' : 'Unduh Berkas' }}
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

    <ConfirmDialog
      :open="deleteModuleOpen"
      title="Hapus Modul"
      kicker="Danger"
      :message="deleteModuleMessage"
      confirm-text="Ya, hapus modul"
      :is-loading="moduleActionLoading === 'deleting'"
      @cancel="closeDeleteModule"
      @confirm="confirmDeleteModule"
    />
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import defaultBanner from '@/assets/images/module-banner-default.svg'
import { createServices } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useModulesStore } from '@/stores/modules'
import { useModuleBannersStore } from '@/stores/moduleBanners'
import SessionItem from '@/components/sessions/SessionItem.vue'
import EditSessionModal from '@/components/sessions/EditSessionModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
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

const menuOpen = ref(false)
const menuRef = ref(null)
const menuButtonRef = ref(null)
const menuStyle = ref({})
const isEditingEnrollKey = ref(false)
const enrollKeyDraft = ref('')
const deleteModuleOpen = ref(false)
const moduleActionLoading = ref('')
const feedback = ref({ type: '', message: '' })

const contents = ref([])
const contentsStatus = ref('idle')
const contentsError = ref('')

const downloadStatusById = ref({})

const moduleItem = computed(() => modules.items.find((m) => Number(m.id) === moduleId.value))

const moduleTitle = computed(() => moduleItem.value?.title || `Modul #${moduleId.value}`)
const moduleDesc = computed(() => moduleItem.value?.desc || ' ')
const moduleTeacher = computed(() => moduleItem.value?.teacherName || '')

const showEnrollKey = computed(() => {
  const r = auth.user?.role
  return r === 'teacher' || r === 'admin'
})

const enrollKey = ref('')

const bannerSrc = computed(() => {
  const cached = banners.urlsById[moduleId.value]
  if (cached) return cached
  return defaultBanner
})

const feedbackClasses = computed(() => {
  if (feedback.value.type === 'success') return 'border-emerald-700 bg-emerald-50 text-emerald-900'
  return 'border-rose-700 bg-rose-50 text-rose-900'
})

const selectedSession = computed(() => sessions.value.find((s) => s.id === selectedSessionId.value) || null)
const selectedSessionTitle = computed(() => selectedSession.value?.title || 'Pilih sesi')
const selectedSessionDesc = computed(() => selectedSession.value?.description || ' ')

const deleteModuleMessage = computed(() => {
  return `Kamu yakin mau menghapus modul ${moduleTitle.value}? Tindakan ini tidak bisa dibatalkan.`
})

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

  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)
  window.addEventListener('resize', onViewportChange)
  window.addEventListener('scroll', onViewportChange, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
})

watch(moduleId, async () => {
  selectedSessionId.value = null
  contents.value = []
  contentsStatus.value = 'idle'
  hideEnrollMenu()
  isEditingEnrollKey.value = false
  deleteModuleOpen.value = false
  moduleActionLoading.value = ''
  feedback.value = { type: '', message: '' }
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
    enrollKeyDraft.value = m.enrollKey
    return
  }

  try {
    const res = await services.modules.getById(moduleId.value)
    const data = res?.data || res
    if (data?.enroll_key) {
      enrollKey.value = data.enroll_key
      enrollKeyDraft.value = data.enroll_key
    }
  } catch {
    // ignore
  }
}

function showFeedback(type, message) {
  feedback.value = { type, message }
  window.setTimeout(() => {
    if (feedback.value.message === message) {
      feedback.value = { type: '', message: '' }
    }
  }, 3000)
}

function toggleEnrollMenu() {
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) {
    updateMenuPosition()
  }
}

function hideEnrollMenu() {
  menuOpen.value = false
}

function onDocumentClick(event) {
  if (!menuRef.value) return
  if (menuRef.value.contains(event.target)) return
  hideEnrollMenu()
}

function onDocumentKeydown(event) {
  if (event.key !== 'Escape') return
  hideEnrollMenu()
  isEditingEnrollKey.value = false
}

function onViewportChange() {
  if (!menuOpen.value) return
  updateMenuPosition()
}

function updateMenuPosition() {
  if (!menuButtonRef.value) return

  const rect = menuButtonRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const margin = 8
  const preferredWidth = 176
  const width = Math.min(preferredWidth, Math.max(140, viewportWidth - margin * 2))
  const estimatedHeight = 156

  let left = rect.right - width
  left = Math.max(margin, Math.min(left, viewportWidth - width - margin))

  let top = rect.bottom + 8
  if (top + estimatedHeight > viewportHeight - margin) {
    top = Math.max(margin, rect.top - estimatedHeight - 8)
  }

  menuStyle.value = {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
  }
}

function startEditEnrollKey() {
  enrollKeyDraft.value = enrollKey.value || ''
  isEditingEnrollKey.value = true
  hideEnrollMenu()
}

function cancelEnrollKeyEdit() {
  enrollKeyDraft.value = enrollKey.value || ''
  isEditingEnrollKey.value = false
}

async function saveEnrollKey() {
  if (!enrollKeyDraft.value.trim()) {
    showFeedback('error', 'Enroll key wajib diisi.')
    return
  }

  moduleActionLoading.value = 'saving'
  try {
    const res = await services.modules.update(moduleId.value, {
      name: moduleItem.value?.title || moduleTitle.value,
      description: moduleItem.value?.desc || '',
      enrollKey: enrollKeyDraft.value.trim(),
    })
    const data = res?.data || res

    if (res?.success === false) {
      throw new Error(res?.message || 'Gagal menyimpan enroll key')
    }

    enrollKey.value = data?.enroll_key || enrollKeyDraft.value.trim()
    enrollKeyDraft.value = enrollKey.value
    isEditingEnrollKey.value = false
    await modules.fetchAll({ services, force: true })
    showFeedback('success', res?.message || 'Enroll key berhasil disimpan.')
  } catch (e) {
    showFeedback('error', e?.message || 'Gagal menyimpan enroll key')
  } finally {
    moduleActionLoading.value = ''
  }
}

async function regenerateEnrollKey() {
  hideEnrollMenu()
  moduleActionLoading.value = 'regenerating'
  try {
    const res = await services.modules.regenerateEnrollKey(moduleId.value)
    const data = res?.data || res

    if (res?.success === false) {
      throw new Error(res?.message || 'Gagal regenerate enroll key')
    }

    enrollKey.value = data?.enroll_key || enrollKey.value
    enrollKeyDraft.value = enrollKey.value
    await modules.fetchAll({ services, force: true })
    showFeedback('success', res?.message || 'Enroll key berhasil digenerate ulang.')
  } catch (e) {
    showFeedback('error', e?.message || 'Gagal regenerate enroll key')
  } finally {
    moduleActionLoading.value = ''
  }
}

function openDeleteModuleConfirm() {
  hideEnrollMenu()
  deleteModuleOpen.value = true
}

function closeDeleteModule() {
  deleteModuleOpen.value = false
}

async function confirmDeleteModule() {
  moduleActionLoading.value = 'deleting'
  try {
    const res = await services.modules.delete(moduleId.value)
    if (res?.success === false) {
      throw new Error(res?.message || 'Gagal menghapus module')
    }
    showFeedback('success', res?.message || 'Module berhasil dihapus.')
    await modules.fetchAll({ services, force: true })
    deleteModuleOpen.value = false
    router.push('/courses')
  } catch (e) {
    showFeedback('error', e?.message || 'Gagal menghapus module')
  } finally {
    moduleActionLoading.value = ''
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
  const typeLabel = type === 'file' ? 'Berkas' : type === 'url' ? 'Tautan' : 'Teks'

  return {
    id: c?.id,
    type,
    typeLabel,
    typeBadge: typeLabel,
    title,
    url: c?.url || '',
    text: c?.text_content || c?.text || '',
    fileName: c?.file_name || c?.filename || c?.original_name || 'file',
  }
}
</script>
