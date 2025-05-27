import { authenticateRequest } from '@/lib/auth/api'
import { NextResponse } from 'next/server'

// Helper to map database fields to TypeScript interface
function mapFlashlightFromDB(flashlight: Record<string, unknown>) {
  if (!flashlight) return null
  // Database already uses 'status' field, no mapping needed
  return flashlight
}

export async function GET(request: Request) {
  console.log('GET /api/flashlights - Headers:', Object.fromEntries(request.headers.entries()))
  const auth = await authenticateRequest(request)
  
  if ('error' in auth) {
    console.log('Auth failed:', auth.error)
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }
  
  const { user, supabase } = auth

  const { data: flashlights, error } = await supabase
    .from('flashlights')
    .select(`
      *,
      emitters (
        id,
        type,
        cct,
        count,
        color
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Map database fields to TypeScript interface
  const mappedFlashlights = flashlights?.map(mapFlashlightFromDB) || []
  return NextResponse.json(mappedFlashlights)
}

export async function POST(request: Request) {
  console.log('POST /api/flashlights - Headers:', Object.fromEntries(request.headers.entries()))
  const auth = await authenticateRequest(request)
  
  if ('error' in auth) {
    console.log('POST Auth failed:', auth.error)
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }
  
  const { user, supabase } = auth

  try {
    const body = await request.json()
    console.log('POST /api/flashlights - Request body:', JSON.stringify(body, null, 2))
    
    // Extract emitters from the body
    const { emitters, ...flashlightData } = body
    
    // Insert flashlight (status field is already correct in the body)
    const { data: flashlight, error: flashlightError } = await supabase
      .from('flashlights')
      .insert({
        ...flashlightData,
        user_id: user.id
      })
      .select()
      .single()

    if (flashlightError) {
      console.error('Error inserting flashlight:', flashlightError)
      return NextResponse.json({ error: flashlightError.message }, { status: 500 })
    }

    // Insert emitters if provided
    if (emitters && emitters.length > 0) {
      const emittersToInsert = emitters.map((emitter: Record<string, unknown>) => ({
        ...emitter,
        flashlight_id: flashlight.id
      }))

      console.log('Inserting emitters:', JSON.stringify(emittersToInsert, null, 2))

      const { error: emittersError } = await supabase
        .from('emitters')
        .insert(emittersToInsert)

      if (emittersError) {
        console.error('Error inserting emitters:', emittersError)
        // Rollback by deleting the flashlight
        await supabase
          .from('flashlights')
          .delete()
          .eq('id', flashlight.id)
        
        return NextResponse.json({ error: emittersError.message }, { status: 500 })
      }
    }

    // Fetch the complete flashlight with emitters
    const { data: completeFlashlight, error: fetchError } = await supabase
      .from('flashlights')
      .select(`
        *,
        emitters (
          id,
          type,
          cct,
          count,
          color
        )
      `)
      .eq('id', flashlight.id)
      .single()

    if (fetchError) {
      console.error('Error fetching complete flashlight:', fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    // Map database fields to TypeScript interface
    const mappedFlashlight = mapFlashlightFromDB(completeFlashlight)
    return NextResponse.json(mappedFlashlight, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}