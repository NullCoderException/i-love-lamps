--postgresql
-- Enable the pgvector extension for AI features
CREATE EXTENSION IF NOT EXISTS vector;

-- Create enum types
CREATE TYPE battery_type AS ENUM (
  'AA', 'AAA', '14500', '18350', '18650', '21700', 
  'AA/14500', 'AAA/10440', 'Built-in'
);

CREATE TYPE manufacturer AS ENUM (
  'Acebeam', 'Wurkkos', 'Sofirn', 'Skilhunt', 
  'Olight', 'Nitecore', 'Convoy', 'Emisar', 'Fireflies'
);

CREATE TYPE finish_group AS ENUM (
  'MAO', 'Anodized', 'Titanium', 'Copper', 'Copper+Titanium'
);

CREATE TYPE shipping_status AS ENUM (
  'Received', 'In Transit', 'Ordered'
);

CREATE TYPE emitter_color AS ENUM (
  'White', 'Red', 'Green', 'Blue', 'UV', 'RGB', 'Green Laser', 'Red Laser'
);

CREATE TYPE form_factor AS ENUM (
  'Tube', 'Right Angle', 'Headlamp', 'Flat', 
  'Compact', 'Keychain', 'Multi-Function'
);

CREATE TYPE ip_rating AS ENUM (
  'None', 'IPX4', 'IPX5', 'IPX6', 'IPX7', 'IPX8',
  'IP54', 'IP55', 'IP65', 'IP66', 'IP67', 'IP68'
);

CREATE TYPE flashlight_status AS ENUM (
  'New', 'Active', 'Storage', 'Gifted', 'Retired'
);

-- Create tables
CREATE TABLE flashlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  model TEXT NOT NULL,
  manufacturer manufacturer NOT NULL,
  finish TEXT NOT NULL,
  finish_group finish_group NOT NULL,
  battery_type battery_type NOT NULL,
  driver TEXT NOT NULL,
  ui TEXT NOT NULL,
  anduril BOOLEAN NOT NULL DEFAULT false,
  ip_rating ip_rating,
  notes TEXT,
  purchase_date TEXT NOT NULL,
  shipping_status shipping_status NOT NULL,
  status flashlight_status NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE emitters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flashlight_id UUID REFERENCES flashlights ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  cct TEXT,
  count INTEGER NOT NULL DEFAULT 1,
  color emitter_color NOT NULL DEFAULT 'White',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE flashlight_form_factors (
  flashlight_id UUID REFERENCES flashlights ON DELETE CASCADE NOT NULL,
  form_factor form_factor NOT NULL,
  PRIMARY KEY (flashlight_id, form_factor)
);

CREATE TABLE flashlight_special_features (
  flashlight_id UUID REFERENCES flashlights ON DELETE CASCADE NOT NULL,
  feature TEXT NOT NULL,
  PRIMARY KEY (flashlight_id, feature)
);

CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users NOT NULL,
  preferred_cct_min INTEGER,
  preferred_cct_max INTEGER,
  preferred_battery_types TEXT[],
  preferred_manufacturers TEXT[],
  preferred_form_factors TEXT[],
  preferred_features TEXT[],
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE flashlight_manuals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flashlight_id UUID REFERENCES flashlights NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  file_path TEXT,
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies (to be expanded as needed)
ALTER TABLE flashlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE emitters ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashlight_form_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashlight_special_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashlight_manuals ENABLE ROW LEVEL SECURITY;

-- Basic policies (we'll add more later)
CREATE POLICY "Users can view their own flashlights" 
  ON flashlights FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own flashlights" 
  ON flashlights FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flashlights" 
  ON flashlights FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own flashlights" 
  ON flashlights FOR DELETE USING (auth.uid() = user_id);

-- Functions for recommendation and search (to be implemented)
-- We'll add these in Phase 4