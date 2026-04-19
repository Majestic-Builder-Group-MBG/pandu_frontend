import { ApiClient } from '@/services/api/ApiClient'
import { AuthService } from '@/services/auth/AuthService'
import { RegisterCodesService } from '@/services/auth/RegisterCodesService'
import { ModulesService } from '@/services/modules/ModulesService'
import { SessionsService } from '@/services/sessions/SessionsService'
import { EnrollmentsService } from '@/services/enrollments/EnrollmentsService'
import { DashboardService } from '@/services/dashboard/DashboardService'
import { RemindersService } from '@/services/reminders/RemindersService'
import { PushSubscriptionsService } from '@/services/push/PushSubscriptionsService'
import { useAuthStore } from '@/stores/auth'

let servicesInstance = null

export function getServices() {
  if (servicesInstance) return servicesInstance

  const authStore = useAuthStore()
  const api = new ApiClient({ getToken: () => authStore.token })

  servicesInstance = {
    api,
    auth: new AuthService(api),
    registerCodes: new RegisterCodesService(api),
    modules: new ModulesService(api),
    sessions: new SessionsService(api),
    enrollments: new EnrollmentsService(api),
    dashboard: new DashboardService(api),
    reminders: new RemindersService(api),
    pushSubscriptions: new PushSubscriptionsService(api),
  }

  return servicesInstance
}

export function resetServices() {
  servicesInstance = null
}
