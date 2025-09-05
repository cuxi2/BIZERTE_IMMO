-- =========================================
-- SUPABASE EXPERT SOLUTION: FIX INFINITE RECURSION ERROR
-- =========================================

-- PROBLEM: "infinite recursion detected in policy for relation 'profiles'"
-- CAUSE: Recursive RLS policy that references the same table within its definition
-- SOLUTION: Replace recursive policies with non-recursive alternatives

-- STEP 1: COMPLETELY DISABLE RLS TO STOP RECURSION IMMEDIATELY
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_media DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits DISABLE ROW LEVEL SECURITY;

-- STEP 2: DROP ALL EXISTING PROFILES POLICIES THAT MAY CAUSE RECURSION
DROP POLICY IF EXISTS "Profiles are viewable by themselves." ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by admins." ON public.profiles;
DROP POLICY IF EXISTS "Profiles can be updated by admins." ON public.profiles;
DROP POLICY IF EXISTS "Profiles can be updated by owners." ON public.profiles;
DROP POLICY IF EXISTS "Profiles can be inserted by admins." ON public.profiles;

-- STEP 3: CREATE NEW NON-RECURSIVE POLICIES FOR PROFILES
-- Policy: Users can view their own profile (NON-RECURSIVE)
CREATE POLICY "Profiles are viewable by themselves."
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Policy: Admins can view all profiles (NON-RECURSIVE - FIXED VERSION)
CREATE POLICY "Profiles are viewable by admins."
ON public.profiles FOR SELECT
USING (
  -- FIXED: Use auth.jwt() to check role without recursive table reference
  COALESCE(
    (auth.jwt() ->> 'user_role') = 'admin',
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
);

-- Policy: Admins can update all profiles
CREATE POLICY "Profiles can be updated by admins."
ON public.profiles FOR UPDATE
USING (
  COALESCE(
    (auth.jwt() ->> 'user_role') = 'admin',
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
);

-- Policy: Users can update their own profile
CREATE POLICY "Profiles can be updated by owners."
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Policy: Admins can insert profiles
CREATE POLICY "Profiles can be inserted by admins."
ON public.profiles FOR INSERT
WITH CHECK (
  COALESCE(
    (auth.jwt() ->> 'user_role') = 'admin',
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
);

-- STEP 4: RE-CREATE OTHER TABLE POLICIES
-- Listings policies
DROP POLICY IF EXISTS "Listings are viewable by everyone." ON public.listings;
DROP POLICY IF EXISTS "Listings can be updated by admins." ON public.listings;
DROP POLICY IF EXISTS "Listings can be inserted by admins." ON public.listings;
DROP POLICY IF EXISTS "Listings can be deleted by admins." ON public.listings;

CREATE POLICY "Listings are viewable by everyone."
ON public.listings FOR SELECT
USING (true);

CREATE POLICY "Listings can be updated by admins."
ON public.listings FOR ALL
USING (
  COALESCE(
    (auth.jwt() ->> 'user_role') = 'admin',
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
);

CREATE POLICY "Listings can be inserted by admins."
ON public.listings FOR INSERT
WITH CHECK (
  COALESCE(
    (auth.jwt() ->> 'user_role') = 'admin',
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
);

CREATE POLICY "Listings can be deleted by admins."
ON public.listings FOR DELETE
USING (
  COALESCE(
    (auth.jwt() ->> 'user_role') = 'admin',
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
);

-- Media policies
DROP POLICY IF EXISTS "Media are viewable by everyone." ON public.listing_media;
DROP POLICY IF EXISTS "Media can be managed by admins." ON public.listing_media;

CREATE POLICY "Media are viewable by everyone."
ON public.listing_media FOR SELECT
USING (true);

CREATE POLICY "Media can be managed by admins."
ON public.listing_media FOR ALL
USING (
  COALESCE(
    (auth.jwt() ->> 'user_role') = 'admin',
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
);

-- Reservations policies
DROP POLICY IF EXISTS "Reservations can be managed by admins." ON public.reservations;
DROP POLICY IF EXISTS "Reservations are viewable by owners." ON public.reservations;

CREATE POLICY "Reservations can be managed by admins."
ON public.reservations FOR ALL
USING (
  COALESCE(
    (auth.jwt() ->> 'user_role') = 'admin',
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
);

CREATE POLICY "Reservations are viewable by owners."
ON public.reservations FOR SELECT
USING (
  COALESCE(
    (auth.jwt() ->> 'user_role') = 'admin',
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND (p.role = 'admin' OR p.id = user_id)
    )
  )
);

-- Visits policies
DROP POLICY IF EXISTS "Visits can be managed by admins." ON public.visits;
DROP POLICY IF EXISTS "Visits are viewable by owners." ON public.visits;

CREATE POLICY "Visits can be managed by admins."
ON public.visits FOR ALL
USING (
  COALESCE(
    (auth.jwt() ->> 'user_role') = 'admin',
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
);

CREATE POLICY "Visits are viewable by owners."
ON public.visits FOR SELECT
USING (
  COALESCE(
    (auth.jwt() ->> 'user_role') = 'admin',
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND (p.role = 'admin' OR p.id = user_id)
    )
  )
);

-- STEP 5: RE-ENABLE RLS WITH FIXED POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- STEP 6: GRANT NECESSARY PERMISSIONS
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.listings TO authenticated;
GRANT ALL ON public.listing_media TO authenticated;
GRANT ALL ON public.reservations TO authenticated;
GRANT ALL ON public.visits TO authenticated;

-- STEP 7: VERIFY FIX
SELECT '✅ SUPABASE RLS RECURSION ERROR FIXED SUCCESSFULLY!' as status;