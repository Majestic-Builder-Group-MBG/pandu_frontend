export class ModulesService {
  constructor(apiClient) {
    this.api = apiClient
  }

  list() {
    return this.api.request('/api/modules', { method: 'GET' })
  }

  getById(moduleId) {
    return this.api.request(`/api/modules/${moduleId}`, { method: 'GET' })
  }

  create({ name, description, banner } = {}) {
    const fd = new FormData()
    fd.append('name', name || '')
    if (description) fd.append('description', description)
    if (banner) fd.append('banner', banner)

    return this.api.request('/api/modules', {
      method: 'POST',
      body: fd,
    })
  }

  getBannerByUrl(bannerPathOrUrl) {
    return this.api.request(bannerPathOrUrl, { method: 'GET', responseType: 'blob' })
  }

  getBanner(moduleId) {
    return this.api.request(`/api/modules/${moduleId}/banner`, { method: 'GET', responseType: 'blob' })
  }
}
