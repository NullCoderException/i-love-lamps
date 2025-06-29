-- Migration: Dynamic Schema with Lookup Tables
-- This replaces rigid enums with flexible lookup tables
-- Created: 2025-06-29

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- LOOKUP TABLES (replace hardcoded enums)
-- =============================================================================

-- Manufacturers table
CREATE TABLE manufacturers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    website VARCHAR(255),
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Battery types table
CREATE TABLE battery_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    voltage DECIMAL(3,1),
    chemistry VARCHAR(20), -- Li-ion, NiMH, Alkaline, etc.
    rechargeable BOOLEAN DEFAULT true,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Finish groups table
CREATE TABLE finish_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    durability_rating INTEGER CHECK (durability_rating >= 1 AND durability_rating <= 5),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drivers table
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    efficiency_rating INTEGER CHECK (efficiency_rating >= 1 AND efficiency_rating <= 5),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- UI types table
CREATE TABLE ui_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    complexity_rating INTEGER CHECK (complexity_rating >= 1 AND complexity_rating <= 5),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emitter types table
CREATE TABLE emitter_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    manufacturer VARCHAR(100),
    description TEXT,
    typical_cct_min INTEGER,
    typical_cct_max INTEGER,
    cri_min INTEGER,
    cri_max INTEGER,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Form factors table
CREATE TABLE form_factors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IP ratings table
CREATE TABLE ip_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rating VARCHAR(10) NOT NULL UNIQUE,
    dust_protection INTEGER CHECK (dust_protection >= 0 AND dust_protection <= 6),
    water_protection INTEGER CHECK (water_protection >= 0 AND water_protection <= 8),
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emitter colors table
CREATE TABLE emitter_colors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    hex_color VARCHAR(7), -- For UI display
    wavelength_nm INTEGER, -- For non-white colors
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Status types (for flashlight status)
CREATE TABLE status_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_owned BOOLEAN DEFAULT false, -- true for owned/active states
    display_order INTEGER,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipping status types
CREATE TABLE shipping_status_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- MAIN TABLES
-- =============================================================================

-- Users table (Auth0 integration ready)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth0_id VARCHAR(255) UNIQUE, -- For Auth0 integration
    supabase_id UUID, -- For backward compatibility
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flashlights table (main entity)
CREATE TABLE flashlights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Basic info
    model VARCHAR(255) NOT NULL,
    manufacturer_id UUID REFERENCES manufacturers(id),
    custom_manufacturer VARCHAR(100), -- For non-standard manufacturers
    
    -- Physical characteristics
    finish VARCHAR(100),
    finish_group_id UUID REFERENCES finish_groups(id),
    battery_type_id UUID REFERENCES battery_types(id),
    custom_battery_type VARCHAR(50), -- For custom battery configs
    
    -- Technical specs
    driver_id UUID REFERENCES drivers(id),
    custom_driver VARCHAR(100),
    ui_type_id UUID REFERENCES ui_types(id),
    custom_ui VARCHAR(100),
    anduril BOOLEAN DEFAULT false,
    ip_rating_id UUID REFERENCES ip_ratings(id),
    
    -- Arrays for multi-value relationships
    form_factor_ids UUID[] DEFAULT '{}', -- Array of form_factor IDs
    special_features TEXT[] DEFAULT '{}',
    
    -- Purchase/ownership info
    status_id UUID REFERENCES status_types(id),
    shipping_status_id UUID REFERENCES shipping_status_types(id),
    purchase_date DATE,
    purchase_price DECIMAL(10,2),
    purchase_currency VARCHAR(3) DEFAULT 'USD',
    
    -- Additional info
    notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emitters table (separate table for complex emitter configurations)
CREATE TABLE emitters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flashlight_id UUID NOT NULL REFERENCES flashlights(id) ON DELETE CASCADE,
    emitter_type_id UUID REFERENCES emitter_types(id),
    custom_emitter_type VARCHAR(100), -- For unlisted emitter types
    color_id UUID REFERENCES emitter_colors(id),
    cct INTEGER, -- Color temperature (Kelvin)
    count INTEGER NOT NULL DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preferred_cct_min INTEGER,
    preferred_cct_max INTEGER,
    preferred_battery_type_ids UUID[] DEFAULT '{}',
    preferred_manufacturer_ids UUID[] DEFAULT '{}',
    preferred_form_factor_ids UUID[] DEFAULT '{}',
    preferred_features TEXT[] DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flashlight manuals table (for AI features)
CREATE TABLE flashlight_manuals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flashlight_id UUID NOT NULL REFERENCES flashlights(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    file_path VARCHAR(500),
    embedding VECTOR(1536), -- For OpenAI embeddings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX idx_flashlights_user_id ON flashlights(user_id);
CREATE INDEX idx_flashlights_manufacturer ON flashlights(manufacturer_id);
CREATE INDEX idx_flashlights_status ON flashlights(status_id);
CREATE INDEX idx_emitters_flashlight_id ON emitters(flashlight_id);
CREATE INDEX idx_users_auth0_id ON users(auth0_id);
CREATE INDEX idx_users_supabase_id ON users(supabase_id);

-- GIN indexes for array columns
CREATE INDEX idx_flashlights_form_factors ON flashlights USING GIN(form_factor_ids);
CREATE INDEX idx_flashlights_features ON flashlights USING GIN(special_features);
CREATE INDEX idx_user_prefs_battery_types ON user_preferences USING GIN(preferred_battery_type_ids);
CREATE INDEX idx_user_prefs_manufacturers ON user_preferences USING GIN(preferred_manufacturer_ids);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all user-specific tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE emitters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashlight_manuals ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = supabase_id::text OR auth.jwt() ->> 'sub' = auth0_id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = supabase_id::text OR auth.jwt() ->> 'sub' = auth0_id);

-- Flashlights policies
CREATE POLICY "Users can view own flashlights" ON flashlights FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth.uid()::text = supabase_id::text OR auth.jwt() ->> 'sub' = auth0_id));
CREATE POLICY "Users can insert own flashlights" ON flashlights FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE auth.uid()::text = supabase_id::text OR auth.jwt() ->> 'sub' = auth0_id));
CREATE POLICY "Users can update own flashlights" ON flashlights FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE auth.uid()::text = supabase_id::text OR auth.jwt() ->> 'sub' = auth0_id));
CREATE POLICY "Users can delete own flashlights" ON flashlights FOR DELETE USING (user_id IN (SELECT id FROM users WHERE auth.uid()::text = supabase_id::text OR auth.jwt() ->> 'sub' = auth0_id));

-- Emitters policies (tied to flashlight ownership)
CREATE POLICY "Users can view own emitters" ON emitters FOR SELECT USING (flashlight_id IN (SELECT id FROM flashlights WHERE user_id IN (SELECT id FROM users WHERE auth.uid()::text = supabase_id::text OR auth.jwt() ->> 'sub' = auth0_id)));
CREATE POLICY "Users can manage own emitters" ON emitters FOR ALL USING (flashlight_id IN (SELECT id FROM flashlights WHERE user_id IN (SELECT id FROM users WHERE auth.uid()::text = supabase_id::text OR auth.jwt() ->> 'sub' = auth0_id)));

-- =============================================================================
-- FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update timestamp triggers
CREATE TRIGGER update_manufacturers_updated_at BEFORE UPDATE ON manufacturers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_flashlights_updated_at BEFORE UPDATE ON flashlights FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_emitters_updated_at BEFORE UPDATE ON emitters FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();