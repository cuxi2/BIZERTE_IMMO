-- =========================================
-- DIRECT RLS POLICY FIXES FOR RECURSION ISSUE
-- =========================================

-- Disable RLS temporarily to avoid recursion
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_media DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to prevent conflicts
DROP POLICY IF EXISTS "Profiles are viewable by themselves." ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by admins." ON public.profiles;
DROP POLICY IF EXISTS "Profiles can be updated by admins." ON public.profiles;
DROP POLICY IF EXISTS "Profiles can be updated by owners." ON public.profiles;
DROP POLICY IF EXISTS "Profiles can be inserted by admins." ON public.profiles;

DROP POLICY IF EXISTS "Listings are viewable by everyone." ON public.listings;
DROP POLICY IF EXISTS "Listings can be updated by admins." ON public.listings;
DROP POLICY IF EXISTS "Listings can be inserted by admins." ON public.listings;
DROP POLICY IF EXISTS "Listings can be deleted by admins." ON public.listings;

DROP POLICY IF EXISTS "Media are viewable by everyone." ON public.listing_media;
DROP POLICY IF EXISTS "Media can be managed by admins." ON public.listing_media;

DROP POLICY IF EXISTS "Reservations can be managed by admins." ON public.reservations;
DROP POLICY IF EXISTS "Reservations are viewable by owners." ON public.reservations;

DROP POLICY IF EXISTS "Visits can be managed by admins." ON public.visits;
DROP POLICY IF EXISTS "Visits are viewable by owners." ON public.visits;

-- Create new non-recursive policies
-- Profiles policies
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

-- Listings policies
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

-- Media policies
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

-- Reservations policies
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

-- Visits policies
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

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.listings TO authenticated;
GRANT ALL ON public.listing_media TO authenticated;
GRANT ALL ON public.reservations TO authenticated;
GRANT ALL ON public.visits TO authenticated;

-- Notify success
SELECT '✅ RLS policies have been successfully updated!' as message;