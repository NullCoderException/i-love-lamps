import { createClient } from '@/lib/supabase/server'

export async function authenticateRequest(request: Request) {
  console.log('🔍 authenticateRequest called for:', request.url)
  const supabase = await createClient()
  
  // Check for Bearer token in Authorization header
  const authHeader = request.headers.get('authorization')
  console.log('🔍 Auth header present:', !!authHeader)
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    console.log('🔍 Using Bearer token auth')
    const token = authHeader.substring(7)
    const { data: authData, error } = await supabase.auth.getUser(token)
    
    if (!error && authData.user) {
      console.log('🔍 Bearer auth successful for user:', authData.user.id)
      return { success: true, user: authData.user, supabase }
    }
    console.log('🔍 Bearer auth failed:', error)
    return { success: false, error: 'Invalid token' }
  }
  
  // Fall back to cookie-based auth for web UI
  console.log('🔍 Using cookie-based auth')
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      console.error('🔍 Cookie auth error:', error)
      return { success: false, error: 'Unauthorized' }
    }
    
    console.log('🔍 Cookie auth successful for user:', user.id)
    return { success: true, user, supabase }
  } catch (err) {
    console.error('🔍 Auth exception:', err)
    return { success: false, error: 'Authentication failed' }
  }
}