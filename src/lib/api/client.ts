import { createClient } from '@/lib/supabase/client-wrapper'

interface FetchOptions extends RequestInit {
  requireAuth?: boolean
}

export async function apiFetch(url: string, options: FetchOptions = {}) {
  const { requireAuth = true, ...fetchOptions } = options
  
  // Get the current session
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  const headers = new Headers(fetchOptions.headers || {})
  
  // Add auth header if we have a session
  if (requireAuth && session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`)
  }
  
  // Ensure we send cookies
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: 'include',
  })
  
  return response
}

// Lookup data API functions
export async function fetchManufacturers() {
  const response = await apiFetch('/api/manufacturers')
  if (!response.ok) {
    throw new Error('Failed to fetch manufacturers')
  }
  return response.json()
}

export async function fetchEmitterTypes() {
  const response = await apiFetch('/api/emitter-types')
  if (!response.ok) {
    throw new Error('Failed to fetch emitter types')
  }
  return response.json()
}