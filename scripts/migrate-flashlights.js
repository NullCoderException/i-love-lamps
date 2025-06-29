#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs').promises;

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('SUPABASE_SERVICE_KEY:', supabaseServiceKey ? 'Set' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Load the flashlight data from the external project
const lightsDataPath = '/Users/christopherthomas/Code/lights/packages/shared/src/data/lights.ts';

// Enum mappings from the old project
const BatteryType = {
  AA: "AA",
  AAA: "AAA",
  FOURTEEN500: "14500",
  EIGHTEEN350: "18350",
  EIGHTEEN650: "18650",
  QUAD_EIGHTEEN650: "4x 18650",
  TWENTY1700: "21700",
  TRIPLE_TWENTY1700: "3x 21700",
  DUAL_FUEL_AA: "AA/14500",
  DUAL_FUEL_AAA: "AAA/10440",
  BUILT_IN: "Built-in",
};

const Manufacturer = {
  ACEBEAM: "Acebeam",
  WURKKOS: "Wurkkos",
  SOFIRN: "Sofrin",
  SKILHUNT: "Skilhunt",
  OLIGHT: "Olight",
  NITECORE: "Nitecore",
  CONVOY: "Convoy",
  EMISAR: "Emisar",
  FIREFLIES: "Fireflies",
  REYLIGHT: "Reylight",
};

const FinishGroup = {
  MAO: "MAO",
  ANODIZED: "Anodized",
  TITANIUM: "Titanium",
  COPPER: "Copper",
  COPPER_TITANIUM: "Copper+Titanium",
  STAINLESS_STEEL: "Stainless Steel",
  BRASS: "Brass",
};

const ShippingStatus = {
  RECEIVED: "Received",
  IN_TRANSIT: "Shipped",
  ORDERED: "Ordered",
};

const EmitterColor = {
  WHITE: "White",
  RED: "Red",
  GREEN: "Green",
  BLUE: "Blue",
  UV: "UV",
  RGB: "RGB",
  LASER_GREEN: "Green Laser",
  LASER_RED: "Red Laser",
};

const FlashlightStatus = {
  NEW: "Owned",
  ACTIVE: "Owned",
  STORAGE: "Owned",
  GIFTED: "Sold",
  RETIRED: "Owned",
};

const FormFactor = {
  TUBE: "Tube",
  RIGHT_ANGLE: "Right Angle",
  HEADLAMP: "Headlamp",
  FLAT: "Flat",
  COMPACT: "Compact",
  KEYCHAIN: "Keychain",
  MULTI_FUNCTION: "Multi-Function",
  LANTERN: "Lantern",
};

const IPRating = {
  NONE: "None",
  IPX4: "IPX4",
  IPX5: "IPX5",
  IPX6: "IPX6",
  IPX7: "IPX7",
  IPX8: "IPX8",
  IP54: "IP54",
  IP55: "IP55",
  IP65: "IP65",
  IP66: "IP66",
  IP67: "IP67",
  IP68: "IP68",
};

async function loadFlashlightData() {
  const fileContent = await fs.readFile(lightsDataPath, 'utf-8');
  
  // Extract the lights array from the TypeScript file
  const lightsMatch = fileContent.match(/export const lights: Flashlight\[\] = (\[[\s\S]*\]);/);
  if (!lightsMatch) {
    throw new Error('Could not find lights array in the file');
  }
  
  // Clean up the TypeScript syntax to make it valid JSON
  let lightsString = lightsMatch[1];
  
  // Replace enum references with their string values
  Object.entries(Manufacturer).forEach(([key, value]) => {
    lightsString = lightsString.replace(new RegExp(`Manufacturer\\.${key}`, 'g'), `"${value}"`);
  });
  
  Object.entries(FinishGroup).forEach(([key, value]) => {
    lightsString = lightsString.replace(new RegExp(`FinishGroup\\.${key}`, 'g'), `"${value}"`);
  });
  
  Object.entries(BatteryType).forEach(([key, value]) => {
    lightsString = lightsString.replace(new RegExp(`BatteryType\\.${key}`, 'g'), `"${value}"`);
  });
  
  Object.entries(EmitterColor).forEach(([key, value]) => {
    lightsString = lightsString.replace(new RegExp(`EmitterColor\\.${key}`, 'g'), `"${value}"`);
  });
  
  Object.entries(FormFactor).forEach(([key, value]) => {
    lightsString = lightsString.replace(new RegExp(`FormFactor\\.${key}`, 'g'), `"${value}"`);
  });
  
  Object.entries(IPRating).forEach(([key, value]) => {
    lightsString = lightsString.replace(new RegExp(`IPRating\\.${key}`, 'g'), `"${value}"`);
  });
  
  Object.entries(ShippingStatus).forEach(([key, value]) => {
    lightsString = lightsString.replace(new RegExp(`ShippingStatus\\.${key}`, 'g'), `"${value}"`);
  });
  
  Object.entries(FlashlightStatus).forEach(([key, value]) => {
    lightsString = lightsString.replace(new RegExp(`FlashlightStatus\\.${key}`, 'g'), `"${value}"`);
  });
  
  // Remove trailing commas and fix null values
  lightsString = lightsString.replace(/,\s*}/g, '}');
  lightsString = lightsString.replace(/,\s*]/g, ']');
  lightsString = lightsString.replace(/:\s*null/g, ': null');
  
  // Remove comments
  lightsString = lightsString.replace(/\/\/.*$/gm, '');
  lightsString = lightsString.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Parse the cleaned JSON
  const lights = JSON.parse(lightsString);
  
  return lights;
}

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
    .eq('type', type)
    .single();
  
  if (error) {
    // If emitter type doesn't exist, create it
    const { data: newEmitter, error: createError } = await supabase
      .from('emitter_types')
      .insert({ type, description: `${type} LED emitter` })
      .select('id')
      .single();
    
    if (createError) {
      console.error(`Error creating emitter type ${type}:`, createError);
      return null;
    }
    
    return newEmitter.id;
  }
  
  return data.id;
}

async function migrateFlashlights() {
  try {
    console.log('Loading flashlight data...');
    const lights = await loadFlashlightData();
    console.log(`Found ${lights.length} flashlights to migrate`);
    
    const errors = [];
    const successful = [];
    
    // For migration, we'll use the service key which bypasses RLS
    // You'll need to provide a user ID for the flashlights
    const userId = process.env.MIGRATION_USER_ID;
    
    if (!userId) {
      console.error('MIGRATION_USER_ID environment variable is required');
      console.log('\nTo get your user ID:');
      console.log('1. Log into your app');
      console.log('2. Run this in the browser console:');
      console.log('   (await supabase.auth.getUser()).data.user.id');
      console.log('3. Add to .env.local: MIGRATION_USER_ID=your-user-id');
      process.exit(1);
    }
    
    for (const light of lights) {
      console.log(`Migrating ${light.manufacturer} ${light.model}...`);
      
      try {
        // Get manufacturer ID
        const manufacturerId = await getManufacturerId(light.manufacturer);
        if (!manufacturerId) {
          throw new Error(`Manufacturer ${light.manufacturer} not found`);
        }
        
        // Map shipping status to new schema
        let mappedShippingStatus = null;
        if (light.status === 'Owned' && light.shipping_status) {
          mappedShippingStatus = light.shipping_status === 'In Transit' ? 'Shipped' : light.shipping_status;
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
          shipping_status: mappedShippingStatus,
        };
        
        // Insert flashlight
        const { data: flashlight, error: flashlightError } = await supabase
          .from('flashlights')
          .insert(flashlightData)
          .select()
          .single();
        
        if (flashlightError) {
          throw flashlightError;
        }
        
        // Migrate emitters
        for (const emitter of light.emitters) {
          const emitterTypeId = await getEmitterTypeId(emitter.type);
          if (!emitterTypeId) {
            console.warn(`Could not find/create emitter type ${emitter.type}`);
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
            .from('flashlight_emitters')
            .insert(emitterData);
          
          if (emitterError) {
            console.error(`Error inserting emitter for ${light.model}:`, emitterError);
          }
        }
        
        successful.push(`${light.manufacturer} ${light.model}`);
      } catch (error) {
        errors.push({
          light: `${light.manufacturer} ${light.model}`,
          error: error.message
        });
      }
    }
    
    console.log('\n=== Migration Summary ===');
    console.log(`Successfully migrated: ${successful.length} flashlights`);
    console.log(`Failed: ${errors.length} flashlights`);
    
    if (errors.length > 0) {
      console.log('\nErrors:');
      errors.forEach(({ light, error }) => {
        console.log(`- ${light}: ${error}`);
      });
    }
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateFlashlights();