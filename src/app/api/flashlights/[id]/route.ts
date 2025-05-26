import { authenticateRequest } from '@/lib/auth/api'
import { NextResponse } from 'next/server'

// Helper to map database fields to TypeScript interface
function mapFlashlightFromDB(flashlight: any) {
  if (!flashlight) return null
  // Database already uses 'status' field, no mapping needed
  return flashlight
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateRequest(request)
  
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }
  
  const { user, supabase } = auth

  const { data: flashlight, error } = await supabase
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
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Flashlight not found' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Map database fields to TypeScript interface
  const mappedFlashlight = mapFlashlightFromDB(flashlight)
  return NextResponse.json(mappedFlashlight)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateRequest(request)
  
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }
  
  const { user, supabase } = auth

  try {
    const body = await request.json()
    const { emitters, ...flashlightData } = body

    // Update flashlight (status field is already correct in the body)
    const { data: flashlight, error: flashlightError } = await supabase
      .from('flashlights')
      .update(flashlightData)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (flashlightError) {
      if (flashlightError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Flashlight not found' }, { status: 404 })
      }
      return NextResponse.json({ error: flashlightError.message }, { status: 500 })
    }

    // Handle emitters update if provided
    if (emitters !== undefined) {
      // Delete existing emitters
      await supabase
        .from('emitters')
        .delete()
        .eq('flashlight_id', params.id)

      // Insert new emitters
      if (emitters && emitters.length > 0) {
        const emittersToInsert = emitters.map((emitter: any) => ({
          ...emitter,
          flashlight_id: params.id
        }))

        const { error: emittersError } = await supabase
          .from('emitters')
          .insert(emittersToInsert)

        if (emittersError) {
          return NextResponse.json({ error: emittersError.message }, { status: 500 })
        }
      }
    }

    // Fetch the complete updated flashlight
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
      .eq('id', params.id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    // Map database fields to TypeScript interface
    const mappedFlashlight = mapFlashlightFromDB(completeFlashlight)
    return NextResponse.json(mappedFlashlight)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateRequest(request)
  
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }
  
  const { user, supabase } = auth

  const { error } = await supabase
    .from('flashlights')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id)

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Flashlight not found' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Flashlight deleted successfully' })
}