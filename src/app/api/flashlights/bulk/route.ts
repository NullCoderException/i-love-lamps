import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth/api';
import { createServerClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Schema for bulk import data
const BulkFlashlightSchema = z.object({
  model: z.string(),
  manufacturer_name: z.string(), // We'll look up the ID
  finish: z.string(),
  battery_type: z.string(),
  emitters: z.array(z.object({
    type: z.string(),
    cct: z.string().nullable(),
    count: z.number(),
    color: z.string(),
  })),
  driver: z.string(),
  ui: z.string(),
  anduril: z.boolean(),
  form_factors: z.array(z.string()),
  ip_rating: z.string().nullable(),
  special_features: z.array(z.string()),
  notes: z.string().nullable(),
  purchase_date: z.string(),
  status: z.enum(['Wanted', 'Ordered', 'Owned', 'Sold']),
  shipping_status: z.enum(['Received', 'Shipped', 'Ordered']).nullable(),
});

const BulkImportSchema = z.object({
  flashlights: z.array(BulkFlashlightSchema),
});

export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createServerClient();
    
    // Parse and validate the request body
    const body = await request.json();
    const validationResult = BulkImportSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data format', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { flashlights } = validationResult.data;
    const results = {
      successful: [],
      failed: [],
    };

    // Get all manufacturers for lookup
    const { data: manufacturers, error: manufacturersError } = await supabase
      .from('manufacturers')
      .select('id, name');
    
    if (manufacturersError) {
      return NextResponse.json(
        { error: 'Failed to fetch manufacturers' },
        { status: 500 }
      );
    }

    const manufacturerMap = new Map(
      manufacturers.map(m => [m.name, m.id])
    );

    // Get all emitter types for lookup
    const { data: emitterTypes } = await supabase
      .from('emitter_types')
      .select('id, type');
    
    const emitterTypeMap = new Map(
      emitterTypes?.map(e => [e.type, e.id]) || []
    );

    // Process each flashlight
    for (const flashlight of flashlights) {
      try {
        // Get manufacturer ID
        const manufacturerId = manufacturerMap.get(flashlight.manufacturer_name);
        if (!manufacturerId) {
          throw new Error(`Unknown manufacturer: ${flashlight.manufacturer_name}`);
        }

        // Prepare flashlight data
        const flashlightData = {
          user_id: authResult.user.id,
          model: flashlight.model,
          manufacturer_id: manufacturerId,
          finish: flashlight.finish,
          battery_type: flashlight.battery_type,
          driver: flashlight.driver,
          ui: flashlight.ui,
          anduril: flashlight.anduril,
          form_factors: flashlight.form_factors,
          ip_rating: flashlight.ip_rating,
          special_features: flashlight.special_features,
          notes: flashlight.notes,
          purchase_date: flashlight.purchase_date,
          status: flashlight.status,
          shipping_status: flashlight.shipping_status,
        };

        // Insert flashlight
        const { data: newFlashlight, error: flashlightError } = await supabase
          .from('flashlights')
          .insert(flashlightData)
          .select()
          .single();

        if (flashlightError) {
          throw flashlightError;
        }

        // Process emitters
        for (const emitter of flashlight.emitters) {
          let emitterTypeId = emitterTypeMap.get(emitter.type);
          
          // Create emitter type if it doesn't exist
          if (!emitterTypeId) {
            const { data: newEmitterType, error: emitterTypeError } = await supabase
              .from('emitter_types')
              .insert({ 
                type: emitter.type, 
                description: `${emitter.type} LED emitter` 
              })
              .select('id')
              .single();
            
            if (emitterTypeError) {
              console.error(`Failed to create emitter type ${emitter.type}:`, emitterTypeError);
              continue;
            }
            
            emitterTypeId = newEmitterType.id;
            emitterTypeMap.set(emitter.type, emitterTypeId);
          }

          // Insert emitter
          const { error: emitterError } = await supabase
            .from('flashlight_emitters')
            .insert({
              flashlight_id: newFlashlight.id,
              emitter_type_id: emitterTypeId,
              cct: emitter.cct,
              count: emitter.count,
              color: emitter.color,
            });

          if (emitterError) {
            console.error(`Failed to insert emitter for ${flashlight.model}:`, emitterError);
          }
        }

        results.successful.push({
          model: flashlight.model,
          manufacturer: flashlight.manufacturer_name,
          id: newFlashlight.id,
        });
      } catch (error) {
        results.failed.push({
          model: flashlight.model,
          manufacturer: flashlight.manufacturer_name,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      message: 'Bulk import completed',
      summary: {
        total: flashlights.length,
        successful: results.successful.length,
        failed: results.failed.length,
      },
      results,
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}