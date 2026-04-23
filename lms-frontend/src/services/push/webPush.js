import { VAPID_PUBLIC_KEY } from '@/config/env'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function getPlatformLabel() {
  if (typeof navigator === 'undefined') return 'web'
  const ua = navigator.userAgent || ''
  if (/Edg\//i.test(ua)) return 'edge-desktop'
  if (/Chrome\//i.test(ua)) return 'chrome-desktop'
  if (/Firefox\//i.test(ua)) return 'firefox-desktop'
  if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) return 'safari'
  return 'web'
}

export function isWebPushSupported() {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

export async function ensureServiceWorker() {
  if (!isWebPushSupported()) throw new Error('Web Push tidak didukung browser ini')
  const reg = await navigator.serviceWorker.register('/sw.js')
  await navigator.serviceWorker.ready
  return reg
}

export async function requestNotificationPermission() {
  if (!isWebPushSupported()) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  const result = await Notification.requestPermission()
  return result
}

export async function subscribeBrowserPush() {
  if (!VAPID_PUBLIC_KEY) throw new Error('VAPID public key belum diset (VITE_VAPID_PUBLIC_KEY)')
  const reg = await ensureServiceWorker()
  const existing = await reg.pushManager.getSubscription()
  if (existing) return existing

  return reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  })
}

export async function unsubscribeBrowserPush() {
  const reg = await ensureServiceWorker()
  const existing = await reg.pushManager.getSubscription()
  if (!existing) return null
  const endpoint = existing.endpoint
  await existing.unsubscribe()
  return endpoint
}

export function buildPushSubscriptionPayload(subscription) {
  const json = subscription?.toJSON?.() || subscription
  return {
    subscription: json,
    platform: getPlatformLabel(),
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  }
}
