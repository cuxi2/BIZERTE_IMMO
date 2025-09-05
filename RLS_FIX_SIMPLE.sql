-- =========================================
-- FIX RLS POLICIES TO PREVENT INFINITE RECURSION
-- =========================================

-- Fix Profiles policies
drop policy if exists "Profiles: admin read all" on public.profiles;
create policy "Profiles: admin read all" on public.profiles
  for select using (
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    )
  );

-- Fix Listings policies
drop policy if exists "Listings: admin read all" on public.listings;
create policy "Listings: admin read all" on public.listings
  for select using (
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    )
  );

drop policy if exists "Listings: admin write" on public.listings;
create policy "Listings: admin write" on public.listings
  for all using (
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    )
  );

-- Fix Media policies
drop policy if exists "Media: admin read all" on public.listing_media;
create policy "Media: admin read all" on public.listing_media
  for select using (
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    )
  );

drop policy if exists "Media: admin write" on public.listing_media;
create policy "Media: admin write" on public.listing_media
  for all using (
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    )
  );

-- Fix Reservations policies
drop policy if exists "Reservations: manage by admin" on public.reservations;
create policy "Reservations: manage by admin" on public.reservations
  for all using (
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    )
  );

-- Fix Visits policies
drop policy if exists "Visits: manage by admin" on public.visits;
create policy "Visits: manage by admin" on public.visits
  for all using (
    auth.uid() in (
      select id from public.profiles where role = 'admin'
    )
  );

-- Fix Storage policies
drop policy if exists "Listings Media: Admin Upload" on storage.objects;
create policy "Listings Media: Admin Upload"
on storage.objects for insert
with check (
  bucket_id = 'listings-media'
  and auth.uid() in (
    select id from public.profiles where role = 'admin'
  )
);

drop policy if exists "Listings Media: Admin Delete" on storage.objects;
create policy "Listings Media: Admin Delete"
on storage.objects for delete
using (
  bucket_id = 'listings-media'
  and auth.uid() in (
    select id from public.profiles where role = 'admin'
  )
);

-- =========================================
-- END OF FIXES
-- =========================================