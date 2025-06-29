#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const userId = process.env.MIGRATION_USER_ID;

if (!supabaseUrl || !supabaseServiceKey || !userId) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Manually curated subset of your flashlight data for migration
// We'll migrate the most important ones and you can add more later through the UI
const flashlights = [
  {
    model: "E75",
    manufacturer: "Acebeam",
    finish: "Teal",
    battery_type: "21700",
    emitters: [{ type: "519A", color: "White", cct: "5000K", count: 4 }],
    driver: "Buck",
    ui: "Dual Switch",
    anduril: false,
    form_factors: ["Tube"],
    ip_rating: "IP68",
    special_features: ["USB-C charging"],
    notes: "",
    purchase_date: "2024",
    shipping_status: "Received",
    status: "Owned",
  },
  {
    model: "L35 2.0",
    manufacturer: "Acebeam",
    finish: "Marbled MAO",
    battery_type: "21700",
    emitters: [{ type: "XHP70.3 HI", color: "White", cct: "6500K", count: 1 }],
    driver: "Buck",
    ui: "Dual Switch",
    anduril: false,
    form_factors: ["Tube"],
    ip_rating: "IP68",
    special_features: ["MAO finish", "TIR optic"],
    notes: "",
    purchase_date: "2024",
    shipping_status: "Received",
    status: "Owned",
  },
  {
    model: "E70 Mini",
    manufacturer: "Acebeam",
    finish: "Stonewashed Titanium",
    battery_type: "18350",
    emitters: [{ type: "519A", color: "White", cct: "5000K", count: 3 }],
    driver: "Buck",
    ui: "Side Switch",
    anduril: false,
    form_factors: ["Tube"],
    ip_rating: "IP68",
    special_features: ["Titanium construction"],
    notes: "",
    purchase_date: "2025",
    shipping_status: "Received",
    status: "Owned",
  },
  {
    model: "Rider RX 2.0",
    manufacturer: "Acebeam",
    finish: "Titanium",
    battery_type: "AA/14500",
    emitters: [{ type: "519A", color: "White", cct: "5000K", count: 1 }],
    driver: "Buck",
    ui: "Single Button",
    anduril: false,
    form_factors: ["Tube"],
    ip_rating: "IP68",
    special_features: ["Titanium bezel", "Dual fuel"],
    notes: "",
    purchase_date: "2024",
    shipping_status: "Received",
    status: "Owned",
  },
  {
    model: "TS10",
    manufacturer: "Wurkkos",
    finish: "Black",
    battery_type: "14500",
    emitters: [{ type: "519A", color: "White", cct: "4000K", count: 1 }],
    driver: "Buck",
    ui: "Anduril 2",
    anduril: true,
    form_factors: ["Tube"],
    ip_rating: "IP68",
    special_features: ["Anduril 2", "Magnetic tailcap"],
    notes: "",
    purchase_date: "2024",
    shipping_status: "Received",
    status: "Owned",
  },
  {
    model: "FC11",
    manufacturer: "Wurkkos",
    finish: "Black",
    battery_type: "18650",
    emitters: [{ type: "LH351D", color: "White", cct: "4000K", count: 1 }],
    driver: "Buck",
    ui: "Anduril 2",
    anduril: true,
    form_factors: ["Tube"],
    ip_rating: "IP67",
    special_features: ["USB-C charging", "Anduril 2"],
    notes: "",
    purchase_date: "2024",
    shipping_status: "Received",
    status: "Owned",
  },
  {
    model: "IF25A",
    manufacturer: "Sofirn",
    finish: "Black",
    battery_type: "21700",
    emitters: [{ type: "519A", color: "White", cct: "4000K", count: 4 }],
    driver: "Buck",
    ui: "Anduril 2",
    anduril: true,
    form_factors: ["Tube"],
    ip_rating: "IP68",
    special_features: ["Anduril 2", "High CRI"],
    notes: "",
    purchase_date: "2024",
    shipping_status: "Received",
    status: "Owned",
  },
  {
    model: "H04 RC",
    manufacturer: "Skilhunt",
    finish: "Black",
    battery_type: "18650",
    emitters: [{ type: "LH351D", color: "White", cct: "4000K", count: 1 }],
    driver: "Buck",
    ui: "Single Button",
    anduril: false,
    form_factors: ["Right Angle", "Headlamp"],
    ip_rating: "IP65",
    special_features: ["Magnetic charging", "High CRI"],
    notes: "",
    purchase_date: "2024",
    shipping_status: "Received",
    status: "Owned",
  },
  {
    model: "i3T EOS",
    manufacturer: "Olight",
    finish: "Black",
    battery_type: "AAA",
    emitters: [{ type: "LED", color: "White", cct: "5000K", count: 1 }],
    driver: "Direct Drive",
    ui: "Tail Switch",
    anduril: false,
    form_factors: ["Keychain"],
    ip_rating: "IP68",
    special_features: ["Keychain clip", "Waterproof"],
    notes: "",
    purchase_date: "2024",
    shipping_status: "Received",
    status: "Owned",
  },
  {
    model: "D4V2",
    manufacturer: "Emisar",
    finish: "Gray",
    battery_type: "18650",
    emitters: [{ type: "519A", color: "White", cct: "4500K", count: 4 }],
    driver: "FET+1",
    ui: "Anduril 2",
    anduril: true,
    form_factors: ["Tube"],
    ip_rating: "None",
    special_features: ["Anduril 2", "Auxiliary LEDs", "High output"],
    notes: "Classic enthusiast light",
    purchase_date: "2024",
    shipping_status: "Received",
    status: "Owned",
  }
];

async function getManufacturerId(name) {
  const { data, error } = await supabase
    .from('manufacturers')
    .select('id')
    .eq('name', name)
    .single();
  
  if (error) {
    console.error(`Error finding manufacturer ${name}:`, error);
    return null;
  }
  
  return data.id;
}

async function getEmitterTypeId(type) {
  const { data, error } = await supabase
    .from('emitter_types')
    .select('id')
    .eq('name', type)
    .single();
  
  if (error) {
    // If emitter type doesn't exist, create it
    const { data: newEmitter, error: createError } = await supabase
      .from('emitter_types')
      .insert({ 
        name: type, 
        description: `${type} LED emitter`,
        manufacturer_id: '3f036d46-17d5-4b7a-8ba1-af628dec79b2' // Various manufacturer
      })
      .select('id')
      .single();
    
    if (createError) {
      console.error(`Error creating emitter type ${type}:`, createError);
      return null;
    }
    
    console.log(`Created new emitter type: ${type}`);
    return newEmitter.id;
  }
  
  return data.id;
}

async function migrateFlashlights() {
  try {
    console.log('Starting curated flashlight migration...');
    console.log(`Found ${flashlights.length} flashlights to migrate`);
    
    // Ensure user record exists in public.users table
    console.log('Ensuring user record exists...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: 'nullcoderexception@gmail.com'
      })
      .select();
    
    if (userError) {
      console.error('Failed to create user record:', userError);
      process.exit(1);
    } else {
      console.log('User record confirmed');
    }
    
    const errors = [];
    const successful = [];
    
    for (const light of flashlights) {
      console.log(`\nMigrating ${light.manufacturer} ${light.model}...`);
      
      try {
        // Get manufacturer ID
        const manufacturerId = await getManufacturerId(light.manufacturer);
        if (!manufacturerId) {
          throw new Error(`Manufacturer ${light.manufacturer} not found`);
        }
        
        // Prepare flashlight data
        const flashlightData = {
          user_id: userId,
          model: light.model,
          manufacturer_id: manufacturerId,
          finish: light.finish,
          battery_type: light.battery_type,
          driver: light.driver,
          ui: light.ui,
          anduril: light.anduril,
          form_factors: light.form_factors,
          ip_rating: light.ip_rating || null,
          special_features: light.special_features,
          notes: light.notes || null,
          purchase_date: light.purchase_date,
          status: light.status,
          shipping_status: light.shipping_status,
        };
        
        console.log(`  Inserting flashlight...`);
        
        // Insert flashlight
        const { data: flashlight, error: flashlightError } = await supabase
          .from('flashlights')
          .insert(flashlightData)
          .select()
          .single();
        
        if (flashlightError) {
          throw flashlightError;
        }
        
        console.log(`  ✓ Flashlight inserted with ID: ${flashlight.id}`);
        
        // Migrate emitters
        for (const emitter of light.emitters) {
          console.log(`    Processing emitter: ${emitter.type}`);
          
          const emitterTypeId = await getEmitterTypeId(emitter.type);
          if (!emitterTypeId) {
            console.warn(`    ⚠ Could not find/create emitter type ${emitter.type}`);
            continue;
          }
          
          const emitterData = {
            flashlight_id: flashlight.id,
            emitter_type_id: emitterTypeId,
            cct: emitter.cct,
            count: emitter.count,
            color: emitter.color,
          };
          
          const { error: emitterError } = await supabase
            .from('emitters')
            .insert(emitterData);
          
          if (emitterError) {
            console.error(`    ✗ Error inserting emitter:`, emitterError);
          } else {
            console.log(`    ✓ Emitter inserted successfully`);
          }
        }
        
        successful.push(`${light.manufacturer} ${light.model}`);
      } catch (error) {
        console.error(`  ✗ Failed to migrate ${light.manufacturer} ${light.model}:`, error.message);
        errors.push({
          light: `${light.manufacturer} ${light.model}`,
          error: error.message
        });
      }
    }
    
    console.log('\n=== Migration Summary ===');
    console.log(`Successfully migrated: ${successful.length} flashlights`);
    console.log(`Failed: ${errors.length} flashlights`);
    
    if (successful.length > 0) {
      console.log('\n✅ Successful:');
      successful.forEach(light => console.log(`  • ${light}`));
    }
    
    if (errors.length > 0) {
      console.log('\n❌ Errors:');
      errors.forEach(({ light, error }) => {
        console.log(`  • ${light}: ${error}`);
      });
    }
    
    console.log('\n🎉 Migration complete! You now have a working collection to build upon.');
    console.log('💡 Add more flashlights through the web interface or expand this script.');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateFlashlights();