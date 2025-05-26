import { createClient } from '@/lib/supabase/server'

export async function authenticateRequest(request: Request) {
  const supabase = await createClient()
  
  // Check for Bearer token in Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    const { data: authData, error } = await supabase.auth.getUser(token)
    
    if (!error && authData.user) {
      return { user: authData.user, supabase }
    }
    return { error: 'Invalid token' }
  }
  
  // Fall back to cookie-based auth for web UI
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      console.error('Cookie auth error:', error)
      return { error: 'Unauthorized' }
    }
    
    return { user, supabase }
  } catch (err) {
    console.error('Auth exception:', err)
    return { error: 'Authentication failed' }
  }
}