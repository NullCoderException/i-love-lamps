import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth/api';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const supabase = createClient();

    const { data: manufacturers, error } = await supabase
      .from('manufacturers')
      .select('id, name')
      .order('name');

    if (error) {
      console.error('Error fetching manufacturers:', error);
      return NextResponse.json({ error: 'Failed to fetch manufacturers' }, { status: 500 });
    }

    return NextResponse.json(manufacturers);
  } catch (error) {
    console.error('Unexpected error fetching manufacturers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}