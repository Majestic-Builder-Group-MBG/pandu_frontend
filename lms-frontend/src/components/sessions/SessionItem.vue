<template>
  <div class="relative">
    <button
      type="button"
      class="w-full rounded-2xl border-2 border-ink p-2 text-left shadow-ink-sm transition"
      :class="selected ? 'bg-accent/40' : 'bg-paper hover:bg-accent/20'"
      @click="$emit('select')"
    >
      <div class="flex items-center justify-between gap-3">
        <div class="flex min-w-0 flex-1 items-center">
          <span
            class="grid h-10 w-10 shrink-0 place-items-center"
            aria-hidden="true"
          >
            <svg viewBox="0 0 50 50" fill="none" class="h-5 w-5 text-ink/80" aria-hidden="true">
              <path
                d="m9.9 27.41a4.29 4.29 0 0 1 4.29 4.29v.38a4.47 4.47 0 0 1 -1.42 3.35 2.48 2.48 0 0 0 -.94 1.81c0 .58.24 1.16 1.5 1.81l1.29.58c1.81.89 3.39 1.81 3.44 3.62a2.39 2.39 0 0 1 -2.06 2.27h-11.95a2.39 2.39 0 0 1 -2.3-2.45c0-1.72 1.59-2.73 3.44-3.62l.67-.29.33-.16c1.57-.65 1.81-1.22 1.81-1.8a2.73 2.73 0 0 0 -.94-1.81 4.46 4.46 0 0 1 -1.42-3.39 4.3 4.3 0 0 1 3.94-4.62zm36.23-19.93a3.62 3.62 0 0 1 3.62 3.62v27.17a3.63 3.63 0 0 1 -3.62 3.63h-25.49a5.43 5.43 0 0 0 -2.64-3.63h27.15a.9.9 0 0 0 .9-.9v-23.55a.9.9 0 0 0 -.9-.9h-36.23a.9.9 0 0 0 -.9.9h-.02v11.09a6.51 6.51 0 0 0 -3.63 2.37v-16.18a3.63 3.63 0 0 1 3.63-3.62z"
                fill="currentColor"
              />
            </svg>
          </span>

          <div class="min-w-0 flex-1">
            <p v-if="!isRenaming" class="truncate text-base font-extrabold leading-snug">{{ session.title }}</p>

          <div v-else class="flex flex-wrap items-center gap-2">
            <input
              v-model.trim="draftTitle"
              class="min-w-0 flex-1 rounded-xl border-2 border-ink bg-paper px-3 py-2 text-base font-extrabold shadow-ink-sm outline-none focus:bg-cloud"
              :placeholder="session.title || 'Judul sesi'"
              @keydown.enter.prevent="saveRename"
              @keydown.esc.prevent="cancelRename"
              aria-label="Judul sesi"
            />

            <button
              type="button"
              class="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-paper shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
              :disabled="renameStatus === 'loading'"
              @click.stop="saveRename"
              aria-label="Simpan"
              title="Simpan"
            >
              <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              class="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-paper shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
              :disabled="renameStatus === 'loading'"
              @click.stop="cancelRename"
              aria-label="Batal"
              title="Batal"
            >
              <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                <path d="M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                <path d="M18 6L6 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
              </svg>
            </button>
          </div>

            <p v-if="renameError" class="mt-2 text-xs font-bold text-rose-700">{{ renameError }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="canManage"
            type="button"
            class="grid h-9 w-9 place-items-center rounded-xl border-2 border-transparent text-ink/70 hover:border-ink hover:bg-accent/20"
            aria-label="Session actions"
            @click.stop="toggleMenu"
            :disabled="isRenaming"
          >
            <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
              <path d="M5 12h.01M12 12h.01M19 12h.01" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </button>

    <div
      v-if="menuOpen"
      class="absolute right-3 top-14 z-10 w-40 rounded-2xl border-2 border-ink bg-paper p-2 shadow-ink"
    >
      <button
        type="button"
        class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-extrabold hover:bg-accent/30"
        @click="startRename"
      >
        <span class="grid h-8 w-8 place-items-center rounded-xl border-2 border-ink bg-paper shadow-ink-sm">
          <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
            <path
              d="M4 20h4l10.5-10.5a2 2 0 0 0 0-3L16.5 4.5a2 2 0 0 0-3 0L3 15v5Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path d="M12.5 6.5l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </span>
        Rename
      </button>

      <button
        type="button"
        class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-extrabold text-rose-700 hover:bg-rose-50"
        @click="onDelete"
      >
        <span class="grid h-8 w-8 place-items-center rounded-xl border-2 border-ink bg-paper shadow-ink-sm">
          <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
            <path d="M4 7h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <path d="M10 11v7M14 11v7" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <path
              d="M6 7l1 14h10l1-14"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path d="M9 7V4h6v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </span>
        Hapus
      </button>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { createServices } from '@/services'

const props = defineProps({
  moduleId: { type: Number, required: true },
  session: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  canManage: { type: Boolean, default: false },
})

const emit = defineEmits(['select', 'renamed', 'delete'])

const services = createServices()

const menuOpen = ref(false)

const isRenaming = ref(false)
const draftTitle = ref('')
const renameStatus = ref('idle')
const renameError = ref('')

watch(
  () => props.session?.title,
  (v) => {
    if (!isRenaming.value) draftTitle.value = v || ''
  },
  { immediate: true }
)

function closeMenu() {
  menuOpen.value = false
}

function onDocClick() {
  closeMenu()
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) {
    setTimeout(() => {
      document.addEventListener('click', onDocClick, { once: true })
    }, 0)
  }
}

function startRename() {
  closeMenu()
  renameError.value = ''
  isRenaming.value = true
  draftTitle.value = props.session?.title || ''
}

function cancelRename() {
  renameError.value = ''
  isRenaming.value = false
  draftTitle.value = props.session?.title || ''
}

async function saveRename() {
  const sessionId = props.session?.id
  const next = String(draftTitle.value || '').trim()
  if (!sessionId) return
  if (!next) {
    renameError.value = 'Judul sesi wajib diisi.'
    return
  }

  renameStatus.value = 'loading'
  renameError.value = ''
  try {
    await services.sessions.update(props.moduleId, sessionId, { title: next })
    emit('renamed', { sessionId, title: next })
    isRenaming.value = false
  } catch (e) {
    renameError.value = e?.message || 'Gagal rename sesi'
  } finally {
    renameStatus.value = 'idle'
  }
}

function onDelete() {
  closeMenu()
  emit('delete')
}

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
})
</script>
