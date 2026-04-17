<template>
  <BaseModal
    :open="open"
    :title="title"
    :kicker="kicker"
    :subtitle="subtitle"
    @close="$emit('cancel')"
  >
    <p class="text-sm font-semibold text-ink/70">{{ message }}</p>

    <template #actions>
      <button
        type="button"
        class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
        :disabled="isLoading"
        @click="$emit('cancel')"
      >
        Batal
      </button>
      <button
        type="button"
        class="rounded-xl border-2 border-ink bg-rose-600 px-4 py-2 text-sm font-extrabold text-white shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        :disabled="isLoading"
        @click="$emit('confirm')"
      >
        {{ isLoading ? 'Memproses...' : confirmText }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/ui/BaseModal.vue'

defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Konfirmasi' },
  kicker: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  message: { type: String, required: true },
  confirmText: { type: String, default: 'Hapus' },
  isLoading: { type: Boolean, default: false },
})

defineEmits(['confirm', 'cancel'])
</script>
