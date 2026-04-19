<template>
  <BaseModal
    :open="open"
    title="Buat Modul"
    kicker="Teacher/Admin"
    subtitle="Isi nama modul, deskripsi (opsional), dan banner (opsional)."
    @close="$emit('close')"
  >
    <form class="space-y-4" @submit.prevent="submit">
      <label class="block space-y-2">
        <span class="text-sm font-semibold">Nama Modul</span>
        <input v-model.trim="name" class="ink-input" placeholder="Modul Trigonometri" />
      </label>

      <label class="block space-y-2">
        <span class="text-sm font-semibold">Deskripsi</span>
        <textarea
          v-model.trim="description"
          class="ink-input min-h-[96px] resize-y"
          placeholder="Pengantar trigonometri"
        />
      </label>

      <label class="block space-y-2">
        <span class="text-sm font-semibold">Banner (opsional)</span>
        <input
          type="file"
          accept="image/*,application/pdf,video/*"
          class="block w-full rounded-xl border-2 border-ink bg-paper px-4 py-3 text-sm font-semibold shadow-ink-sm file:mr-4 file:rounded-lg file:border-0 file:bg-accent/60 file:px-3 file:py-2 file:text-sm file:font-extrabold"
          @change="onFile"
        />
        <p v-if="bannerName" class="text-xs font-bold text-ink/50">Selected: {{ bannerName }}</p>
      </label>

      <p v-if="error" class="rounded-xl border-2 border-ink bg-accent/30 px-4 py-3 text-sm font-semibold text-ink">
        {{ error }}
      </p>

      <p v-if="success" class="rounded-xl border-2 border-ink bg-paper px-4 py-3 text-sm font-semibold text-ink shadow-ink-sm">
        {{ success }}
      </p>
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
        {{ isLoading ? 'Membuat...' : 'Buat Modul' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

import BaseModal from '@/components/ui/BaseModal.vue'
import { getServices } from '@/services'
import { useModulesStore } from '@/stores/modules'

const props = defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'created'])

const services = getServices()
const modules = useModulesStore()

const name = ref('')
const description = ref('')
const bannerFile = ref(null)

const isLoading = ref(false)
const error = ref('')
const success = ref('')

const bannerName = computed(() => bannerFile.value?.name || '')

watch(
  () => props.open,
  (v) => {
    if (!v) return
    error.value = ''
    success.value = ''
    name.value = ''
    description.value = ''
    bannerFile.value = null
  }
)

function onFile(e) {
  const f = e?.target?.files?.[0]
  bannerFile.value = f || null
}

async function submit() {
  error.value = ''
  success.value = ''

  if (!name.value) {
    error.value = 'Nama modul wajib diisi.'
    return
  }

  isLoading.value = true
  try {
    const res = await services.modules.create({
      name: name.value,
      description: description.value,
      banner: bannerFile.value,
    })

    if (!res?.success || !res?.data?.id) {
      throw new Error(res?.message || 'Gagal membuat modul')
    }

    success.value = res?.message || 'Modul berhasil dibuat'
    await modules.fetchAll({ services, force: true })
    emit('created', res.data)
  } catch (e) {
    error.value = e?.message || 'Gagal membuat modul'
  } finally {
    isLoading.value = false
  }
}
</script>
