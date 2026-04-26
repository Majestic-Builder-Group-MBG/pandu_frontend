import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import LandingView from '@/views/marketing/LandingView.vue'
import FeaturesView from '@/views/marketing/FeaturesView.vue'
import AboutView from '@/views/marketing/AboutView.vue'
import ContactView from '@/views/marketing/ContactView.vue'
import PrivacyView from '@/views/marketing/PrivacyView.vue'
import TermsView from '@/views/marketing/TermsView.vue'
import CookiesView from '@/views/marketing/CookiesView.vue'
import QuizHubView from '@/views/quizzes/QuizHubView.vue'
import CoursesView from '@/views/courses/CoursesView.vue'
import ModuleSessionsView from '@/views/courses/ModuleSessionsView.vue'
import SessionQuizView from '@/views/courses/SessionQuizView.vue'
import RegistrationCodesView from '@/views/admin/RegistrationCodesView.vue'
import ProfileView from '@/views/profile/ProfileView.vue'
import PasswordChangeInboxView from '@/views/inbox/PasswordChangeInboxView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
      meta: { layout: 'marketing' },
    },
    {
      path: '/features',
      name: 'features',
      component: FeaturesView,
      meta: { layout: 'marketing' },
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: { layout: 'marketing' },
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
      meta: { layout: 'marketing' },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: PrivacyView,
      meta: { layout: 'marketing' },
    },
    {
      path: '/terms',
      name: 'terms',
      component: TermsView,
      meta: { layout: 'marketing' },
    },
    {
      path: '/cookies',
      name: 'cookies',
      component: CookiesView,
      meta: { layout: 'marketing' },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/quiz',
      name: 'quiz-hub',
      component: QuizHubView,
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
      path: '/courses/:moduleId',
      name: 'module-sessions',
      component: ModuleSessionsView,
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/courses/:moduleId/sessions/:sessionId/quiz',
      name: 'session-quiz',
      component: SessionQuizView,
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/registration-codes',
      name: 'registration-codes',
      component: RegistrationCodesView,
      meta: { layout: 'default', requiresAuth: true, roles: ['admin', 'teacher'] },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { layout: 'default', requiresAuth: true },
    },
    {
      path: '/inbox',
      name: 'inbox',
      component: PasswordChangeInboxView,
      meta: { layout: 'default', requiresAuth: true, roles: ['admin', 'teacher'] },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: { layout: 'auth' },
    },
  ],
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, top: 92, behavior: 'smooth' }
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

  if (to.meta?.roles?.length) {
    const role = auth.user?.role
    if (!role || !to.meta.roles.includes(role)) {
      return { name: 'dashboard' }
    }
  }

  return true
})

export default router
