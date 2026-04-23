<template>
  <form class="ink-card bg-paper-grid p-6" @submit.prevent="onSubmit">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/60">Contact</p>
        <h3 class="mt-1 text-2xl font-extrabold">Kirim report / masukan</h3>
        <p class="mt-2 text-sm font-semibold text-ink/70">
          Form ini dummy untuk sekarang. Nanti bisa dihubungkan ke API atau email gateway.
        </p>
      </div>
      <span class="hidden sm:inline-flex items-center gap-2 rounded-2xl border-2 border-ink bg-ocean-50 px-3 py-2 text-xs font-extrabold text-ocean-700 shadow-ink-sm">
        <span class="h-2 w-2 rounded-full bg-ocean-500" />
        Ocean accent
      </span>
    </div>

    <div class="mt-6 grid gap-3 sm:grid-cols-2">
      <label class="block space-y-2">
        <span class="text-sm font-semibold">Nama</span>
        <input v-model.trim="draft.name" class="ink-input" placeholder="Nama kamu" />
      </label>
      <label class="block space-y-2">
        <span class="text-sm font-semibold">Email</span>
        <input v-model.trim="draft.email" class="ink-input" placeholder="nama@email.com" />
      </label>
      <label class="block space-y-2 sm:col-span-2">
        <span class="text-sm font-semibold">Topik</span>
        <input v-model.trim="draft.topic" class="ink-input" placeholder="Bug / Saran / Pertanyaan" />
      </label>
      <label class="block space-y-2 sm:col-span-2">
        <span class="text-sm font-semibold">Pesan</span>
        <textarea v-model.trim="draft.message" rows="5" class="ink-input" placeholder="Tulis detailnya..." />
      </label>
    </div>

    <p v-if="error" class="mt-4 rounded-xl border-2 border-rose-700 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900">
      {{ error }}
    </p>
    <p v-if="success" class="mt-4 rounded-xl border-2 border-emerald-700 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
      {{ success }}
    </p>

    <div class="mt-5 flex flex-wrap items-center gap-2">
      <button
        type="submit"
        class="rounded-xl border-2 border-ink bg-accent px-4 py-2 text-sm font-extrabold shadow-ink-sm transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        :disabled="status === 'loading'"
      >
        {{ status === 'loading' ? 'Mengirim...' : 'Kirim' }}
      </button>
      <button
        type="button"
        class="rounded-xl border-2 border-ink bg-paper px-4 py-2 text-sm font-extrabold shadow-ink-sm"
        :disabled="status === 'loading'"
        @click="reset"
      >
        Reset
      </button>
      <a
        class="rounded-xl border-2 border-ink bg-ink px-4 py-2 text-sm font-extrabold text-paper shadow-ink-sm"
        :href="mailtoHref"
      >
        Mailto
      </a>
    </div>
  </form>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

const status = ref('idle')
const error = ref('')
const success = ref('')

const draft = reactive({
  name: '',
  email: '',
  topic: '',
  message: '',
})

const mailtoHref = computed(() => {
  const subject = encodeURIComponent(`[Scholarly LMS] ${draft.topic || 'Report'}`)
  const body = encodeURIComponent(
    `Nama: ${draft.name || '-'}\nEmail: ${draft.email || '-'}\n\n${draft.message || ''}`
  )
  return `mailto:admin@example.com?subject=${subject}&body=${body}`
})

function reset() {
  draft.name = ''
  draft.email = ''
  draft.topic = ''
  draft.message = ''
  error.value = ''
  success.value = ''
}

async function onSubmit() {
  error.value = ''
  success.value = ''

  if (!draft.topic.trim() || !draft.message.trim()) {
    error.value = 'Topik dan pesan wajib diisi.'
    return
  }

  status.value = 'loading'
  try {
    // Placeholder. Keep it local for now.
    await new Promise((r) => setTimeout(r, 450))
    success.value = 'Terkirim. Terima kasih, laporan kamu masuk ke antrian.'
  } finally {
    status.value = 'idle'
  }
}
</script>
