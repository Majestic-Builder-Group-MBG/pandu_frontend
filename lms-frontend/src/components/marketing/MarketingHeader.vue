<template>
  <header class="sticky top-0 z-50 border-b-2 border-ink bg-paper/85 backdrop-blur">
    <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
      <RouterLink to="/" class="flex items-center gap-3">
        <span class="grid h-9 w-9 place-items-center rounded-xl border-2 border-ink bg-accent text-xs font-extrabold">
          LMS
        </span>
        <span class="font-display text-sm font-semibold tracking-tight text-ink">Scholarly</span>
      </RouterLink>

      <nav class="hidden items-center gap-2 sm:flex">
        <component
          :is="isLanding ? 'a' : RouterLink"
          :href="isLanding ? '#features' : undefined"
          :to="!isLanding ? { name: 'landing', hash: '#features' } : undefined"
          class="rounded-xl border-2 border-transparent px-3 py-2 text-sm font-semibold text-ink/80 hover:border-ink hover:bg-accent/40 hover:text-ink"
        >
          Features
        </component>

        <RouterLink
          to="/about"
          class="rounded-xl border-2 border-transparent px-3 py-2 text-sm font-semibold text-ink/80 hover:border-ink hover:bg-accent/40 hover:text-ink"
        >
          About
        </RouterLink>

        <RouterLink
          to="/contact"
          class="rounded-xl border-2 border-transparent px-3 py-2 text-sm font-semibold text-ink/80 hover:border-ink hover:bg-accent/40 hover:text-ink"
        >
          Contact
        </RouterLink>

        <component
          :is="isLanding ? 'a' : RouterLink"
          :href="isLanding ? '#report' : undefined"
          :to="!isLanding ? { name: 'landing', hash: '#report' } : undefined"
          class="rounded-xl border-2 border-transparent px-3 py-2 text-sm font-semibold text-ink/80 hover:border-ink hover:bg-accent/40 hover:text-ink"
        >
          Report
        </component>

        <RouterLink
          v-if="auth.token"
          to="/dashboard"
          class="rounded-xl border-2 border-ink bg-ink px-3 py-2 text-sm font-semibold text-paper shadow-ink-sm"
        >
          Dashboard
        </RouterLink>
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

    <div v-if="mobileMenuOpen" id="mobile-nav" ref="mobileMenuRef" class="border-t-2 border-ink bg-paper/95 backdrop-blur sm:hidden">
      <div class="mx-auto w-full max-w-6xl px-4 py-4">
        <div class="grid gap-2">
          <component
            :is="isLanding ? 'a' : RouterLink"
            :href="isLanding ? '#features' : undefined"
            :to="!isLanding ? { name: 'landing', hash: '#features' } : undefined"
            class="rounded-2xl border-2 border-ink bg-paper px-4 py-3 text-sm font-extrabold shadow-ink-sm"
            @click="onMobileNavClick"
          >
            Features
          </component>

          <RouterLink
            to="/about"
            class="rounded-2xl border-2 border-ink bg-paper px-4 py-3 text-sm font-extrabold shadow-ink-sm"
            @click="onMobileNavClick"
          >
            About
          </RouterLink>

          <RouterLink
            to="/contact"
            class="rounded-2xl border-2 border-ink bg-paper px-4 py-3 text-sm font-extrabold shadow-ink-sm"
            @click="onMobileNavClick"
          >
            Contact
          </RouterLink>

          <component
            :is="isLanding ? 'a' : RouterLink"
            :href="isLanding ? '#report' : undefined"
            :to="!isLanding ? { name: 'landing', hash: '#report' } : undefined"
            class="rounded-2xl border-2 border-ink bg-paper px-4 py-3 text-sm font-extrabold shadow-ink-sm"
            @click="onMobileNavClick"
          >
            Report
          </component>

          <RouterLink
            v-if="auth.token"
            to="/dashboard"
            class="mt-2 rounded-2xl border-2 border-ink bg-ink px-4 py-3 text-sm font-extrabold text-paper shadow-ink-sm"
            @click="onMobileNavClick"
          >
            Dashboard
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
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const isLanding = computed(() => route.name === 'landing')

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

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  window.removeEventListener('keydown', onKeydown)
})
</script>
