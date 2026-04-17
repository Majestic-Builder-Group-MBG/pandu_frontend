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

  me() {
    return this.api.request('/api/enrollments/me', {
      method: 'GET',
    })
  }
}
