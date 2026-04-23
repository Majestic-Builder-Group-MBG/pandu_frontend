<template>
  <header :class="[
      'fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 transition-transform duration-200 will-change-transform',
      headerHidden ? '-translate-y-[160%]' : 'translate-y-0',
    ]
    ">
    <div class="rounded-full border-2 border-ink bg-paper/85 backdrop-blur shadow-ink">
      <div class="mx-auto flex w-full max-w-6xl items-center px-8 py-4">
        <RouterLink to="/" class="flex items-center gap-3">
          <img :src="logoPandu" alt="Pandu" class="h-8 w-16 shrink-0 object-contain" />
          <span class="font-display text-md font-semibold tracking-tight text-ink">Pandu</span>
        </RouterLink>

        <nav class="hidden flex-1 items-center justify-center gap-2 sm:flex">
          <component :is="isLanding ? 'a' : RouterLink" :href="isLanding ? '#' : undefined"
            :to="!isLanding ? { name: 'landing' } : undefined"
            class="rounded-xl border-2 border-transparent px-3 py-2 text-sm font-semibold text-ink/80 hover:border-ink hover:bg-accent/40 hover:text-ink">
            Home
          </component>

          <RouterLink to="/features"
            class="rounded-xl border-2 border-transparent px-3 py-2 text-sm font-semibold text-ink/80 hover:border-ink hover:bg-accent/40 hover:text-ink">
            Features
          </RouterLink>

          <RouterLink to="/about"
            class="rounded-xl border-2 border-transparent px-3 py-2 text-sm font-semibold text-ink/80 hover:border-ink hover:bg-accent/40 hover:text-ink">
            About
          </RouterLink>

          <RouterLink to="/contact"
            class="rounded-xl border-2 border-transparent px-3 py-2 text-sm font-semibold text-ink/80 hover:border-ink hover:bg-accent/40 hover:text-ink">
            Demo
          </RouterLink>

        </nav>

        <div class="hidden items-center sm:flex">
          <RouterLink v-if="auth.token" to="/dashboard"
            class="rounded-xl border-2 border-ink bg-ink px-3 py-2 text-sm font-semibold text-paper shadow-ink-sm">
            <span class="flex justify-center align-center gap-2">
              <img :src="loginIcon" alt="icon-login" class="h-4"> Get Started
            </span>
          </RouterLink>
          <RouterLink v-else to="/register"
            class="rounded-xl border-2 border-ink bg-ink px-3 py-2 text-sm font-semibold text-paper shadow-ink-sm">
            <span class="flex justify-center align-center gap-2">
              <img :src="loginIcon" alt="icon-login" class="h-4"> Get Started
            </span>
          </RouterLink>
        </div>

        <div class="sm:hidden ml-auto">
          <button ref="mobileMenuButtonRef" type="button"
            class="relative z-[60] grid h-11 w-11 place-items-center rounded-xl border-2 border-ink bg-paper shadow-ink-sm touch-manipulation"
            :aria-expanded="mobileMenuOpen ? 'true' : 'false'" aria-controls="mobile-nav" aria-label="Toggle navigation"
            @click="toggleMobileMenu">
            <svg v-if="!mobileMenuOpen" viewBox="0 0 24 24" fill="none" class="h-5 w-5 pointer-events-none"
              aria-hidden="true">
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
    </div>

    <div v-if="mobileMenuOpen" id="mobile-nav" ref="mobileMenuRef"
      class="mt-2 rounded-2xl border-2 border-ink bg-paper/95 backdrop-blur shadow-ink sm:hidden">
      <div class="mx-auto w-full max-w-6xl px-4 py-4">
        <div class="grid gap-2">
          <component :is="isLanding ? 'a' : RouterLink" :href="isLanding ? '#' : undefined"
            :to="!isLanding ? { name: 'landing' } : undefined"
            class="rounded-2xl border-2 border-ink bg-paper px-4 py-3 text-sm font-extrabold shadow-ink-sm"
            @click="onMobileNavClick">
            Home
          </component>

          <RouterLink to="/features"
            class="rounded-2xl border-2 border-ink bg-paper px-4 py-3 text-sm font-extrabold shadow-ink-sm"
            @click="onMobileNavClick">
            Features
          </RouterLink>

          <RouterLink to="/about"
            class="rounded-2xl border-2 border-ink bg-paper px-4 py-3 text-sm font-extrabold shadow-ink-sm"
            @click="onMobileNavClick">
            About
          </RouterLink>

          <RouterLink to="/contact"
            class="rounded-2xl border-2 border-ink bg-paper px-4 py-3 text-sm font-extrabold shadow-ink-sm"
            @click="onMobileNavClick">
            Demo
          </RouterLink>

          <RouterLink v-if="auth.token" to="/dashboard"
            class="mt-2 rounded-2xl border-2 border-ink bg-ink px-4 py-3 text-sm font-extrabold text-paper shadow-ink-sm"
            @click="onMobileNavClick">
            Dashboard
          </RouterLink>

          <RouterLink v-else to="/login"
            class="mt-2 rounded-2xl border-2 border-ink bg-ink px-4 py-3 text-sm font-extrabold text-paper shadow-ink-sm"
            @click="onMobileNavClick">
            Login
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import logoPandu from '@/assets/logo_pandu_.png'
import loginIcon from '@/assets/icons/login64px.png'

const auth = useAuthStore()
const route = useRoute()
const isLanding = computed(() => route.name === 'landing')

const headerHidden = ref(false)
let lastScrollY = 0

const mobileMenuOpen = ref(false)
const mobileMenuRef = ref(null)
const mobileMenuButtonRef = ref(null)

function onMobileNavClick() {
  mobileMenuOpen.value = false
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
  if (mobileMenuOpen.value) headerHidden.value = false
}

function onScroll() {
  const y = window.scrollY || 0
  const shouldAnimate = true

  if (!shouldAnimate || mobileMenuOpen.value) {
    headerHidden.value = false
    lastScrollY = y
    return
  }

  if (y <= 0) {
    headerHidden.value = false
    lastScrollY = y
    return
  }

  const delta = y - lastScrollY
  const threshold = 10
  if (delta > threshold) headerHidden.value = true
  if (delta < -threshold) headerHidden.value = false
  lastScrollY = y
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
  lastScrollY = window.scrollY || 0
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', onScroll)
})

watch(
  () => route.name,
  () => {
    headerHidden.value = false
    lastScrollY = window.scrollY || 0
  },
)
</script>
