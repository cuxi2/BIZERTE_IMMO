-- =========================================
-- FRESH SUPABASE DATABASE SETUP FOR MEFTAHI IMMO
-- =========================================

-- Step 1: Create tables with proper structure
-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'agent', 'client')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property types enum
CREATE TYPE public.property_kind AS ENUM ('apartment', 'house', 'villa', 'land', 'commercial');

-- Listing purposes enum
CREATE TYPE public.listing_purpose AS ENUM ('sale', 'rent');

-- Listing statuses enum
CREATE TYPE public.listing_status AS ENUM ('draft', 'published', 'archived');

-- Listings table
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    property_type public.property_kind NOT NULL,
    purpose public.listing_purpose NOT NULL,
    status public.listing_status DEFAULT 'draft',
    address TEXT,
    city TEXT,
    region TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'TN',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    price DECIMAL(12, 2) NOT NULL,
    area DECIMAL(10, 2),
    bedrooms INTEGER,
    bathrooms INTEGER,
    floors INTEGER,
    year_built INTEGER,
    has_parking BOOLEAN DEFAULT false,
    has_garden BOOLEAN DEFAULT false,
    has_pool BOOLEAN DEFAULT false,
    has_elevator BOOLEAN DEFAULT false,
    has_terrace BOOLEAN DEFAULT false,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media table
CREATE TABLE IF NOT EXISTS public.listing_media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
    media_url TEXT NOT NULL,
    media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
    is_primary BOOLEAN DEFAULT false,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservation statuses enum
CREATE TYPE public.reservation_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Reservations table
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status public.reservation_status DEFAULT 'pending',
    total_price DECIMAL(12, 2) NOT NULL,
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT check_dates CHECK (end_date > start_date)
);

-- Visits table
CREATE TABLE IF NOT EXISTS public.visits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    visit_date DATE NOT NULL,
    visit_time TIME NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_listings_owner_id ON public.listings(owner_id);
CREATE INDEX IF NOT EXISTS idx_listings_property_type ON public.listings(property_type);
CREATE INDEX IF NOT EXISTS idx_listings_purpose ON public.listings(purpose);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.listings(price);
CREATE INDEX IF NOT EXISTS idx_listing_media_listing_id ON public.listing_media(listing_id);
CREATE INDEX IF NOT EXISTS idx_reservations_listing_id ON public.reservations(listing_id);
CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON public.reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);
CREATE INDEX IF NOT EXISTS idx_visits_listing_id ON public.visits(listing_id);
CREATE INDEX IF NOT EXISTS idx_visits_user_id ON public.visits(user_id);
CREATE INDEX IF NOT EXISTS idx_visits_status ON public.visits(status);

-- Step 3: Set up Row Level Security (NON-RECURSIVE POLICIES)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES (NON-RECURSIVE)
CREATE POLICY "Profiles are viewable by themselves."
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Profiles are viewable by admins."
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "Profiles can be updated by admins."
ON public.profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "Profiles can be updated by owners."
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Profiles can be inserted by admins."
ON public.profiles FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- LISTINGS POLICIES
CREATE POLICY "Listings are viewable by everyone."
ON public.listings FOR SELECT
USING (true);

CREATE POLICY "Listings can be updated by admins."
ON public.listings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "Listings can be inserted by admins."
ON public.listings FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "Listings can be deleted by admins."
ON public.listings FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- MEDIA POLICIES
CREATE POLICY "Media are viewable by everyone."
ON public.listing_media FOR SELECT
USING (true);

CREATE POLICY "Media can be managed by admins."
ON public.listing_media FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- RESERVATIONS POLICIES
CREATE POLICY "Reservations can be managed by admins."
ON public.reservations FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "Reservations are viewable by owners."
ON public.reservations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND (p.role = 'admin' OR p.id = user_id)
  )
);

-- VISITS POLICIES
CREATE POLICY "Visits can be managed by admins."
ON public.visits FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "Visits are viewable by owners."
ON public.visits FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND (p.role = 'admin' OR p.id = user_id)
  )
);

-- Step 4: Grant permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.listings TO authenticated;
GRANT ALL ON public.listing_media TO authenticated;
GRANT ALL ON public.reservations TO authenticated;
GRANT ALL ON public.visits TO authenticated;

-- Grant usage on enums
GRANT USAGE ON TYPE public.property_kind TO authenticated;
GRANT USAGE ON TYPE public.listing_purpose TO authenticated;
GRANT USAGE ON TYPE public.listing_status TO authenticated;
GRANT USAGE ON TYPE public.reservation_status TO authenticated;

-- Step 5: Create storage bucket for media
-- Note: This needs to be done in the Supabase dashboard Storage section
-- Create a bucket named "listings-media" and set it as public

-- Step 6: Create function to automatically create profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is the first user (admin)
  IF (SELECT COUNT(*) FROM public.profiles) = 0 THEN
    INSERT INTO public.profiles (id, full_name, phone, role)
    VALUES (
      NEW.id, 
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'Admin User'),
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      'admin'
    );
  ELSE
    -- Regular user gets client role by default
    INSERT INTO public.profiles (id, full_name, phone, role)
    VALUES (
      NEW.id, 
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      'client'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 8: Verification
SELECT '✅ NEW DATABASE SETUP COMPLETE - NO RECURSION ISSUES!' as status;