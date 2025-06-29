const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkEnumValues() {
  // First, let's check what values are actually in the database
  const { data: flashlights, error } = await supabase
    .from('flashlights')
    .select('id, status, shipping_status')
    .limit(5)
  
  if (error) {
    console.error('Error fetching flashlights:', error)
    return
  }
  
  console.log('Sample flashlights from database:')
  console.log(JSON.stringify(flashlights, null, 2))
}

checkEnumValues()