<template>
  <header class="sticky top-0 z-50 border-b-2 border-ink bg-paper/80 backdrop-blur">
    <div class="flex w-full items-center justify-between px-4 py-4">
      <RouterLink to="/dashboard" class="flex items-center gap-3">
        <img :src="logoPandu" alt="Pandu" class="h-10 w-14 shrink-0 object-contain" />
        <span class="font-display text-sm font-semibold tracking-tight text-ink">Pandu</span>
      </RouterLink>

      <nav class="hidden items-center gap-2 sm:flex">
        <RouterLink
          to="/dashboard"
          class="rounded-xl border-2 border-transparent px-3 py-2 text-sm font-semibold text-ink/80 hover:border-ink hover:bg-accent/40 hover:text-ink"
        >
          Dashboard
        </RouterLink>
        <RouterLink
          to="/courses"
          class="rounded-xl border-2 border-transparent px-3 py-2 text-sm font-semibold text-ink/80 hover:border-ink hover:bg-accent/40 hover:text-ink"
        >
          Courses
        </RouterLink>
        <RouterLink
          to="/quiz"
          title="Pilih modul dan sesi untuk masuk ke kuis"
          class="rounded-xl border-2 border-transparent px-3 py-2 text-sm font-semibold text-ink/80 hover:border-ink hover:bg-accent/40 hover:text-ink"
        >
          Quiz
        </RouterLink>

        <RouterLink
          v-if="canManageCodes"
          to="/registration-codes"
          class="rounded-xl border-2 border-transparent px-3 py-2 text-sm font-semibold text-ink/80 hover:border-ink hover:bg-accent/40 hover:text-ink"
        >
          Codes
        </RouterLink>
        
        <RouterLink
          v-if="auth.token && canApprovePw"
          to="/inbox"
          class="relative grid h-10 w-10 place-items-center rounded-xl text-ink/70 transition hover:bg-accent/20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          aria-label="Inbox"
          title="Inbox"
        >
          <svg viewBox="0 0 640 640" class="h-6 w-6" aria-hidden="true">
            <path
              fill="currentColor"
              d="M155.8 96C123.9 96 96.9 119.4 92.4 150.9L64.6 345.2C64.2 348.2 64 351.2 64 354.3L64 480C64 515.3 92.7 544 128 544L512 544C547.3 544 576 515.3 576 480L576 354.3C576 351.3 575.8 348.2 575.4 345.2L547.6 150.9C543.1 119.4 516.1 96 484.2 96L155.8 96zM155.8 160L484.3 160L511.7 352L451.8 352C439.7 352 428.6 358.8 423.2 369.7L408.9 398.3C403.5 409.1 392.4 416 380.3 416L259.9 416C247.8 416 236.7 409.2 231.3 398.3L217 369.7C211.6 358.9 200.5 352 188.4 352L128.3 352L155.8 160z"
            />
          </svg>
          <span
            v-if="inboxBadge"
            class="absolute right-0 top-0 grid h-5 min-w-5 -translate-y-1/3 translate-x-1/3 place-items-center rounded-full border-2 border-ink bg-accent px-1 text-[10px] font-black leading-none"
          >
            {{ inboxBadge > 99 ? '99+' : inboxBadge }}
          </span>
        </RouterLink>


        <RouterLink
          v-if="auth.token"
          to="/profile"
          class="grid h-10 w-10 place-items-center overflow-hidden rounded-full border-2 border-ink bg-paper shadow-ink-sm"
          aria-label="Profile"
          title="Profile"
        >
          <img :src="profilePhotoSrc" alt="Profile" class="h-full w-full object-cover" />
        </RouterLink>
        <RouterLink
          v-else
          to="/login"
          class="rounded-xl border-2 border-ink bg-ink px-3 py-2 text-sm font-semibold text-paper shadow-ink-sm"
        >
          Login
        </RouterLink>
      </nav>

      <div class="flex items-center gap-2 sm:hidden">
        <RouterLink
          v-if="auth.token && canApprovePw"
          to="/inbox"
          class="relative grid h-11 w-11 place-items-center rounded-xl text-ink/70 transition hover:bg-accent/20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          aria-label="Inbox"
          title="Inbox"
        >
          <svg viewBox="0 0 640 640" class="h-6 w-6" aria-hidden="true">
            <path
              fill="currentColor"
              d="M155.8 96C123.9 96 96.9 119.4 92.4 150.9L64.6 345.2C64.2 348.2 64 351.2 64 354.3L64 480C64 515.3 92.7 544 128 544L512 544C547.3 544 576 515.3 576 480L576 354.3C576 351.3 575.8 348.2 575.4 345.2L547.6 150.9C543.1 119.4 516.1 96 484.2 96L155.8 96zM155.8 160L484.3 160L511.7 352L451.8 352C439.7 352 428.6 358.8 423.2 369.7L408.9 398.3C403.5 409.1 392.4 416 380.3 416L259.9 416C247.8 416 236.7 409.2 231.3 398.3L217 369.7C211.6 358.9 200.5 352 188.4 352L128.3 352L155.8 160z"
            />
          </svg>
          <span
            v-if="inboxBadge"
            class="absolute right-0 top-0 grid h-5 min-w-5 -translate-y-1/3 translate-x-1/3 place-items-center rounded-full border-2 border-ink bg-accent px-1 text-[10px] font-black leading-none"
          >
            {{ inboxBadge > 99 ? '99+' : inboxBadge }}
          </span>
        </RouterLink>

        <RouterLink
          v-if="auth.token"
          to="/profile"
          class="grid h-11 w-11 place-items-center overflow-hidden rounded-full border-2 border-ink bg-paper shadow-ink-sm"
          aria-label="Profile"
          title="Profile"
        >
          <img :src="profilePhotoSrc" alt="Profile" class="h-full w-full object-cover" />
        </RouterLink>

        <button
          ref="mobileMenuButtonRef"
          type="button"
          class="relative z-[60] grid h-11 w-11 place-items-center rounded-xl border-2 border-ink bg-paper shadow-ink-sm touch-manipulation"
          :aria-expanded="mobileMenuOpen ? 'true' : 'false'"
          aria-controls="mobile-nav"
          aria-label="Toggle navigation"
          @click="toggleMobileMenu"
        >
          <svg v-if="!mobileMenuOpen" viewBox="0 0 24 24" fill="none" class="h-5 w-5 pointer-events-none" aria-hidden="true">
            <path d="M4 7h16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
            <path d="M4 12h16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
            <path d="M4 17h16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" class="h-5 w-5 pointer-events-none" aria-hidden="true">
            <path d="M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </div>

    <div
      v-if="mobileMenuOpen"
      id="mobile-nav"
      ref="mobileMenuRef"
      class="border-t-2 border-ink bg-paper/95 backdrop-blur sm:hidden"
    >
      <div class="w-full px-4 py-4">
        <div class="grid gap-2">
          <RouterLink
            to="/dashboard"
            class="rounded-2xl border-2 border-ink bg-paper px-4 py-3 text-sm font-extrabold shadow-ink-sm"
            @click="onMobileNavClick"
          >
            Dashboard
          </RouterLink>
          <RouterLink
            to="/courses"
            class="rounded-2xl border-2 border-ink bg-paper px-4 py-3 text-sm font-extrabold shadow-ink-sm"
            @click="onMobileNavClick"
          >
            Courses
          </RouterLink>
          <RouterLink
            to="/quiz"
            class="rounded-2xl border-2 border-ink bg-paper px-4 py-3 text-sm font-extrabold shadow-ink-sm"
            @click="onMobileNavClick"
          >
            Quiz
          </RouterLink>
          <RouterLink
            v-if="auth.token"
            to="/profile"
            class="rounded-2xl border-2 border-ink bg-paper px-4 py-3 text-sm font-extrabold shadow-ink-sm"
            @click="onMobileNavClick"
          >
            Profile
          </RouterLink>
          <RouterLink
            v-if="canManageCodes"
            to="/registration-codes"
            class="rounded-2xl border-2 border-ink bg-paper px-4 py-3 text-sm font-extrabold shadow-ink-sm"
            @click="onMobileNavClick"
          >
            Codes
          </RouterLink>
          <RouterLink
            v-else
            to="/login"
            class="mt-2 rounded-2xl border-2 border-ink bg-ink px-4 py-3 text-sm font-extrabold text-paper shadow-ink-sm"
            @click="onMobileNavClick"
          >
            Login
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import logoPandu from '@/assets/logo_pandu_.png'
import defaultPhoto from '@/assets/icons/default.webp'
import { useProfileStore } from '@/stores/profile'
import { getServices } from '@/services'
import { usePasswordChangeInboxStore } from '@/stores/passwordChangeInbox'

const auth = useAuthStore()
const profile = useProfileStore()
const pwInbox = usePasswordChangeInboxStore()
const services = getServices()
const canManageCodes = computed(() => auth.user?.role === 'admin' || auth.user?.role === 'teacher')
const canApprovePw = computed(() => auth.user?.role === 'admin' || auth.user?.role === 'teacher')

const profilePhotoSrc = computed(() => profile.photoUrl || defaultPhoto)
const inboxBadge = computed(() => pwInbox.unseenCount)

const mobileMenuOpen = ref(false)
const mobileMenuRef = ref(null)
const mobileMenuButtonRef = ref(null)

function onMobileNavClick() {
  mobileMenuOpen.value = false
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function onDocClick(e) {
  if (!mobileMenuOpen.value) return
  const menu = mobileMenuRef.value
  const btn = mobileMenuButtonRef.value

  const path = typeof e?.composedPath === 'function' ? e.composedPath() : null
  if (path && menu && path.includes(menu)) return
  if (path && btn && path.includes(btn)) return

  const t = e?.target
  if (menu && t && menu.contains(t)) return
  if (btn && t && btn.contains(t)) return
  mobileMenuOpen.value = false
}

function onKeydown(e) {
  if (e.key !== 'Escape') return
  mobileMenuOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  window.addEventListener('keydown', onKeydown)
})

watch(
  () => auth.token,
  async (token) => {
    if (!token) return
    // Best-effort: load photo for the navbar avatar.
    try {
      await profile.fetchMyPhoto({ services })
    } catch {
      // ignore
    }

    if (canApprovePw.value) {
      try {
        await pwInbox.fetchInbox({ services, force: true, page: 1, perPage: 50 })
      } catch {
        // ignore
      }
    }
  },
  { immediate: true }
)

let inboxTimer = null

function stopInboxTimer() {
  if (inboxTimer) window.clearInterval(inboxTimer)
  inboxTimer = null
}

function startInboxTimer() {
  stopInboxTimer()
  if (!auth.token || !canApprovePw.value) return
  inboxTimer = window.setInterval(async () => {
    if (!auth.token || !canApprovePw.value) return
    try {
      await pwInbox.fetchInbox({ services, force: true, page: 1, perPage: 50 })
    } catch {
      // ignore
    }
  }, 30_000)
}

watch(
  () => `${auth.token ? '1' : '0'}:${String(auth.user?.role || '')}`,
  () => {
    startInboxTimer()
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  stopInboxTimer()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  window.removeEventListener('keydown', onKeydown)
})
</script>
