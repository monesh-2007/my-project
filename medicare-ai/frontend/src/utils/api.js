export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

const TIMEOUT_MS = 75000

function joinUrl(path) {
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE}${suffix}`
}

export async function apiFetch(path, options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

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
  const res = await apiFetch(path, options)
  const data = await res.json().catch(() => ({}))

  if (data?.error) {
    throw new Error(data.error)
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
  return apiFetch('/health', { method: 'GET' }).catch(() => null)
}
