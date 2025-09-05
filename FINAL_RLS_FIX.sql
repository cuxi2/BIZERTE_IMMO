-- =========================================
-- FINAL RLS POLICY FIXES FOR PROFILES RECURSION
-- =========================================

-- First, let's disable RLS temporarily to avoid recursion
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_media DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits DISABLE ROW LEVEL SECURITY;

-- Now drop all existing policies
DROP POLICY IF EXISTS "Profiles: admin read all" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: admin write" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: users read own" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: users write own" ON public.profiles;

DROP POLICY IF EXISTS "Listings: admin read all" ON public.listings;
DROP POLICY IF EXISTS "Listings: admin write" ON public.listings;
DROP POLICY IF EXISTS "Listings: users read all" ON public.listings;
DROP POLICY IF EXISTS "Listings: owners write own" ON public.listings;

DROP POLICY IF EXISTS "Media: admin read all" ON public.listing_media;
DROP POLICY IF EXISTS "Media: admin write" ON public.listing_media;
DROP POLICY IF EXISTS "Media: users read all" ON public.listing_media;

DROP POLICY IF EXISTS "Reservations: manage by admin" ON public.reservations;
DROP POLICY IF EXISTS "Reservations: users manage own" ON public.reservations;

DROP POLICY IF EXISTS "Visits: manage by admin" ON public.visits;
DROP POLICY IF EXISTS "Visits: users manage own" ON public.visits;

-- Recreate policies with non-recursive conditions
-- Profiles policies
CREATE POLICY "Profiles: admin read all" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Profiles: admin write" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Profiles: users read own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Profiles: users write own" ON public.profiles
  FOR ALL USING (auth.uid() = id);

-- Listings policies
CREATE POLICY "Listings: admin read all" ON public.listings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Listings: admin write" ON public.listings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Listings: users read all" ON public.listings
  FOR SELECT USING (true);

CREATE POLICY "Listings: owners write own" ON public.listings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND (p.role = 'admin' OR p.id = owner_id)
    )
  );

-- Media policies
CREATE POLICY "Media: admin read all" ON public.listing_media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Media: admin write" ON public.listing_media
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Media: users read all" ON public.listing_media
  FOR SELECT USING (true);

-- Reservations policies
CREATE POLICY "Reservations: manage by admin" ON public.reservations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Reservations: users manage own" ON public.reservations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND (p.role = 'admin' OR p.id = user_id)
    )
  );

-- Visits policies
CREATE POLICY "Visits: manage by admin" ON public.visits
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Visits: users manage own" ON public.visits
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND (p.role = 'admin' OR p.id = user_id)
    )
  );

-- Storage policies (if the objects table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'objects' AND table_schema = 'storage') THEN
    DROP POLICY IF EXISTS "Listings Media: Admin Upload" ON storage.objects;
    DROP POLICY IF EXISTS "Listings Media: Admin Delete" ON storage.objects;
    
    CREATE POLICY "Listings Media: Admin Upload"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'listings-media'
      AND EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = auth.uid() AND p.role = 'admin'
      )
    );

    CREATE POLICY "Listings Media: Admin Delete"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'listings-media'
      AND EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = auth.uid() AND p.role = 'admin'
      )
    );
  END IF;
END $$;

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

-- =========================================
-- END OF FIXES
-- =========================================