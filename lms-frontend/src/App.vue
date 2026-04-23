<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'
import MarketingLayout from './layouts/MarketingLayout.vue'

const route = useRoute()

const layout = computed(() => {
  const key = route.meta?.layout
  if (key === 'auth') return AuthLayout
  if (key === 'marketing') return MarketingLayout
  return DefaultLayout
})
</script>
