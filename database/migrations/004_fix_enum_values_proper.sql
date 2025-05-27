-- Migration: Update enum values to match new TypeScript definitions
-- This carefully handles the transition from old to new enum values

-- Step 1: Create new enum types with the values we want
CREATE TYPE flashlight_status_new AS ENUM ('Wanted', 'Ordered', 'Owned', 'Sold');
CREATE TYPE shipping_status_new AS ENUM ('Received', 'Shipped', 'Ordered');

-- Step 2: Add temporary text columns
ALTER TABLE flashlights ADD COLUMN status_temp TEXT;
ALTER TABLE flashlights ADD COLUMN shipping_status_temp TEXT;

-- Step 3: Copy and transform the data to temporary columns
UPDATE flashlights 
SET status_temp = CASE 
    WHEN status::text = 'New' THEN 'Wanted'
    WHEN status::text = 'Active' THEN 'Owned'
    WHEN status::text = 'Storage' THEN 'Owned'
    WHEN status::text = 'Gifted' THEN 'Sold'
    WHEN status::text = 'Retired' THEN 'Sold'
    ELSE 'Wanted'  -- Default fallback
END;

UPDATE flashlights
SET shipping_status_temp = CASE
    WHEN shipping_status::text = 'In Transit' THEN 'Shipped'
    WHEN shipping_status::text = 'Received' THEN 'Received'
    WHEN shipping_status::text = 'Ordered' THEN 'Ordered'
    ELSE 'Received'  -- Default fallback
END;

-- Step 4: Drop the old enum columns
ALTER TABLE flashlights DROP COLUMN status;
ALTER TABLE flashlights DROP COLUMN shipping_status;

-- Step 5: Add new columns with new enum types
ALTER TABLE flashlights ADD COLUMN status flashlight_status_new;
ALTER TABLE flashlights ADD COLUMN shipping_status shipping_status_new;

-- Step 6: Copy data from temp columns to new enum columns
UPDATE flashlights 
SET status = status_temp::flashlight_status_new,
    shipping_status = shipping_status_temp::shipping_status_new;

-- Step 7: Drop temporary columns
ALTER TABLE flashlights DROP COLUMN status_temp;
ALTER TABLE flashlights DROP COLUMN shipping_status_temp;

-- Step 8: Set NOT NULL constraints
ALTER TABLE flashlights ALTER COLUMN status SET NOT NULL;
ALTER TABLE flashlights ALTER COLUMN shipping_status SET NOT NULL;

-- Step 9: Set default values
ALTER TABLE flashlights ALTER COLUMN status SET DEFAULT 'Wanted'::flashlight_status_new;
ALTER TABLE flashlights ALTER COLUMN shipping_status SET DEFAULT 'Received'::shipping_status_new;

-- Step 10: Drop old enum types
DROP TYPE flashlight_status;
DROP TYPE shipping_status;

-- Step 11: Rename new types to standard names
ALTER TYPE flashlight_status_new RENAME TO flashlight_status;
ALTER TYPE shipping_status_new RENAME TO shipping_status;