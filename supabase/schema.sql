-- ==============================================================================
-- ROOTS: REBUILDING OUR OUTDOORS THROUGH SUSTAINABILITY
-- Comprehensive Production PostgreSQL Database Schema with Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Role Enum
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('volunteer', 'organizer', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Tree Health Status Enum
DO $$ BEGIN
  CREATE TYPE tree_health_status AS ENUM ('Healthy', 'Needs Attention', 'Under Observation', 'Dead or Replaced');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Checkpoint Enum
DO $$ BEGIN
  CREATE TYPE growth_checkpoint AS ENUM ('Day 1', 'Day 30', 'Day 90', 'Day 180', 'Day 365');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'volunteer',
  organization TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  trees_planted_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. SOIL TYPES TABLE
CREATE TABLE IF NOT EXISTS public.soil_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  composition TEXT NOT NULL,
  texture TEXT NOT NULL,
  ph_range TEXT NOT NULL,
  nutrient_availability TEXT NOT NULL,
  water_retention TEXT NOT NULL,
  drainage TEXT NOT NULL,
  suitable_trees TEXT[] NOT NULL DEFAULT '{}',
  suitable_plants TEXT[] NOT NULL DEFAULT '{}',
  advantages TEXT[] NOT NULL DEFAULT '{}',
  limitations TEXT[] NOT NULL DEFAULT '{}',
  color_description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PLANTS & TREES TABLE
CREATE TABLE IF NOT EXISTS public.plants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  common_name TEXT NOT NULL,
  scientific_name TEXT NOT NULL UNIQUE,
  family TEXT,
  soil_preferences TEXT[] NOT NULL DEFAULT '{}',
  ideal_ph_range TEXT NOT NULL,
  sunlight TEXT NOT NULL,
  water_needs TEXT NOT NULL,
  growth_rate TEXT NOT NULL,
  max_height_meters NUMERIC(5,2),
  native_status TEXT NOT NULL DEFAULT 'Native to Indian Subcontinent',
  environmental_benefits TEXT[] NOT NULL DEFAULT '{}',
  planting_season TEXT NOT NULL,
  medicinal_or_economic_value TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PLANTATION EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.plantation_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  location_name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  state TEXT NOT NULL,
  trees_planned INT NOT NULL CHECK (trees_planned > 0),
  volunteer_capacity INT NOT NULL CHECK (volunteer_capacity > 0),
  registered_count INT NOT NULL DEFAULT 0 CHECK (registered_count <= volunteer_capacity),
  tree_species TEXT[] NOT NULL DEFAULT '{}',
  soil_type TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  poster_url TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed', 'cancelled')),
  completed_trees INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. VOLUNTEER REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.volunteer_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.plantation_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  registration_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'attended')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_event_user_registration UNIQUE (event_id, user_id)
);

-- 6. TREE RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.tree_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tree_code TEXT NOT NULL UNIQUE,
  species_id UUID REFERENCES public.plants(id) ON DELETE SET NULL,
  species_name TEXT NOT NULL,
  scientific_name TEXT NOT NULL,
  event_id UUID REFERENCES public.plantation_events(id) ON DELETE SET NULL,
  planter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  planter_name TEXT NOT NULL,
  plantation_date DATE NOT NULL,
  location_name TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  soil_type_name TEXT NOT NULL,
  photo_url TEXT,
  initial_height_cm NUMERIC(6,2),
  current_health_status tree_health_status NOT NULL DEFAULT 'Healthy',
  is_adopted BOOLEAN NOT NULL DEFAULT FALSE,
  total_assessments_count INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. TREE ADOPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.tree_adoptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tree_id UUID NOT NULL REFERENCES public.tree_records(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  adopted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT unique_active_tree_adoption UNIQUE (tree_id, user_id)
);

-- 8. TREE GROWTH UPDATES & CHECKPOINTS TABLE
CREATE TABLE IF NOT EXISTS public.tree_growth_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tree_id UUID NOT NULL REFERENCES public.tree_records(id) ON DELETE CASCADE,
  recorded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  checkpoint growth_checkpoint NOT NULL,
  assessment_date DATE NOT NULL,
  height_cm NUMERIC(6,2) NOT NULL,
  canopy_spread_cm NUMERIC(6,2),
  health_status tree_health_status NOT NULL,
  observations TEXT NOT NULL,
  photo_url TEXT,
  maintenance_performed TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. MAINTENANCE RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.maintenance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tree_id UUID NOT NULL REFERENCES public.tree_records(id) ON DELETE CASCADE,
  recorded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  maintenance_type TEXT NOT NULL, -- 'Watering', 'Organic Mulching', 'Weeding', 'Pest Control', 'Staking'
  performed_at DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. ENVIRONMENTAL STATISTICS AUDIT TABLE
CREATE TABLE IF NOT EXISTS public.environmental_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  total_registered_trees INT NOT NULL DEFAULT 0,
  total_trees_planted INT NOT NULL DEFAULT 0,
  total_trees_monitored INT NOT NULL DEFAULT 0,
  trees_confirmed_healthy INT NOT NULL DEFAULT 0,
  trees_needing_attention INT NOT NULL DEFAULT 0,
  trees_dead_or_replaced INT NOT NULL DEFAULT 0,
  overall_survival_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  completed_drives INT NOT NULL DEFAULT 0,
  active_drives INT NOT NULL DEFAULT 0,
  registered_volunteers INT NOT NULL DEFAULT 0,
  participating_organizations INT NOT NULL DEFAULT 0,
  is_verified_audit BOOLEAN NOT NULL DEFAULT TRUE,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR HIGH-PERFORMANCE SEARCH & FILTERING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_events_date ON public.plantation_events(date);
CREATE INDEX IF NOT EXISTS idx_events_state ON public.plantation_events(state);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.plantation_events(status);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON public.volunteer_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON public.volunteer_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_tree_code ON public.tree_records(tree_code);
CREATE INDEX IF NOT EXISTS idx_tree_planter ON public.tree_records(planter_id);
CREATE INDEX IF NOT EXISTS idx_tree_updates_tree ON public.tree_growth_updates(tree_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soil_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plantation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tree_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tree_adoptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tree_growth_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.environmental_statistics ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- SOIL TYPES & PLANTS (Read-only for public, writable by admin)
CREATE POLICY "Soil types readable by everyone" 
  ON public.soil_types FOR SELECT USING (true);

CREATE POLICY "Plants catalog readable by everyone" 
  ON public.plants FOR SELECT USING (true);

-- PLANTATION EVENTS
CREATE POLICY "Plantation events readable by everyone" 
  ON public.plantation_events FOR SELECT USING (true);

CREATE POLICY "Organizers and Admins can create events" 
  ON public.plantation_events FOR INSERT 
  WITH CHECK (
    auth.uid() = organizer_id AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('organizer', 'admin')
    )
  );

CREATE POLICY "Organizers can update their own events" 
  ON public.plantation_events FOR UPDATE 
  USING (
    auth.uid() = organizer_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Organizers can delete their own events" 
  ON public.plantation_events FOR DELETE 
  USING (
    auth.uid() = organizer_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- VOLUNTEER REGISTRATIONS
CREATE POLICY "Volunteers can view their own registrations" 
  ON public.volunteer_registrations FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.plantation_events 
      WHERE id = volunteer_registrations.event_id AND organizer_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Authenticated users can register for events" 
  ON public.volunteer_registrations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their own registrations" 
  ON public.volunteer_registrations FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own registration" 
  ON public.volunteer_registrations FOR DELETE 
  USING (auth.uid() = user_id);

-- TREE RECORDS
CREATE POLICY "Tree records are viewable by everyone" 
  ON public.tree_records FOR SELECT USING (true);

CREATE POLICY "Authenticated users can register trees" 
  ON public.tree_records FOR INSERT 
  WITH CHECK (auth.uid() = planter_id);

CREATE POLICY "Planters and admins can update tree records" 
  ON public.tree_records FOR UPDATE 
  USING (
    auth.uid() = planter_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- TREE ADOPTIONS
CREATE POLICY "Adoptions viewable by everyone" 
  ON public.tree_adoptions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can adopt trees" 
  ON public.tree_adoptions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own adoptions" 
  ON public.tree_adoptions FOR UPDATE 
  USING (auth.uid() = user_id);

-- TREE GROWTH UPDATES
CREATE POLICY "Growth updates readable by everyone" 
  ON public.tree_growth_updates FOR SELECT USING (true);

CREATE POLICY "Authenticated users can submit growth updates" 
  ON public.tree_growth_updates FOR INSERT 
  WITH CHECK (auth.uid() = recorded_by);

-- MAINTENANCE RECORDS
CREATE POLICY "Maintenance records readable by everyone" 
  ON public.maintenance_records FOR SELECT USING (true);

CREATE POLICY "Authenticated users can log maintenance" 
  ON public.maintenance_records FOR INSERT 
  WITH CHECK (auth.uid() = recorded_by);

-- ENVIRONMENTAL STATISTICS
CREATE POLICY "Environmental stats readable by everyone" 
  ON public.environmental_statistics FOR SELECT USING (true);
