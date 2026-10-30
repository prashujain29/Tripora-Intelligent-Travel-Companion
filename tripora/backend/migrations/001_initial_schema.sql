-- ====================================================================
-- TRIPORA — Your Intelligent Travel Companion
-- Supabase Schema & Row Level Security (RLS) Migration
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    preferred_currency TEXT DEFAULT 'USD',
    preferred_language TEXT DEFAULT 'en',
    travel_personality TEXT[] DEFAULT ARRAY[]::TEXT[],
    dietary_preferences TEXT[] DEFAULT ARRAY[]::TEXT[],
    accessibility_requirements TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TRIPS TABLE
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    country TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('draft', 'upcoming', 'ongoing', 'completed', 'archived')),
    cover_image_url TEXT,
    adults INTEGER NOT NULL DEFAULT 1 CHECK (adults > 0),
    children INTEGER NOT NULL DEFAULT 0 CHECK (children >= 0),
    traveler_type TEXT NOT NULL DEFAULT 'solo' CHECK (traveler_type IN ('solo', 'couple', 'family', 'group')),
    total_budget NUMERIC(12, 2) NOT NULL DEFAULT 0.0 CHECK (total_budget >= 0),
    currency TEXT NOT NULL DEFAULT 'USD',
    accommodation_class TEXT DEFAULT 'comfort' CHECK (accommodation_class IN ('budget', 'comfort', 'luxury', 'boutique')),
    travel_pace TEXT DEFAULT 'balanced' CHECK (travel_pace IN ('relaxed', 'balanced', 'intense')),
    personalities TEXT[] DEFAULT ARRAY[]::TEXT[],
    interests TEXT[] DEFAULT ARRAY[]::TEXT[],
    summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ITINERARY DAYS TABLE
CREATE TABLE IF NOT EXISTS public.itinerary_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL CHECK (day_number > 0),
    date DATE NOT NULL,
    title TEXT NOT NULL,
    theme TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (trip_id, day_number)
);

-- 4. ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_id UUID NOT NULL REFERENCES public.itinerary_days(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'sightseeing' CHECK (category IN ('sightseeing', 'food', 'adventure', 'culture', 'relaxation', 'shopping', 'transport', 'hotel')),
    start_time TIME NOT NULL,
    end_time TIME,
    duration_minutes INTEGER DEFAULT 60 CHECK (duration_minutes > 0),
    cost NUMERIC(10, 2) DEFAULT 0.0 CHECK (cost >= 0),
    currency TEXT DEFAULT 'USD',
    location_name TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    transport_mode TEXT,
    transport_details TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    booking_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SAVED DESTINATIONS TABLE
CREATE TABLE IF NOT EXISTS public.saved_destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    destination_name TEXT NOT NULL,
    country TEXT NOT NULL,
    region TEXT,
    image_url TEXT,
    category TEXT,
    estimated_budget_range TEXT,
    best_time_to_visit TEXT,
    notes TEXT,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, destination_name)
);

-- 6. TRAVEL PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.travel_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    preferred_categories TEXT[] DEFAULT ARRAY[]::TEXT[],
    activity_pace TEXT DEFAULT 'balanced',
    preferred_currency TEXT DEFAULT 'USD',
    dietary_restrictions TEXT[] DEFAULT ARRAY[]::TEXT[],
    mobility_needs TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. AI CONVERSATIONS & MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    suggested_actions JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON public.trips(status);
CREATE INDEX IF NOT EXISTS idx_itinerary_days_trip_id ON public.itinerary_days(trip_id);
CREATE INDEX IF NOT EXISTS idx_activities_day_id ON public.activities(day_id);
CREATE INDEX IF NOT EXISTS idx_activities_day_order ON public.activities(day_id, order_index);
CREATE INDEX IF NOT EXISTS idx_saved_destinations_user_id ON public.saved_destinations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_trip ON public.ai_conversations(user_id, trip_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and manage their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trips: Users can manage only their own trips
CREATE POLICY "Users can view own trips" ON public.trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own trips" ON public.trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trips" ON public.trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own trips" ON public.trips FOR DELETE USING (auth.uid() = user_id);

-- Itinerary Days: Access via parent trip ownership
CREATE POLICY "Users can view own itinerary days" ON public.itinerary_days FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = itinerary_days.trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "Users can insert own itinerary days" ON public.itinerary_days FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = itinerary_days.trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "Users can update own itinerary days" ON public.itinerary_days FOR UPDATE 
    USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = itinerary_days.trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "Users can delete own itinerary days" ON public.itinerary_days FOR DELETE 
    USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = itinerary_days.trip_id AND trips.user_id = auth.uid()));

-- Activities: Access via parent day -> trip ownership
CREATE POLICY "Users can view own activities" ON public.activities FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.itinerary_days 
        JOIN public.trips ON trips.id = itinerary_days.trip_id 
        WHERE itinerary_days.id = activities.day_id AND trips.user_id = auth.uid()
    ));
CREATE POLICY "Users can insert own activities" ON public.activities FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.itinerary_days 
        JOIN public.trips ON trips.id = itinerary_days.trip_id 
        WHERE itinerary_days.id = activities.day_id AND trips.user_id = auth.uid()
    ));
CREATE POLICY "Users can update own activities" ON public.activities FOR UPDATE 
    USING (EXISTS (
        SELECT 1 FROM public.itinerary_days 
        JOIN public.trips ON trips.id = itinerary_days.trip_id 
        WHERE itinerary_days.id = activities.day_id AND trips.user_id = auth.uid()
    ));
CREATE POLICY "Users can delete own activities" ON public.activities FOR DELETE 
    USING (EXISTS (
        SELECT 1 FROM public.itinerary_days 
        JOIN public.trips ON trips.id = itinerary_days.trip_id 
        WHERE itinerary_days.id = activities.day_id AND trips.user_id = auth.uid()
    ));

-- Saved Destinations: User isolated
CREATE POLICY "Users manage own saved destinations" ON public.saved_destinations FOR ALL USING (auth.uid() = user_id);

-- Preferences: User isolated
CREATE POLICY "Users manage own preferences" ON public.travel_preferences FOR ALL USING (auth.uid() = user_id);

-- AI Conversations: User isolated
CREATE POLICY "Users manage own AI conversations" ON public.ai_conversations FOR ALL USING (auth.uid() = user_id);

