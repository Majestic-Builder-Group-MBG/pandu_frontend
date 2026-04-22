export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.2:8001').replace(/\/+$/, '')
export const VAPID_PUBLIC_KEY = String(import.meta.env.VITE_VAPID_PUBLIC_KEY || '').trim()
