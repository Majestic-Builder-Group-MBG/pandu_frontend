<template>
  <BaseModal
    :open="open"
    title="Enroll Modul"
    kicker="Student"
    subtitle="Masukkan enroll key dari guru untuk mendapatkan akses modul."
    @close="$emit('close')"
  >
    <form class="space-y-4" @submit.prevent="submit">
      <label class="block space-y-2">
        <span class="text-sm font-semibold">Enroll Key</span>
        <input
          v-model.trim="key"
          class="ink-input"
          placeholder="A1B2C3D4E5F6"
          autocomplete="one-time-code"
        />
      </label>

      <p class="text-xs font-bold text-ink/50">Hanya role student yang bisa enroll via key.</p>

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
        @click="submit"
      >
        {{ isLoading ? 'Memproses...' : 'Enroll' }}
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
})

const emit = defineEmits(['close', 'enrolled'])

const services = getServices()

const key = ref('')
const isLoading = ref(false)
const error = ref('')
const success = ref('')

watch(
  () => props.open,
  (v) => {
    if (!v) return
    key.value = ''
    error.value = ''
    success.value = ''
  }
)

async function submit() {
  error.value = ''
  success.value = ''

  if (!key.value) {
    error.value = 'Enroll key wajib diisi.'
    return
  }

  isLoading.value = true
  try {
    const res = await services.enrollments.enroll({ enroll_key: key.value })
    if (!res?.success) throw new Error(res?.message || 'Enroll gagal')

    success.value = res?.message || 'Enroll berhasil'
    emit('enrolled', res?.data)
  } catch (e) {
    error.value = e?.message || 'Enroll gagal'
  } finally {
    isLoading.value = false
  }
}
</script>
