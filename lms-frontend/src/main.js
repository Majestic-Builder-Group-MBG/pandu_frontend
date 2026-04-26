import { createApp } from 'vue'
import App from './App.vue'

import { createPinia } from 'pinia'
import router from './router'

import { useAuthStore } from '@/stores/auth'
import { getServices } from '@/services'

import './assets/styles/tailwind.css'

createApp(App).use(createPinia()).use(router).mount('#app')

let handlingUnauthorized = false
window.addEventListener('pandu:unauthorized', async () => {
  if (handlingUnauthorized) return
  handlingUnauthorized = true
  try {
    const auth = useAuthStore()
    const services = getServices()
    // Backend might have revoked token or user switched API base URL.
    await auth.logout({ services })
    router.push('/login')
  } finally {
    setTimeout(() => {
      handlingUnauthorized = false
    }, 250)
  }
})

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // ignore registration error in app bootstrap
    })
  })
}
