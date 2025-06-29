#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

// Load the flashlight data from the external project
const lightsDataPath = '/Users/christopherthomas/Code/lights/packages/shared/src/data/lights.ts';

// Your API endpoint
const API_URL = process.env.API_URL || 'http://localhost:3000';
const AUTH_TOKEN = process.env.AUTH_TOKEN; // You'll need to provide this

if (!AUTH_TOKEN) {
  console.error('AUTH_TOKEN environment variable is required');
  console.log('\nTo get your auth token:');
  console.log('1. Run: node scripts/get-auth-token.js');
  console.log('2. Copy the JWT token');
  console.log('3. Add to .env.local: AUTH_TOKEN=your-jwt-token');
  process.exit(1);
}

// Enum mappings from the old project
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

async function transformFlashlightForAPI(light) {
  // Map shipping status to new schema
  let mappedShippingStatus = null;
  if (light.status === 'Owned' && light.shipping_status) {
    mappedShippingStatus = light.shipping_status === 'In Transit' ? 'Shipped' : light.shipping_status;
  }
  
  return {
    model: light.model,
    manufacturer_name: light.manufacturer,
    finish: light.finish,
    battery_type: light.battery_type,
    emitters: light.emitters,
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
}

async function migrateFlashlights() {
  try {
    console.log('Loading flashlight data...');
    const lights = await loadFlashlightData();
    console.log(`Found ${lights.length} flashlights to migrate`);
    
    // Transform flashlights for API
    const transformedFlashlights = [];
    for (const light of lights) {
      const transformed = await transformFlashlightForAPI(light);
      transformedFlashlights.push(transformed);
    }
    
    // Send to API in batches (to avoid overwhelming the server)
    const BATCH_SIZE = 10;
    let totalSuccessful = 0;
    let totalFailed = 0;
    
    for (let i = 0; i < transformedFlashlights.length; i += BATCH_SIZE) {
      const batch = transformedFlashlights.slice(i, i + BATCH_SIZE);
      console.log(`\nProcessing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(transformedFlashlights.length / BATCH_SIZE)}`);
      
      try {
        const response = await fetch(`${API_URL}/api/flashlights/bulk`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ flashlights: batch }),
        });
        
        if (!response.ok) {
          const error = await response.text();
          throw new Error(`API error: ${response.status} - ${error}`);
        }
        
        const result = await response.json();
        totalSuccessful += result.summary.successful;
        totalFailed += result.summary.failed;
        
        if (result.results.failed.length > 0) {
          console.log('Failed in this batch:');
          result.results.failed.forEach(failure => {
            console.log(`- ${failure.manufacturer} ${failure.model}: ${failure.error}`);
          });
        }
      } catch (error) {
        console.error('Batch failed:', error.message);
        totalFailed += batch.length;
      }
    }
    
    console.log('\n=== Migration Summary ===');
    console.log(`Successfully migrated: ${totalSuccessful} flashlights`);
    console.log(`Failed: ${totalFailed} flashlights`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateFlashlights();