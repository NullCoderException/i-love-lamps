import { authenticateRequest } from '@/lib/auth/api'
import { NextResponse } from 'next/server'

// Helper to map database fields to TypeScript interface
function mapFlashlightFromDB(flashlight: any) {
  if (!flashlight) return null
  
  // Map the database structure to frontend expectations
  const mapped = {
    ...flashlight,
    // Map manufacturer object to manufacturer name
    manufacturer: flashlight.manufacturers?.name || flashlight.custom_manufacturer || '',
    // Map emitters with proper type field
    emitters: flashlight.emitters?.map((emitter: any) => ({
      ...emitter,
      type: emitter.emitter_types?.name || emitter.custom_emitter_type || ''
    })) || []
  }
  
  // Remove the nested manufacturer and emitter_types objects since we've flattened them
  delete mapped.manufacturers
  if (mapped.emitters) {
    mapped.emitters.forEach((emitter: any) => {
      delete emitter.emitter_types
      delete emitter.emitter_type_id
      delete emitter.custom_emitter_type
    })
  }
  
  return mapped
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
      manufacturers (
        id,
        name
      ),
      emitters (
        id,
        emitter_type_id,
        custom_emitter_type,
        cct,
        count,
        color,
        emitter_types (
          name
        )
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
    
    // Extract emitters from the body and handle manufacturer lookup
    const { emitters, manufacturer, ...flashlightData } = body
    
    // Look up manufacturer ID if provided
    let manufacturer_id = null
    let custom_manufacturer = null
    
    if (manufacturer) {
      const { data: mfgData } = await supabase
        .from('manufacturers')
        .select('id')
        .eq('name', manufacturer)
        .single()
      
      if (mfgData) {
        manufacturer_id = mfgData.id
      } else {
        custom_manufacturer = manufacturer
      }
    }
    
    // Insert flashlight with proper manufacturer handling
    const { data: flashlight, error: flashlightError } = await supabase
      .from('flashlights')
      .insert({
        ...flashlightData,
        manufacturer_id,
        custom_manufacturer,
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
      const emittersToInsert = await Promise.all(emitters.map(async (emitter: any) => {
        let emitter_type_id = null
        let custom_emitter_type = null
        
        if (emitter.type) {
          const { data: typeData } = await supabase
            .from('emitter_types')
            .select('id')
            .eq('name', emitter.type)
            .single()
          
          if (typeData) {
            emitter_type_id = typeData.id
          } else {
            custom_emitter_type = emitter.type
          }
        }
        
        return {
          flashlight_id: flashlight.id,
          emitter_type_id,
          custom_emitter_type,
          cct: emitter.cct,
          count: emitter.count,
          color: emitter.color
        }
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
        manufacturers (
          id,
          name
        ),
        emitters (
          id,
          emitter_type_id,
          custom_emitter_type,
          cct,
          count,
          color,
          emitter_types (
            name
          )
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