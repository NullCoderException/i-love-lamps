import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth/api';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { supabase } = authResult;

    const { data: emitterTypes, error } = await supabase
      .from('emitter_types')
      .select('id, name')
      .order('name');

    if (error) {
      console.error('Error fetching emitter types:', error);
      return NextResponse.json({ error: 'Failed to fetch emitter types' }, { status: 500 });
    }

    return NextResponse.json(emitterTypes);
  } catch (error) {
    console.error('Unexpected error fetching emitter types:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}