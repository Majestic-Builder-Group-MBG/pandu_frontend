export class SessionsService {
  constructor(apiClient) {
    this.api = apiClient
  }

  list(moduleId) {
    return this.api.request(`/api/modules/${moduleId}/sessions`, { method: 'GET' })
  }

  create(moduleId, { title, description } = {}) {
    return this.api.request(`/api/modules/${moduleId}/sessions`, {
      method: 'POST',
      body: { title, description },
    })
  }

  update(moduleId, sessionId, { title, description, sort_order } = {}) {
    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}`, {
      method: 'PUT',
      body: { title, description, sort_order },
    })
  }

  // Not listed in docs, but commonly supported.
  // If backend doesn't implement it, API will return 404 and UI will show error.
  delete(moduleId, sessionId) {
    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}`, {
      method: 'DELETE',
    })
  }

  listContents(moduleId, sessionId) {
    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/contents`, { method: 'GET' })
  }

  addContent(moduleId, sessionId, { content_type, title, file, url, text_content } = {}) {
    const fd = new FormData()
    fd.append('content_type', content_type)
    if (title) fd.append('title', title)
    if (content_type === 'file' && file) fd.append('file', file)
    if (content_type === 'url' && url) fd.append('url', url)
    if (text_content) fd.append('text_content', text_content)

    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/contents`, {
      method: 'POST',
      body: fd,
    })
  }

  deleteContent(moduleId, sessionId, contentId) {
    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/contents/${contentId}`, {
      method: 'DELETE',
    })
  }

  downloadContentFile(moduleId, sessionId, contentId) {
    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/contents/${contentId}/file`, {
      method: 'GET',
      responseType: 'blob',
    })
  }
}
