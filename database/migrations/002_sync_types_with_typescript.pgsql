--postgresql
-- Update types to match TypeScript definitions

-- Update the manufacturer enum to add Reylight and fix Sofirn spelling
BEGIN;

-- Step 1: Rename existing type to temporary
ALTER TYPE manufacturer RENAME TO manufacturer_old;

-- Step 2: Create new type with correct values matching TypeScript
CREATE TYPE manufacturer AS ENUM (
  'Acebeam', 'Wurkkos', 'Sofrin', 'Skilhunt', 
  'Olight', 'Nitecore', 'Convoy', 'Emisar', 'Fireflies', 'Reylight'
);

-- Step 3: Update the table to use new type, converting Sofirn to Sofrin
ALTER TABLE flashlights 
  ALTER COLUMN manufacturer TYPE manufacturer 
  USING CASE 
    WHEN manufacturer::text = 'Sofirn' THEN 'Sofrin'::manufacturer
    ELSE manufacturer::text::manufacturer
  END;

-- Step 4: Drop the old type
DROP TYPE manufacturer_old;

COMMIT;

-- Add missing finish group values that are in TypeScript but not in database
ALTER TYPE finish_group ADD VALUE IF NOT EXISTS 'Stainless Steel';
ALTER TYPE finish_group ADD VALUE IF NOT EXISTS 'Brass';

-- Add table comments to document the TypeScript interfaces
COMMENT ON TABLE flashlights IS 'Main flashlight table - corresponds to Flashlight interface';
COMMENT ON TABLE emitters IS 'Emitter details - corresponds to Emitter interface';
COMMENT ON TABLE user_preferences IS 'User preferences - corresponds to UserPreferences interface';
COMMENT ON TABLE flashlight_manuals IS 'Flashlight manuals with embeddings - corresponds to FlashlightManual interface';

-- Add column comments to clarify nullable fields
COMMENT ON COLUMN flashlights.notes IS 'Optional notes about the flashlight';
COMMENT ON COLUMN emitters.cct IS 'Color temperature - null for non-white emitters';