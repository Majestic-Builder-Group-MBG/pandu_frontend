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
        <button
          v-if="auth.token"
          type="button"
          class="rounded-xl border-2 border-ink bg-ink px-3 py-2 text-sm font-semibold text-paper shadow-ink-sm"
          @click="onLogout"
        >
          Logout
        </button>
        <RouterLink
          v-else
          to="/login"
          class="rounded-xl border-2 border-ink bg-ink px-3 py-2 text-sm font-semibold text-paper shadow-ink-sm"
        >
          Login
        </RouterLink>
      </nav>

      <div class="sm:hidden">
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
            v-if="canManageCodes"
            to="/registration-codes"
            class="rounded-2xl border-2 border-ink bg-paper px-4 py-3 text-sm font-extrabold shadow-ink-sm"
            @click="onMobileNavClick"
          >
            Codes
          </RouterLink>

          <button
            v-if="auth.token"
            type="button"
            class="mt-2 rounded-2xl border-2 border-ink bg-ink px-4 py-3 text-sm font-extrabold text-paper shadow-ink-sm"
            @click="onLogoutMobile"
          >
            Logout
          </button>
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
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getServices } from '@/services'
import logoPandu from '@/assets/logo_pandu_.png'

const router = useRouter()
const auth = useAuthStore()
const services = getServices()
const canManageCodes = computed(() => auth.user?.role === 'admin' || auth.user?.role === 'teacher')

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

async function onLogout() {
  await auth.logout({ services })
  router.push('/login')
}

async function onLogoutMobile() {
  mobileMenuOpen.value = false
  await onLogout()
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  window.removeEventListener('keydown', onKeydown)
})
</script>
