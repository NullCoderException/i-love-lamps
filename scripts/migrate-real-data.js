#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs').promises;

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const userId = process.env.MIGRATION_USER_ID;

if (!supabaseUrl || !supabaseServiceKey || !userId) {
  console.error('Missing required environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY, MIGRATION_USER_ID');
  console.error('Optional: LIGHTS_DATA_PATH (defaults to /Users/christopherthomas/Code/lights/packages/shared/src/data)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Load the flashlight data from the external project using require
const lightsDataPath = process.env.LIGHTS_DATA_PATH || '/Users/christopherthomas/Code/lights/packages/shared/src/data';

async function loadFlashlightData() {
  try {
    // Read the TypeScript file
    const tsFilePath = path.join(lightsDataPath, 'lights.ts');
    const content = await fs.readFile(tsFilePath, 'utf-8');
    
    // Extract the entire lights array more reliably
    const startIndex = content.indexOf('export const lights: Flashlight[] = [');
    if (startIndex === -1) {
      throw new Error('Could not find lights array start in TypeScript file');
    }
    
    const arrayStart = content.indexOf('[', startIndex);
    
    // Find the end pattern "];
    const endPattern = '];';
    let searchStart = arrayStart;
    let arrayEnd = -1;
    
    // Look for ]; pattern, making sure it's the end of the array
    while (true) {
      const foundIndex = content.indexOf(endPattern, searchStart);
      if (foundIndex === -1) break;
      
      // Check if this is likely the end of our array (should be near end of file)
      const remainingContent = content.substring(foundIndex + 2).trim();
      if (remainingContent === '' || remainingContent.startsWith('//') || remainingContent.startsWith('\n')) {
        arrayEnd = foundIndex;
        break;
      }
      
      searchStart = foundIndex + 1;
    }
    
    let arrayContent = content.substring(arrayStart, arrayEnd + 1);
    
    // Create enum mappings
    const enumMappings = {
      'Manufacturer.ACEBEAM': '"Acebeam"',
      'Manufacturer.WURKKOS': '"Wurkkos"', 
      'Manufacturer.SOFIRN': '"Sofirn"',
      'Manufacturer.SKILHUNT': '"Skilhunt"',
      'Manufacturer.OLIGHT': '"Olight"',
      'Manufacturer.NITECORE': '"Nitecore"',
      'Manufacturer.CONVOY': '"Convoy"',
      'Manufacturer.EMISAR': '"Emisar"',
      'Manufacturer.FIREFLIES': '"Fireflies"',
      'Manufacturer.REYLIGHT': '"Reylight"',
      'Manufacturer.MODLITE': '"Modlite"',
      'FinishGroup.MAO': '"MAO"',
      'FinishGroup.ANODIZED': '"Anodized"', 
      'FinishGroup.TITANIUM': '"Titanium"',
      'FinishGroup.COPPER': '"Copper"',
      'FinishGroup.COPPER_TITANIUM': '"Copper+Titanium"',
      'FinishGroup.STAINLESS_STEEL': '"Stainless Steel"',
      'FinishGroup.BRASS': '"Brass"',
      'BatteryType.AA': '"AA"',
      'BatteryType.AAA': '"AAA"',
      'BatteryType.FOURTEEN500': '"14500"',
      'BatteryType.EIGHTEEN350': '"18350"', 
      'BatteryType.EIGHTEEN650': '"18650"',
      'BatteryType.QUAD_EIGHTEEN650': '"4x 18650"',
      'BatteryType.TWENTY1700': '"21700"',
      'BatteryType.TRIPLE_TWENTY1700': '"3x 21700"',
      'BatteryType.DUAL_FUEL_AA': '"AA/14500"',
      'BatteryType.DUAL_FUEL_AAA': '"AAA/10440"',
      'BatteryType.BUILT_IN': '"Built-in"',
      'ShippingStatus.RECEIVED': '"Received"',
      'ShippingStatus.IN_TRANSIT': '"Shipped"', 
      'ShippingStatus.ORDERED': '"Ordered"',
      'EmitterColor.WHITE': '"White"',
      'EmitterColor.RED': '"Red"',
      'EmitterColor.GREEN': '"Green"', 
      'EmitterColor.BLUE': '"Blue"',
      'EmitterColor.UV': '"UV"',
      'EmitterColor.RGB': '"RGB"',
      'EmitterColor.LASER_GREEN': '"Green Laser"',
      'EmitterColor.LASER_RED': '"Red Laser"',
      'FlashlightStatus.NEW': '"Owned"',
      'FlashlightStatus.ACTIVE': '"Owned"',
      'FlashlightStatus.STORAGE': '"Owned"', 
      'FlashlightStatus.GIFTED': '"Sold"',
      'FlashlightStatus.RETIRED': '"Owned"',
      'FormFactor.TUBE': '"Tube"',
      'FormFactor.RIGHT_ANGLE': '"Right Angle"',
      'FormFactor.HEADLAMP': '"Headlamp"',
      'FormFactor.FLAT': '"Flat"',
      'FormFactor.COMPACT': '"Compact"', 
      'FormFactor.KEYCHAIN': '"Keychain"',
      'FormFactor.MULTI_FUNCTION': '"Multi-Function"',
      'FormFactor.LANTERN': '"Lantern"',
      'IPRating.NONE': '"None"',
      'IPRating.IPX4': '"IPX4"',
      'IPRating.IPX5': '"IPX5"',
      'IPRating.IPX6': '"IPX6"', 
      'IPRating.IPX7': '"IPX7"',
      'IPRating.IPX8': '"IPX8"',
      'IPRating.IP54': '"IP54"',
      'IPRating.IP55': '"IP55"',
      'IPRating.IP65': '"IP65"',
      'IPRating.IP66': '"IP66"',
      'IPRating.IP67': '"IP67"', 
      'IPRating.IP68': '"IP68"'
    };
    
    // Replace all enum references with actual values
    // Sort by length descending to avoid partial replacements
    const sortedMappings = Object.entries(enumMappings).sort((a, b) => b[0].length - a[0].length);
    
    for (const [enumRef, value] of sortedMappings) {
      // Use word boundaries to ensure we don't replace partial matches
      const regex = new RegExp('\\b' + enumRef.replace('.', '\\.') + '\\b', 'g');
      arrayContent = arrayContent.replace(regex, value);
    }
    
    // Write to a temporary file and evaluate it
    const tempFile = path.join(__dirname, 'temp-lights-data.js');
    const executableCode = `module.exports = ${arrayContent};`;
    
    await fs.writeFile(tempFile, executableCode);
    
    // Clear require cache and load the data
    delete require.cache[require.resolve('./temp-lights-data.js')];
    const lights = require('./temp-lights-data.js');
    
    // Clean up temp file
    await fs.unlink(tempFile);
    
    console.log(`Loaded ${lights.length} flashlights from TypeScript file`);
    return lights;
    
  } catch (error) {
    console.error('Error loading flashlight data:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  }
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
    console.log('Loading your real flashlight data...');
    const lights = await loadFlashlightData();
    
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
    
    for (const light of lights) {
      console.log(`\nMigrating ${light.manufacturer} ${light.model}...`);
      
      try {
        // Get manufacturer ID
        const manufacturerId = await getManufacturerId(light.manufacturer);
        if (!manufacturerId) {
          throw new Error(`Manufacturer ${light.manufacturer} not found`);
        }
        
        // Map shipping status (handle the enum conversion)
        let mappedShippingStatus = null;
        if (light.shipping_status) {
          mappedShippingStatus = light.shipping_status === 'In Transit' ? 'Shipped' : light.shipping_status;
        }
        
        // Prepare flashlight data (skip finish_group since we don't use it)
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
    
    console.log(`\n🎉 Migration complete! Migrated ${successful.length} of your real flashlights.`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateFlashlights();