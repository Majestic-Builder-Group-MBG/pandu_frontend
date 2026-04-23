export class RemindersService {
  constructor(apiClient) {
    this.api = apiClient
  }

  getSessionReminder(moduleId, sessionId) {
    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/reminder`, {
      method: 'GET',
      dedupe: true,
      dedupeKey: `GET:/api/modules/${moduleId}/sessions/${sessionId}/reminder`,
      cacheTTL: 5000,
    })
  }

  setSessionReminder(moduleId, sessionId, { enabled, channel = 'in_app', notify_before_minutes = 15 } = {}) {
    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/reminder`, {
      method: 'PUT',
      body: { enabled, channel, notify_before_minutes },
    })
  }

  deleteSessionReminder(moduleId, sessionId) {
    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/reminder`, {
      method: 'DELETE',
    })
  }

  myReminders({ page = 1, perPage = 10 } = {}) {
    const p = Number(page) > 0 ? Number(page) : 1
    const pp = Number(perPage) > 0 ? Number(perPage) : 10
    return this.api.request(`/api/reminders/me?page=${p}&per_page=${pp}`, {
      method: 'GET',
      dedupe: true,
      dedupeKey: `GET:/api/reminders/me?page=${p}&per_page=${pp}`,
      cacheTTL: 5000,
    })
  }
}
