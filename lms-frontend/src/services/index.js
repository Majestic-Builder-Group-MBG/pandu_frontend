import { ApiClient } from '@/services/api/ApiClient'
import { AuthService } from '@/services/auth/AuthService'
import { useAuthStore } from '@/stores/auth'

export function createServices() {
  const authStore = useAuthStore()
  const api = new ApiClient({ getToken: () => authStore.token })

  return {
    api,
    auth: new AuthService(api),
  }
}
