export class DashboardService {
  constructor(apiClient) {
    this.api = apiClient
  }

  upcomingSessions({ page = 1, perPage = 10 } = {}) {
    const p = Number(page) > 0 ? Number(page) : 1
    const pp = Number(perPage) > 0 ? Number(perPage) : 10
    return this.api.request(`/api/dashboard/upcoming-sessions?page=${p}&per_page=${pp}`, {
      method: 'GET',
    })
  }
}
