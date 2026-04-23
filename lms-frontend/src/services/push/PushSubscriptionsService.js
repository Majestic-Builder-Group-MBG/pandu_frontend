export class PushSubscriptionsService {
  constructor(apiClient) {
    this.api = apiClient
  }

  create({ subscription, platform, user_agent } = {}) {
    return this.api.request('/api/push/subscriptions', {
      method: 'POST',
      body: { subscription, platform, user_agent },
    })
  }

  remove({ endpoint } = {}) {
    return this.api.request('/api/push/subscriptions', {
      method: 'DELETE',
      body: { endpoint },
    })
  }

  me({ page = 1, perPage = 10 } = {}) {
    const p = Number(page) > 0 ? Number(page) : 1
    const pp = Number(perPage) > 0 ? Number(perPage) : 10
    return this.api.request(`/api/push/subscriptions/me?page=${p}&per_page=${pp}`, {
      method: 'GET',
      dedupe: true,
      dedupeKey: `GET:/api/push/subscriptions/me?page=${p}&per_page=${pp}`,
      cacheTTL: 5000,
    })
  }
}
