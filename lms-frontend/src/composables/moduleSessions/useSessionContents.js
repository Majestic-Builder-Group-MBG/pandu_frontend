import { computed, reactive, ref } from 'vue'
import { normalizeListResponse } from '@/services/mappers/list'

function mapContent(c) {
  const type = c?.content_type || c?.type || 'text'
  const title = c?.title || (type === 'file' ? 'File' : type === 'url' ? 'Link' : 'Text')
  const typeLabel = type === 'file' ? 'Berkas' : type === 'url' ? 'Tautan' : 'Teks'

  return {
    id: c?.id,
    type,
    typeLabel,
    typeBadge: typeLabel,
    title,
    url: c?.url || '',
    text: c?.text_content || c?.text || '',
    fileName: c?.original_name || c?.file_name || c?.filename || c?.title || `content-${c?.id || ''}`,
    mimeType: c?.mime_type || c?.mimeType || '',
    fileDownloadUrl: c?.file_download_url || c?.fileDownloadUrl || null,
    fileKind: c?.file_kind || c?.fileKind || null,
    isMedia: Boolean(c?.is_media ?? c?.isMedia),
    isPublicViewSupported: Boolean(c?.is_public_view_supported ?? c?.isPublicViewSupported),
    shouldUsePublicViewUrl: Boolean(c?.should_use_public_view_url ?? c?.shouldUsePublicViewUrl),
  }
}

function mediaKindFromContent(content) {
  const k = String(content?.fileKind || '').toLowerCase()
  if (k === 'image') return 'image'
  if (k === 'video') return 'video'

  const mime = String(content?.mimeType || '').toLowerCase()
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  if (mime.startsWith('audio/')) return 'audio'

  return ''
}

export function useSessionContents({ services, moduleId, selectedSessionId, openMediaPreview, hideContentsMenu, closeContentActions }) {
  const contents = ref([])
  const contentsStatus = ref('idle')
  const contentsError = ref('')

  const downloadStatusById = reactive({})
  const fileViewStatusById = reactive({})
  const fileViewErrorById = reactive({})

  const contentActionsOpenId = ref(null)

  const contentModalOpen = ref(false)
  const contentModalMode = ref('add')
  const contentModalLoading = ref(false)
  const contentModalError = ref('')
  const editingContentId = ref(null)
  const editingContentOriginalType = ref('')
  const editingContentOriginalTitle = ref('')
  const editingContentOriginalUrl = ref('')
  const editingContentOriginalText = ref('')
  const editingContentOriginalFileName = ref('')

  const contentType = ref('url')
  const contentTitle = ref('')
  const contentUrl = ref('')
  const contentText = ref('')
  const contentFile = ref(null)
  const contentFileInputRef = ref(null)

  const deleteContentOpen = ref(false)
  const deleteContentItem = ref(null)
  const deleteContentLoading = ref(false)

  const contentFileName = computed(() => contentFile.value?.name || '')

  const contentFileLabel = computed(() => {
    if (contentFileName.value) return contentFileName.value
    if (contentModalMode.value !== 'edit') return 'Belum ada file'

    return (
      String(editingContentOriginalFileName.value || '').trim() ||
      String(editingContentOriginalTitle.value || '').trim()
    )
  })

  const deleteContentMessage = computed(() => {
    const t = deleteContentItem.value?.title || 'materi ini'
    return `Kamu yakin mau menghapus ${t}? Tindakan ini tidak bisa dibatalkan.`
  })

  function setLockedState() {
    contents.value = []
    contentsError.value = ''
    contentsStatus.value = 'locked'
  }

  function clearRecord(obj) {
    Object.keys(obj).forEach((k) => {
      delete obj[k]
    })
  }

  function resetTransientFileStatuses() {
    clearRecord(fileViewStatusById)
    clearRecord(fileViewErrorById)
  }

  async function loadContents() {
    if (!selectedSessionId.value) return

    contentsStatus.value = 'loading'
    contentsError.value = ''
    try {
      const res = await services.sessions.listContents(moduleId.value, selectedSessionId.value)
      const list = normalizeListResponse(res)
      contents.value = list.map(mapContent)
      contentsStatus.value = 'success'
      resetTransientFileStatuses()
    } catch (e) {
      contentsStatus.value = 'error'
      contentsError.value = e?.message || 'Gagal memuat konten'
    }
  }

  function toggleContentActions(contentId) {
    if (contentActionsOpenId.value === contentId) {
      closeContentActionsLocal()
      return
    }

    contentActionsOpenId.value = contentId
    setTimeout(() => {
      document.addEventListener(
        'click',
        () => {
          closeContentActionsLocal()
        },
        { once: true }
      )
    }, 0)
  }

  function closeContentActionsLocal() {
    contentActionsOpenId.value = null
    if (typeof closeContentActions === 'function') closeContentActions()
  }

  function onPickContentFile(e) {
    const f = e?.target?.files?.[0]
    contentFile.value = f || null
  }

  function triggerContentFilePicker() {
    contentFileInputRef.value?.click?.()
  }

  function openAddContent() {
    if (!selectedSessionId.value) return
    if (typeof hideContentsMenu === 'function') hideContentsMenu()
    closeContentActionsLocal()
    contentModalMode.value = 'add'
    contentModalError.value = ''
    contentModalLoading.value = false
    editingContentId.value = null
    editingContentOriginalType.value = ''
    editingContentOriginalTitle.value = ''
    editingContentOriginalUrl.value = ''
    editingContentOriginalText.value = ''
    editingContentOriginalFileName.value = ''
    contentType.value = 'url'
    contentTitle.value = ''
    contentUrl.value = ''
    contentText.value = ''
    contentFile.value = null
    contentModalOpen.value = true
  }

  function openEditContent(c) {
    if (typeof hideContentsMenu === 'function') hideContentsMenu()
    closeContentActionsLocal()
    contentModalMode.value = 'edit'
    contentModalError.value = ''
    contentModalLoading.value = false
    editingContentId.value = c?.id || null
    editingContentOriginalType.value = c?.type || 'text'
    editingContentOriginalTitle.value = c?.title || ''
    editingContentOriginalUrl.value = c?.url || ''
    editingContentOriginalText.value = c?.text || ''
    editingContentOriginalFileName.value = c?.fileName || ''

    contentType.value = editingContentOriginalType.value
    contentTitle.value = editingContentOriginalTitle.value
    contentUrl.value = editingContentOriginalUrl.value
    contentText.value = editingContentOriginalText.value
    contentFile.value = null
    contentModalOpen.value = true
  }

  function closeContentModal() {
    contentModalOpen.value = false
    contentModalLoading.value = false
    contentModalError.value = ''
    editingContentId.value = null
    editingContentOriginalType.value = ''
    editingContentOriginalTitle.value = ''
    editingContentOriginalUrl.value = ''
    editingContentOriginalText.value = ''
    editingContentOriginalFileName.value = ''
  }

  async function saveContent() {
    if (!selectedSessionId.value) return

    contentModalError.value = ''

    const nextType = contentType.value
    const isEdit = contentModalMode.value === 'edit'
    const originalType = editingContentOriginalType.value

    if (nextType === 'url' && !contentUrl.value.trim()) {
      contentModalError.value = 'URL wajib diisi.'
      return
    }
    if (nextType === 'text' && !contentText.value.trim()) {
      contentModalError.value = 'Isi materi wajib diisi.'
      return
    }
    if (nextType === 'file') {
      const needsFile = !isEdit || originalType !== 'file'
      if (needsFile && !contentFile.value) {
        contentModalError.value = 'File wajib dipilih.'
        return
      }
    }

    contentModalLoading.value = true
    try {
      if (contentModalMode.value === 'add') {
        await services.sessions.addContent(moduleId.value, selectedSessionId.value, {
          content_type: nextType,
          title: contentTitle.value,
          url: nextType === 'url' ? contentUrl.value.trim() : undefined,
          file: nextType === 'file' ? contentFile.value : undefined,
          text_content: contentText.value.trim() || undefined,
        })
      } else {
        if (!editingContentId.value) throw new Error('Konten tidak valid')

        const payload = {}

        const isTypeChanged = Boolean(originalType) && nextType !== originalType
        const isReplacingFile = nextType === 'file' && Boolean(contentFile.value)
        if (isTypeChanged || isReplacingFile) payload.content_type = nextType

        const nextTitle = contentTitle.value
        if (nextTitle.trim() || editingContentOriginalTitle.value) payload.title = nextTitle

        if (nextType === 'url') {
          payload.url = contentUrl.value.trim()
          payload.text_content = contentText.value.trim()
        } else {
          payload.text_content = contentText.value
        }

        if (nextType === 'file' && contentFile.value) {
          payload.file = contentFile.value
        }

        await services.sessions.updateContent(moduleId.value, selectedSessionId.value, editingContentId.value, payload)
      }

      await loadContents()
      closeContentModal()
    } catch (e) {
      contentModalError.value = e?.message || 'Gagal menyimpan materi'
    } finally {
      contentModalLoading.value = false
    }
  }

  function openDeleteContent(c) {
    if (typeof hideContentsMenu === 'function') hideContentsMenu()
    closeContentActionsLocal()
    deleteContentItem.value = c
    deleteContentOpen.value = true
  }

  function closeDeleteContent() {
    deleteContentOpen.value = false
    deleteContentItem.value = null
    deleteContentLoading.value = false
  }

  async function confirmDeleteContent() {
    if (!deleteContentItem.value?.id || !selectedSessionId.value) return
    deleteContentLoading.value = true
    try {
      await services.sessions.deleteContent(moduleId.value, selectedSessionId.value, deleteContentItem.value.id)
      await loadContents()
    } catch (e) {
      contentsError.value = e?.message || 'Gagal menghapus materi'
    } finally {
      closeDeleteContent()
    }
  }

  async function downloadFile(content) {
    const contentId = content?.id
    if (!contentId || !selectedSessionId.value) return

    downloadStatusById[contentId] = 'loading'
    try {
      const blob = await services.sessions.downloadContentFile(moduleId.value, selectedSessionId.value, contentId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = content.fileName || `content-${contentId}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (e) {
      contentsError.value = e?.message || 'Gagal download file'
    } finally {
      downloadStatusById[contentId] = 'idle'
    }
  }

  async function viewFilePublic(content) {
    const contentId = content?.id
    if (!contentId || !selectedSessionId.value) return

    fileViewStatusById[contentId] = 'loading'
    fileViewErrorById[contentId] = ''

    try {
      const res = await services.sessions.createContentViewUrl(moduleId.value, selectedSessionId.value, contentId)
      const publicUrl = res?.data?.public_url || res?.data?.publicUrl || res?.public_url || res?.publicUrl || ''
      if (!publicUrl) throw new Error('URL view tidak tersedia')
      window.open(publicUrl, '_blank', 'noopener,noreferrer')
    } catch (e) {
      fileViewErrorById[contentId] = e?.message || 'Gagal membuka berkas'
    } finally {
      fileViewStatusById[contentId] = 'idle'
    }
  }

  async function viewFileAuthTab(content) {
    const contentId = content?.id
    if (!contentId || !selectedSessionId.value) return

    fileViewStatusById[contentId] = 'loading'
    fileViewErrorById[contentId] = ''

    try {
      const blob = await services.sessions.downloadContentFile(moduleId.value, selectedSessionId.value, contentId)
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank', 'noopener,noreferrer')
      setTimeout(() => URL.revokeObjectURL(url), 60_000)
    } catch (e) {
      fileViewErrorById[contentId] = e?.message || 'Gagal membuka berkas'
    } finally {
      fileViewStatusById[contentId] = 'idle'
    }
  }

  async function viewFile(content) {
    const kind = mediaKindFromContent(content)
    if (content?.isMedia || kind) {
      await openMediaPreview(content, kind || 'image')
      return
    }

    if (content?.shouldUsePublicViewUrl || content?.isPublicViewSupported) {
      await viewFilePublic(content)
      return
    }

    await viewFileAuthTab(content)
  }

  function resetContentsState() {
    contents.value = []
    contentsStatus.value = 'idle'
    contentsError.value = ''
    clearRecord(downloadStatusById)
    resetTransientFileStatuses()
    closeContentActionsLocal()
    closeContentModal()
    closeDeleteContent()
  }

  return {
    contents,
    contentsStatus,
    contentsError,
    downloadStatusById,
    fileViewStatusById,
    fileViewErrorById,
    contentActionsOpenId,
    contentModalOpen,
    contentModalMode,
    contentModalLoading,
    contentModalError,
    contentType,
    contentTitle,
    contentUrl,
    contentText,
    contentFile,
    contentFileInputRef,
    contentFileLabel,
    deleteContentOpen,
    deleteContentMessage,
    deleteContentLoading,
    onPickContentFile,
    triggerContentFilePicker,
    openAddContent,
    openEditContent,
    closeContentModal,
    saveContent,
    openDeleteContent,
    closeDeleteContent,
    confirmDeleteContent,
    loadContents,
    downloadFile,
    viewFile,
    toggleContentActions,
    closeContentActions: closeContentActionsLocal,
    setLockedState,
    resetContentsState,
  }
}
