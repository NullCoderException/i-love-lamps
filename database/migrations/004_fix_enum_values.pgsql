-- Migration: Update enum values to match new TypeScript definitions
-- This updates the database enums from old values to new values

-- First, update any existing data to use temporary values to avoid conflicts
UPDATE flashlights 
SET status = CASE 
    WHEN status = 'New' THEN '_Wanted'
    WHEN status = 'Active' THEN '_Owned'
    WHEN status = 'Storage' THEN '_Owned'
    WHEN status = 'Gifted' THEN '_Sold'
    WHEN status = 'Retired' THEN '_Sold'
    ELSE status
END;

UPDATE flashlights
SET shipping_status = CASE
    WHEN shipping_status = 'In Transit' THEN '_Shipped'
    ELSE shipping_status
END;

-- Create new enum types with the correct values
CREATE TYPE flashlight_status_new AS ENUM ('Wanted', 'Ordered', 'Owned', 'Sold');
CREATE TYPE shipping_status_new AS ENUM ('Received', 'Shipped', 'Ordered');

-- Now update the data to final values
UPDATE flashlights 
SET status = CASE 
    WHEN status = '_Wanted' THEN 'Wanted'
    WHEN status = '_Owned' THEN 'Owned'
    WHEN status = '_Sold' THEN 'Sold'
    ELSE status
END;

UPDATE flashlights
SET shipping_status = CASE
    WHEN shipping_status = '_Shipped' THEN 'Shipped'
    ELSE shipping_status
END;

-- Update the columns to use the new types
ALTER TABLE flashlights 
    ALTER COLUMN status TYPE flashlight_status_new USING status::text::flashlight_status_new;

ALTER TABLE flashlights
    ALTER COLUMN shipping_status TYPE shipping_status_new USING shipping_status::text::shipping_status_new;

-- Drop the old types
DROP TYPE flashlight_status;
DROP TYPE shipping_status;

-- Rename the new types to the original names
ALTER TYPE flashlight_status_new RENAME TO flashlight_status;
ALTER TYPE shipping_status_new RENAME TO shipping_status;

-- Update the default constraint for status column
ALTER TABLE flashlights ALTER COLUMN status SET DEFAULT 'Wanted'::flashlight_status;