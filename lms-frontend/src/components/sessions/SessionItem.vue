<template>
  <div class="relative">
    <button
      type="button"
      class="w-full rounded-2xl border-2 border-ink p-4 text-left shadow-ink-sm transition"
      :class="selected ? 'bg-accent/40' : 'bg-paper hover:bg-accent/20'"
      @click="$emit('select')"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="truncate text-sm font-extrabold">{{ session.title }}</p>
          <p class="mt-1 line-clamp-2 text-xs font-bold text-ink/60">{{ session.description || 'Tanpa deskripsi' }}</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="ink-chip bg-paper">#{{ session.sortOrder }}</span>
          <button
            v-if="canManage"
            type="button"
            class="grid h-9 w-9 place-items-center rounded-xl border-2 border-transparent text-ink/70 hover:border-ink hover:bg-accent/20"
            aria-label="Session actions"
            @click.stop="toggleMenu"
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
        @click="onEdit"
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
        Edit
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
        Delete
      </button>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'

defineProps({
  session: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  canManage: { type: Boolean, default: false },
})

const emit = defineEmits(['select', 'edit', 'delete'])

const menuOpen = ref(false)

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

function onEdit() {
  closeMenu()
  emit('edit')
}

function onDelete() {
  closeMenu()
  emit('delete')
}

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
})
</script>
