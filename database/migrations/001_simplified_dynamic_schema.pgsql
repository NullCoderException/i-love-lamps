-- Migration: Simplified Dynamic Schema for Flashlight Collection
-- This balances flexibility with simplicity, based on real flashlight enthusiast needs
-- Created: 2025-06-29

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- LOOKUP TABLES (for truly dynamic data)
-- =============================================================================

-- Manufacturers table (changes frequently as new brands emerge)
CREATE TABLE manufacturers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    website VARCHAR(255),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emitter types table (LED model numbers like "519A", "SFT40", "B35AM")
CREATE TABLE emitter_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE, -- "519A", "SFT40", "XHP70.3 HI", etc.
    manufacturer VARCHAR(100), -- "Nichia", "Luminus", "Cree", etc.
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- MAIN TABLES with practical string fields
-- =============================================================================

-- Users table (Auth0 ready)
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

-- Flashlights table (main entity) - keeping it practical
CREATE TABLE flashlights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Basic info
    model VARCHAR(255) NOT NULL,
    manufacturer_id UUID REFERENCES manufacturers(id),
    custom_manufacturer VARCHAR(100), -- For unlisted manufacturers
    
    -- Physical characteristics (mostly strings for flexibility)
    finish VARCHAR(100), -- "Teal", "Stonewashed Titanium", "Copper", etc.
    finish_group VARCHAR(50), -- "Anodized", "Titanium", "Copper", "MAO", "Brass", "Stainless Steel"
    battery_type VARCHAR(50), -- "21700", "18650", "AA/14500", "Built-in", etc.
    
    -- Technical specs (strings with common values, but flexible)
    driver VARCHAR(100), -- "Buck", "Linear + FET", "12-Group", "Proprietary", etc.
    ui VARCHAR(100), -- "Anduril 2", "Side Switch", "Dual Switch", "Rotary", etc.
    anduril BOOLEAN DEFAULT false,
    
    -- Form factors (array of strings - flashlights can be multiple)
    form_factors TEXT[] DEFAULT '{}', -- ["Tube", "Compact"], ["Headlamp", "Right Angle"], etc.
    
    -- IP rating as string (because IPX8, IP68, etc. don't split cleanly)
    ip_rating VARCHAR(10), -- "IPX8", "IP68", "IPX4", etc.
    
    -- Features and notes
    special_features TEXT[] DEFAULT '{}', -- ["USB-C charging", "RGB aux LEDs", "High CRI"]
    notes TEXT,
    
    -- Purchase/ownership info (using string enums for status - these are stable)
    status VARCHAR(20) DEFAULT 'Wanted' CHECK (status IN ('Wanted', 'Ordered', 'Owned', 'Sold')),
    shipping_status VARCHAR(20) DEFAULT 'Received' CHECK (shipping_status IN ('Received', 'Shipped', 'Ordered')),
    purchase_date VARCHAR(10), -- Flexible date format like "2024" or "2024-12"
    purchase_price DECIMAL(10,2),
    purchase_currency VARCHAR(3) DEFAULT 'USD',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emitters table (separate because flashlights can have multiple emitter configs)
CREATE TABLE emitters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flashlight_id UUID NOT NULL REFERENCES flashlights(id) ON DELETE CASCADE,
    
    -- Emitter specs
    emitter_type_id UUID REFERENCES emitter_types(id), -- Links to "519A", "SFT40", etc.
    custom_emitter_type VARCHAR(100), -- For unlisted emitters like "?"
    color VARCHAR(20) DEFAULT 'White', -- "White", "Red", "Green", "Blue", "UV", "RGB", "Green Laser", "Red Laser"
    cct VARCHAR(20), -- "4000K", "5000K", "2700K-5000K", "520nm", "365nm", etc. (flexible string)
    count INTEGER NOT NULL DEFAULT 1,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preferred_cct_min INTEGER,
    preferred_cct_max INTEGER,
    preferred_battery_types TEXT[] DEFAULT '{}',
    preferred_manufacturers TEXT[] DEFAULT '{}',
    preferred_form_factors TEXT[] DEFAULT '{}',
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- SEED DATA (common values to populate dropdowns)
-- =============================================================================

-- Seed manufacturers from your existing data
INSERT INTO manufacturers (name) VALUES
    ('Acebeam'),
    ('Wurkkos'),
    ('Sofirn'),
    ('Skilhunt'),
    ('Olight'),
    ('Nitecore'),
    ('Convoy'),
    ('Emisar'),
    ('Fireflies'),
    ('Reylight');

-- Seed common emitter types from your collection
INSERT INTO emitter_types (name, manufacturer) VALUES
    ('519A', 'Nichia'),
    ('B35AM', 'Nichia'),
    ('SFT40', 'Luminus'),
    ('SFT25R', 'Luminus'),
    ('SFT70', 'Luminus'),
    ('XHP70.3 HI', 'Cree'),
    ('W1', 'Osram'),
    ('FFL351A', 'Nichia'),
    ('FFL505A', 'Nichia'),
    ('CSP2323', 'Samsung'),
    ('CSP1313', 'Samsung'),
    ('CSP1919', 'Samsung'),
    ('LH351D', 'Samsung'),
    ('LH351B', 'Samsung'),
    ('219F', 'Nichia'),
    ('UHi 25', 'Nichia'),
    ('SBT90.2', 'Luminus'),
    ('KP CSLPM1.F1', 'Osram'),
    ('SST20-DR', 'Luminus'),
    ('HFL1-R', 'Various'),
    ('XP-L HD', 'Cree');

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX idx_flashlights_user_id ON flashlights(user_id);
CREATE INDEX idx_flashlights_manufacturer ON flashlights(manufacturer_id);
CREATE INDEX idx_flashlights_status ON flashlights(status);
CREATE INDEX idx_emitters_flashlight_id ON emitters(flashlight_id);
CREATE INDEX idx_users_auth0_id ON users(auth0_id);
CREATE INDEX idx_users_supabase_id ON users(supabase_id);

-- GIN indexes for array columns
CREATE INDEX idx_flashlights_form_factors ON flashlights USING GIN(form_factors);
CREATE INDEX idx_flashlights_features ON flashlights USING GIN(special_features);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on user-specific tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE emitters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashlight_manuals ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be enhanced for Auth0 later)
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = supabase_id::text);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = supabase_id::text);

CREATE POLICY "Users can view own flashlights" ON flashlights FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth.uid()::text = supabase_id::text));
CREATE POLICY "Users can manage own flashlights" ON flashlights FOR ALL USING (user_id IN (SELECT id FROM users WHERE auth.uid()::text = supabase_id::text));

CREATE POLICY "Users can view own emitters" ON emitters FOR SELECT USING (flashlight_id IN (SELECT id FROM flashlights WHERE user_id IN (SELECT id FROM users WHERE auth.uid()::text = supabase_id::text)));
CREATE POLICY "Users can manage own emitters" ON emitters FOR ALL USING (flashlight_id IN (SELECT id FROM flashlights WHERE user_id IN (SELECT id FROM users WHERE auth.uid()::text = supabase_id::text)));

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
CREATE TRIGGER update_flashlights_updated_at BEFORE UPDATE ON flashlights FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();