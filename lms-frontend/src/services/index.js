import { ApiClient } from '@/services/api/ApiClient'
import { AuthService } from '@/services/auth/AuthService'
import { ModulesService } from '@/services/modules/ModulesService'
import { SessionsService } from '@/services/sessions/SessionsService'
import { useAuthStore } from '@/stores/auth'

export function createServices() {
  const authStore = useAuthStore()
  const api = new ApiClient({ getToken: () => authStore.token })

  return {
    api,
    auth: new AuthService(api),
    modules: new ModulesService(api),
    sessions: new SessionsService(api),
  }
}
