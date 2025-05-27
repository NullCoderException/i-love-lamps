-- Migration: Fix enum casing to match TypeScript
-- This updates the database enums to use proper casing instead of all uppercase

-- First, we need to update any existing data
UPDATE flashlights 
SET status = CASE 
    WHEN status = 'WANTED' THEN 'Wanted'
    WHEN status = 'ORDERED' THEN 'Ordered'
    WHEN status = 'OWNED' THEN 'Owned'
    WHEN status = 'SOLD' THEN 'Sold'
    ELSE status
END
WHERE status IN ('WANTED', 'ORDERED', 'OWNED', 'SOLD');

UPDATE flashlights
SET shipping_status = CASE
    WHEN shipping_status = 'RECEIVED' THEN 'Received'
    WHEN shipping_status = 'SHIPPED' THEN 'Shipped'
    WHEN shipping_status = 'ORDERED' THEN 'Ordered'
    ELSE shipping_status
END
WHERE shipping_status IN ('RECEIVED', 'SHIPPED', 'ORDERED');

-- Now we need to recreate the enum types with proper casing
-- First, create temporary enum types
CREATE TYPE flashlight_status_new AS ENUM ('Wanted', 'Ordered', 'Owned', 'Sold');
CREATE TYPE shipping_status_new AS ENUM ('Received', 'Shipped', 'Ordered');

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