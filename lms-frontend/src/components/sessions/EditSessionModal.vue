<template>
  <BaseModal
    :open="open"
    title="Edit Sesi"
    kicker="Session"
    subtitle="Ubah judul, deskripsi, dan materi pada sesi ini."
    @close="$emit('close')"
  >
    <form class="space-y-4" @submit.prevent="save">
      <label class="block space-y-2">
        <span class="text-sm font-semibold">Judul</span>
        <input v-model.trim="title" class="ink-input" placeholder="Sesi 1" />
      </label>

      <label class="block space-y-2">
        <span class="text-sm font-semibold">Deskripsi</span>
        <textarea v-model.trim="description" class="ink-input min-h-[96px] resize-y" placeholder="Deskripsi sesi..." />
      </label>

      <label class="block space-y-2">
        <span class="text-sm font-semibold">Urutan (sort_order)</span>
        <input v-model.number="sortOrder" type="number" min="1" class="ink-input" />
      </label>

      <div class="rounded-2xl border-2 border-ink bg-paper p-5 shadow-ink-sm">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold">Materi Saat Ini</h3>
          <span class="ink-chip bg-accent/40">{{ existingContents.length }}</span>
        </div>

        <p v-if="contentsStatus === 'loading'" class="mt-3 text-sm font-semibold text-ink/60">Memuat materi...</p>
        <p v-else-if="contentsStatus === 'error'" class="mt-3 text-sm font-semibold text-ink/60">{{ contentsError }}</p>

        <div v-else class="mt-4 space-y-3">
          <div
            v-for="c in existingContents"
            :key="c.id"
            class="flex items-start justify-between gap-4 rounded-2xl border-2 border-ink bg-cloud p-4"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-extrabold">{{ c.title }}</p>
              <p class="mt-1 text-xs font-semibold text-ink/60">{{ c.typeLabel }}</p>
              <p v-if="c.type === 'url'" class="mt-1 truncate text-xs font-bold text-ink/60">{{ c.url }}</p>
              <p v-else-if="c.type === 'file'" class="mt-1 truncate text-xs font-bold text-ink/60">{{ c.fileName }}</p>
              <p v-if="c.text" class="mt-2 whitespace-pre-wrap text-xs font-semibold text-ink/70">{{ c.text }}</p>
            </div>
            <button
              type="button"
              class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-xs font-extrabold shadow-ink-sm hover:bg-rose-50"
              @click="toggleDelete(c.id)"
            >
              {{ toDelete.has(c.id) ? 'Undo' : 'Hapus' }}
            </button>
          </div>

          <p v-if="!existingContents.length" class="text-sm font-semibold text-ink/60">Belum ada konten.</p>
        </div>
      </div>

      <div class="rounded-2xl border-2 border-ink bg-paper p-5 shadow-ink-sm">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold">Tambah Materi</h3>
          <span class="ink-chip bg-accent/40">{{ pendingAdds.length }}</span>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            class="ink-chip"
            :class="newType === 'url' ? 'bg-accent/60' : 'bg-paper hover:bg-accent/30'"
            @click="newType = 'url'"
          >
            Tautan
          </button>
          <button
            type="button"
            class="ink-chip"
            :class="newType === 'text' ? 'bg-accent/60' : 'bg-paper hover:bg-accent/30'"
            @click="newType = 'text'"
          >
            Teks
          </button>
          <button
            type="button"
            class="ink-chip"
            :class="newType === 'file' ? 'bg-accent/60' : 'bg-paper hover:bg-accent/30'"
            @click="newType = 'file'"
          >
            Berkas
          </button>
        </div>

        <div class="mt-4 space-y-3">
          <label class="block space-y-2">
            <span class="text-sm font-semibold">Judul materi (opsional)</span>
            <input v-model.trim="newTitle" class="ink-input" placeholder="Judul materi..." />
          </label>

          <label v-if="newType === 'url'" class="block space-y-2">
            <span class="text-sm font-semibold">Tautan</span>
            <input v-model.trim="newUrl" class="ink-input" placeholder="https://www.youtube.com/watch?v=..." />
          </label>

          <label v-if="newType === 'file'" class="block space-y-2">
            <span class="text-sm font-semibold">Berkas</span>
            <input
              type="file"
              class="block w-full rounded-xl border-2 border-ink bg-paper px-4 py-3 text-sm font-semibold shadow-ink-sm file:mr-4 file:rounded-lg file:border-0 file:bg-accent/60 file:px-3 file:py-2 file:text-sm file:font-extrabold"
              @change="onPickFile"
            />
            <p v-if="newFileName" class="text-xs font-bold text-ink/50">Selected: {{ newFileName }}</p>
          </label>

          <label class="block space-y-2">
            <span class="text-sm font-semibold">{{ newType === 'text' ? 'Isi materi' : 'Text tambahan (opsional)' }}</span>
            <textarea
              v-model.trim="newText"
              class="ink-input min-h-[120px] resize-y"
              :placeholder="newType === 'text' ? 'Materi inti sesi ini adalah ...' : 'Ringkasan / poin penting / petunjuk (opsional)'"
            />
          </label>

          <button
            type="button"
            class="rounded-xl border-2 border-ink bg-accent px-4 py-2 text-sm font-extrabold shadow-ink-sm"
            @click="queueAdd"
          >
            + Tambah ke daftar
          </button>

          <div v-if="pendingAdds.length" class="mt-4 space-y-2">
            <div
              v-for="(p, idx) in pendingAdds"
              :key="idx"
              class="flex items-start justify-between gap-4 rounded-2xl border-2 border-ink bg-cloud p-4"
            >
              <div class="min-w-0">
                <p class="mt-1 truncate text-sm font-extrabold">{{ p.title || '(no title)' }}</p>
                <p class="mt-1 text-xs font-semibold text-ink/60">{{ pendingTypeLabel(p.content_type) }}</p>
                <p v-if="p.content_type === 'url'" class="mt-1 truncate text-xs font-bold text-ink/60">{{ p.url }}</p>
                <p v-else-if="p.content_type === 'file'" class="mt-1 truncate text-xs font-bold text-ink/60">{{ p.file?.name }}</p>
                <p v-if="p.text_content" class="mt-2 whitespace-pre-wrap text-xs font-semibold text-ink/70">{{ p.text_content }}</p>
              </div>
              <button
                type="button"
                class="rounded-xl border-2 border-ink bg-paper px-3 py-2 text-xs font-extrabold shadow-ink-sm hover:bg-rose-50"
                @click="removePending(idx)"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>

      <p v-if="error" class="rounded-xl border-2 border-ink bg-accent/30 px-4 py-3 text-sm font-semibold text-ink">{{ error }}</p>
      <p v-if="success" class="rounded-xl border-2 border-ink bg-paper px-4 py-3 text-sm font-semibold text-ink shadow-ink-sm">{{ success }}</p>
    </form>

    <template #actions>
      <button
        type="button"
        class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
        :disabled="isLoading"
        @click="$emit('close')"
      >
        Batal
      </button>
      <button
        type="button"
        class="rounded-xl border-2 border-ink bg-accent px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        :disabled="isLoading"
        @click="save"
      >
        {{ isLoading ? 'Menyimpan...' : 'Simpan' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { createServices } from '@/services'

const props = defineProps({
  open: { type: Boolean, default: false },
  moduleId: { type: Number, required: true },
  session: { type: Object, default: null },
})

const emit = defineEmits(['close', 'saved'])

const services = createServices()

const title = ref('')
const description = ref('')
const sortOrder = ref(1)

const existingContents = ref([])
const contentsStatus = ref('idle')
const contentsError = ref('')

const toDelete = ref(new Set())

const newType = ref('url')
const newTitle = ref('')
const newUrl = ref('')
const newText = ref('')
const newFile = ref(null)

const pendingAdds = ref([])

const isLoading = ref(false)
const error = ref('')
const success = ref('')

const newFileName = computed(() => newFile.value?.name || '')

watch(
  () => props.open,
  async (v) => {
    if (!v) return
    error.value = ''
    success.value = ''
    title.value = props.session?.title || ''
    description.value = props.session?.description || ''
    sortOrder.value = props.session?.sortOrder || 1
    toDelete.value = new Set()
    pendingAdds.value = []
    newType.value = 'url'
    newTitle.value = ''
    newUrl.value = ''
    newText.value = ''
    newFile.value = null
    await loadContents()
  }
)

async function loadContents() {
  if (!props.session?.id) return
  contentsStatus.value = 'loading'
  contentsError.value = ''
  try {
    const res = await services.sessions.listContents(props.moduleId, props.session.id)
    const list = normalizeListResponse(res)
    existingContents.value = list.map(mapContent)
    contentsStatus.value = 'success'
  } catch (e) {
    contentsStatus.value = 'error'
    contentsError.value = e?.message || 'Gagal memuat konten'
  }
}

function toggleDelete(contentId) {
  const s = new Set(toDelete.value)
  if (s.has(contentId)) s.delete(contentId)
  else s.add(contentId)
  toDelete.value = s
}

function onPickFile(e) {
  const f = e?.target?.files?.[0]
  newFile.value = f || null
}

function queueAdd() {
  error.value = ''
  if (newType.value === 'url' && !newUrl.value) {
    error.value = 'URL wajib diisi.'
    return
  }
  if (newType.value === 'text' && !newText.value) {
    error.value = 'Text content wajib diisi.'
    return
  }
  if (newType.value === 'file' && !newFile.value) {
    error.value = 'File wajib dipilih.'
    return
  }

  pendingAdds.value = [
    ...pendingAdds.value,
    {
      content_type: newType.value,
      title: newTitle.value,
      url: newType.value === 'url' ? newUrl.value : undefined,
      text_content: newText.value || undefined,
      file: newType.value === 'file' ? newFile.value : undefined,
    },
  ]

  newTitle.value = ''
  newUrl.value = ''
  newText.value = ''
  newFile.value = null
}

function removePending(idx) {
  pendingAdds.value = pendingAdds.value.filter((_, i) => i !== idx)
}

async function save() {
  error.value = ''
  success.value = ''
  if (!props.session?.id) return
  if (!title.value) {
    error.value = 'Judul sesi wajib diisi.'
    return
  }

  isLoading.value = true
  try {
    // 1) Update session meta
    await services.sessions.update(props.moduleId, props.session.id, {
      title: title.value,
      description: description.value,
      sort_order: sortOrder.value,
    })

    // 2) Delete selected contents
    for (const id of Array.from(toDelete.value)) {
      await services.sessions.deleteContent(props.moduleId, props.session.id, id)
    }

    // 3) Add queued contents
    for (const p of pendingAdds.value) {
      await services.sessions.addContent(props.moduleId, props.session.id, p)
    }

    success.value = 'Sesi berhasil diperbarui.'
    emit('saved')
  } catch (e) {
    error.value = e?.message || 'Gagal menyimpan sesi'
  } finally {
    isLoading.value = false
  }
}

function normalizeListResponse(res) {
  if (Array.isArray(res)) return res
  if (res && typeof res === 'object') {
    if (Array.isArray(res.data)) return res.data
    if (res.data && Array.isArray(res.data.contents)) return res.data.contents
  }
  return []
}

function mapContent(c) {
  const type = c?.content_type || c?.type || 'text'
  const titleVal = c?.title || (type === 'file' ? 'File' : type === 'url' ? 'Link' : 'Text')
  const typeLabel = type === 'file' ? 'Berkas' : type === 'url' ? 'Tautan' : 'Teks'
  return {
    id: c?.id,
    type,
    title: titleVal,
    typeLabel,
    url: c?.url || '',
    text: c?.text_content || c?.text || '',
    fileName: c?.file_name || c?.filename || c?.original_name || 'file',
  }
}

function pendingTypeLabel(type) {
  return type === 'file' ? 'Berkas' : type === 'url' ? 'Tautan' : 'Teks'
}
</script>
