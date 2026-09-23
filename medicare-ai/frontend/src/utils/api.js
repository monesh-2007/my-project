export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

const TIMEOUT_MS = 75000
const HEALTH_TIMEOUT_MS = 15000
let serverWakePromise = null

function joinUrl(path) {
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE}${suffix}`
}

export async function apiFetch(path, options = {}) {
  return fetchWithTimeout(path, options, TIMEOUT_MS)
}

async function fetchWithTimeout(path, options, timeoutMs) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(joinUrl(path), {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    })
    return res
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new Error(
        'The server took too long to respond. Please try again in a moment.'
      )
    }
    throw new Error(
      'Could not reach the server. Check your connection and try again.'
    )
  } finally {
    clearTimeout(timer)
  }
}

export async function apiJson(path, options = {}) {
  if (path !== '/health') await wakeServer()

  const res = await apiFetch(path, options)
  const data = await res.json().catch(() => ({}))

  if (data?.error) {
    const errorText = String(data.error)
    if (errorText.includes('429') || /quota|rate limit/i.test(errorText)) {
      throw new Error(
        'The AI service has reached its daily limit. Please try again tomorrow or ask a healthcare professional for urgent concerns.'
      )
    }
    throw new Error(errorText)
  }

  if (!res.ok) {
    const detail = data?.detail
    const message =
      typeof detail === 'string'
        ? detail
        : `Request failed (${res.status})`
    throw new Error(message)
  }

  return data
}

export function wakeServer() {
  if (!serverWakePromise) {
    serverWakePromise = fetchWithTimeout('/health', { method: 'GET' }, HEALTH_TIMEOUT_MS)
      .then((res) => (res.ok ? res : null))
      .catch(() => null)
      .finally(() => {
        serverWakePromise = null
      })
  }

  return serverWakePromise
}
