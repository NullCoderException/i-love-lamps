const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

(async () => {
  // Try different table names
  const possibleTables = ['emitters', 'flashlight_emitter', 'emitter_flashlights'];
  
  for (const tableName of possibleTables) {
    console.log(`Trying table: ${tableName}`);
    const { data, error } = await supabase.from(tableName).select('*').limit(1);
    if (!error) {
      console.log(`Found table ${tableName} with structure:`, data);
    } else {
      console.log(`Table ${tableName} not found or error:`, error.message);
    }
  }
})();