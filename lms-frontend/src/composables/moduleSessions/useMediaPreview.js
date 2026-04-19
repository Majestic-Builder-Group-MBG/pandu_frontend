import { ref } from 'vue'

export function useMediaPreview() {
  const mediaPreviewOpen = ref(false)
  const mediaPreviewStatus = ref('idle')
  const mediaPreviewError = ref('')
  const mediaPreviewUrl = ref('')
  const mediaPreviewKind = ref('image')
  const mediaPreviewContent = ref(null)

  async function openMediaPreview({ content, kind, moduleId, sessionId, downloadContentFile }) {
    const contentId = content?.id
    if (!contentId || !sessionId || !moduleId || typeof downloadContentFile !== 'function') return

    closeMediaPreview()
    mediaPreviewOpen.value = true
    mediaPreviewStatus.value = 'loading'
    mediaPreviewError.value = ''
    mediaPreviewKind.value = kind
    mediaPreviewContent.value = content

    try {
      const blob = await downloadContentFile(moduleId, sessionId, contentId)
      mediaPreviewUrl.value = URL.createObjectURL(blob)
      mediaPreviewStatus.value = 'success'
    } catch (e) {
      mediaPreviewStatus.value = 'error'
      mediaPreviewError.value = e?.message || 'Gagal memuat media'
    }
  }

  function closeMediaPreview() {
    mediaPreviewOpen.value = false
    mediaPreviewStatus.value = 'idle'
    mediaPreviewError.value = ''
    mediaPreviewContent.value = null
    mediaPreviewKind.value = 'image'

    const url = mediaPreviewUrl.value
    mediaPreviewUrl.value = ''
    if (url) URL.revokeObjectURL(url)
  }

  return {
    mediaPreviewOpen,
    mediaPreviewStatus,
    mediaPreviewError,
    mediaPreviewUrl,
    mediaPreviewKind,
    mediaPreviewContent,
    openMediaPreview,
    closeMediaPreview,
  }
}
