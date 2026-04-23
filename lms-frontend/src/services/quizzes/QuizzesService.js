export class QuizzesService {
  constructor(apiClient) {
    this.api = apiClient
  }

  getQuiz(moduleId, sessionId) {
    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/quiz`, { method: 'GET' })
  }

  createQuiz(
    moduleId,
    sessionId,
    { title, description, banner, duration_minutes, max_attempts, passing_score } = {}
  ) {
    const fd = new FormData()
    fd.append('title', title || '')
    if (description) fd.append('description', description)
    if (banner) fd.append('banner', banner)
    if (duration_minutes != null) fd.append('duration_minutes', String(duration_minutes))
    if (max_attempts != null) fd.append('max_attempts', String(max_attempts))
    if (passing_score != null) fd.append('passing_score', String(passing_score))

    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/quiz`, {
      method: 'POST',
      body: fd,
    })
  }

  updateQuiz(
    moduleId,
    sessionId,
    { title, description, banner, remove_banner, duration_minutes, max_attempts, passing_score } = {}
  ) {
    const fd = new FormData()
    if (title != null) fd.append('title', title || '')
    if (description != null) fd.append('description', description || '')
    if (banner) fd.append('banner', banner)
    if (remove_banner != null) fd.append('remove_banner', String(Boolean(remove_banner)))
    if (duration_minutes != null) fd.append('duration_minutes', String(duration_minutes))
    if (max_attempts != null) fd.append('max_attempts', String(max_attempts))
    if (passing_score != null) fd.append('passing_score', String(passing_score))

    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/quiz`, {
      method: 'PUT',
      body: fd,
    })
  }

  publishQuiz(moduleId, sessionId, { is_published } = {}) {
    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/quiz/publish`, {
      method: 'PATCH',
      body: { is_published: Boolean(is_published) },
    })
  }

  getQuizBanner(moduleId, sessionId) {
    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/quiz/banner`, {
      method: 'GET',
      responseType: 'blob',
    })
  }

  generateDraft(
    moduleId,
    sessionId,
    {
      source_mode = 'session_contents',
      content_ids,
      manual_context,
      apply_to_quiz = true,
      mcq_count,
      essay_count,
      difficulty,
      locale,
    } = {}
  ) {
    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/quiz/generate-draft`, {
      method: 'POST',
      body: {
        source_mode,
        content_ids: Array.isArray(content_ids) ? content_ids : undefined,
        manual_context: manual_context || undefined,
        apply_to_quiz: Boolean(apply_to_quiz),
        mcq_count,
        essay_count,
        difficulty,
        locale,
      },
    })
  }

  addQuestion(
    moduleId,
    sessionId,
    { question_type, question_text, points, options, media } = {}
  ) {
    const fd = new FormData()
    fd.append('question_type', question_type || '')
    fd.append('question_text', question_text || '')
    if (points != null) fd.append('points', String(points))
    if (options != null) fd.append('options', typeof options === 'string' ? options : JSON.stringify(options))
    if (media) fd.append('media', media)

    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/quiz/questions`, {
      method: 'POST',
      body: fd,
    })
  }

  updateQuestion(
    moduleId,
    sessionId,
    questionId,
    { question_type, question_text, points, options, media } = {}
  ) {
    const fd = new FormData()
    if (question_type != null) fd.append('question_type', question_type || '')
    if (question_text != null) fd.append('question_text', question_text || '')
    if (points != null) fd.append('points', String(points))
    if (options != null) fd.append('options', typeof options === 'string' ? options : JSON.stringify(options))
    if (media != null) fd.append('media', media)

    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/quiz/questions/${questionId}`, {
      method: 'PUT',
      body: fd,
    })
  }

  deleteQuestion(moduleId, sessionId, questionId) {
    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/quiz/questions/${questionId}`, {
      method: 'DELETE',
    })
  }

  getQuestionMedia(moduleId, sessionId, questionId) {
    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/quiz/questions/${questionId}/media`, {
      method: 'GET',
      responseType: 'blob',
    })
  }

  startAttempt(moduleId, sessionId) {
    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/quiz/start`, {
      method: 'POST',
    })
  }

  submitAttempt(moduleId, sessionId, { attempt_id, answers } = {}) {
    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/quiz/submit`, {
      method: 'POST',
      body: {
        attempt_id,
        answers: Array.isArray(answers) ? answers : [],
      },
    })
  }

  listAttempts(moduleId, sessionId) {
    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/quiz/attempts`, { method: 'GET' })
  }

  getAttempt(moduleId, sessionId, attemptId) {
    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/quiz/attempts/${attemptId}`, { method: 'GET' })
  }

  reviewAttempt(moduleId, sessionId, attemptId, { reviews } = {}) {
    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/quiz/attempts/${attemptId}/review`, {
      method: 'PATCH',
      body: { reviews: Array.isArray(reviews) ? reviews : [] },
    })
  }

  getLeaderboard(moduleId, sessionId, { mode } = {}) {
    const q = mode ? `?mode=${encodeURIComponent(String(mode))}` : ''
    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/quiz/leaderboard${q}`, { method: 'GET' })
  }

  setLeaderboardVisibility(moduleId, sessionId, { leaderboard_visibility } = {}) {
    return this.api.request(`/api/modules/${moduleId}/sessions/${sessionId}/quiz/leaderboard-visibility`, {
      method: 'PATCH',
      body: { leaderboard_visibility },
    })
  }
}
