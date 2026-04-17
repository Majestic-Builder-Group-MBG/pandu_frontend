import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import CoursesView from '@/views/courses/CoursesView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { layout: 'auth' },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { layout: 'auth' },
    },
    {
      path: '/courses',
      name: 'courses',
      component: CoursesView,
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: { layout: 'auth' },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.name === 'login' && auth.token) {
    return { name: 'dashboard' }
  }

  if (to.name === 'register' && auth.token) {
    return { name: 'dashboard' }
  }

  if (to.meta?.requiresAuth && !auth.token) {
    return { name: 'login' }
  }

  return true
})

export default router
