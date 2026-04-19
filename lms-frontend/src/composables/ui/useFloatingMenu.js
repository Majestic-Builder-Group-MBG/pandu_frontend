import { ref } from 'vue'

export function useFloatingMenu({ preferredWidth, minWidth, estimatedHeight, margin = 8, offset = 8 }) {
  const menuOpen = ref(false)
  const menuStyle = ref({})
  const buttonRef = ref(null)
  const menuRef = ref(null)

  function updatePosition() {
    if (!buttonRef.value) return

    const rect = buttonRef.value.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const width = Math.min(preferredWidth, Math.max(minWidth, viewportWidth - margin * 2))

    let left = rect.right - width
    left = Math.max(margin, Math.min(left, viewportWidth - width - margin))

    let top = rect.bottom + offset
    if (top + estimatedHeight > viewportHeight - margin) {
      top = Math.max(margin, rect.top - estimatedHeight - offset)
    }

    menuStyle.value = {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
    }
  }

  function toggle() {
    menuOpen.value = !menuOpen.value
    if (menuOpen.value) updatePosition()
  }

  function hide() {
    menuOpen.value = false
  }

  function onDocumentClick(event) {
    if (!menuOpen.value || !menuRef.value) return
    if (!menuRef.value.contains(event.target) && !buttonRef.value?.contains(event.target)) {
      hide()
    }
  }

  function onViewportChange() {
    if (menuOpen.value) updatePosition()
  }

  return {
    menuOpen,
    menuStyle,
    buttonRef,
    menuRef,
    toggle,
    hide,
    updatePosition,
    onDocumentClick,
    onViewportChange,
  }
}
