<template>
  <BaseModal
    :open="open"
    title="Rename Sesi"
    kicker="Sesi"
    subtitle="Ubah judul sesi."
    @close="$emit('close')"
  >
    <form class="space-y-4" @submit.prevent="save">
      <label class="block space-y-2">
        <span class="text-sm font-semibold">Judul</span>
        <input v-model.trim="title" class="ink-input" placeholder="Sesi 1" />
      </label>

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
import { ref, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { getServices } from '@/services'

const props = defineProps({
  open: { type: Boolean, default: false },
  moduleId: { type: Number, required: true },
  session: { type: Object, default: null },
})

const emit = defineEmits(['close', 'saved'])

const services = getServices()

const title = ref('')

const isLoading = ref(false)
const error = ref('')
const success = ref('')

watch(
  () => props.open,
  async (v) => {
    if (!v) return
    error.value = ''
    success.value = ''
    title.value = props.session?.title || ''
  }
)

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
    await services.sessions.update(props.moduleId, props.session.id, { title: title.value })
    success.value = 'Judul sesi berhasil diperbarui.'
    emit('saved')
  } catch (e) {
    error.value = e?.message || 'Gagal menyimpan sesi'
  } finally {
    isLoading.value = false
  }
}
</script>
