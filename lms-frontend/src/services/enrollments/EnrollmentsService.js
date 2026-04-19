export class EnrollmentsService {
  constructor(apiClient) {
    this.api = apiClient
  }

  enroll({ enroll_key }) {
    return this.api.request('/api/enrollments/enroll', {
      method: 'POST',
      body: { enroll_key },
    })
  }

  me({ page = 1, perPage = 100 } = {}) {
    const p = Number(page) > 0 ? Number(page) : 1
    const pp = Number(perPage) > 0 ? Number(perPage) : 100
    return this.api.request(`/api/enrollments/me?page=${p}&per_page=${pp}`, {
      method: 'GET',
      dedupe: true,
      dedupeKey: `GET:/api/enrollments/me?page=${p}&per_page=${pp}`,
      cacheTTL: 5000,
      cancelPrevious: true,
    })
  }
}
