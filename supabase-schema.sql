-- =========================================
-- MEFTAHI IMMO - Database Schema Setup
-- =========================================
-- Run this script in your Supabase SQL Editor

-- 1. Create Enums
create type public.property_kind as enum (
  'appartement',
  'villa', 
  'studio',
  'terrain',
  'bureau',
  'autre'
);

create type public.listing_purpose as enum (
  'vente',
  'location'
);

create type public.listing_status as enum (
  'brouillon',
  'publie',
  'reserve', 
  'occupe',
  'vendu',
  'retire'
);

create type public.reservation_status as enum (
  'pending',
  'confirmed',
  'cancelled'
);

-- 2. Profiles Table (user profiles)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text check (role in ('admin','agent','client')) default 'client',
  created_at timestamptz default now()
);

-- 3. Listings Table (property listings)
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  purpose listing_purpose not null, -- vente ou location
  kind property_kind not null,
  price numeric(12,2) not null,
  currency text default 'TND',
  address text,
  city text default 'Bizerte',
  latitude double precision,
  longitude double precision,
  bedrooms int,
  bathrooms int,
  area_m2 int,
  year_built int,
  status listing_status default 'brouillon',
  main_image_url text,
  owner_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes for listings
create index if not exists listings_purpose_idx on public.listings(purpose);
create index if not exists listings_kind_idx on public.listings(kind);
create index if not exists listings_status_idx on public.listings(status);
create index if not exists listings_city_idx on public.listings(city);
create index if not exists listings_slug_idx on public.listings(slug);

-- 4. Listing Media Table (photos and videos)
create table if not exists public.listing_media (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  url text not null,
  type text check (type in ('image','video')) not null,
  position int default 0,
  created_at timestamptz default now()
);

create index if not exists listing_media_listing_idx on public.listing_media(listing_id);
create index if not exists listing_media_position_idx on public.listing_media(listing_id, position);

-- 5. Reservations Table (rental bookings)
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  start_date date not null,
  end_date date not null,
  status reservation_status default 'pending',
  total_price numeric(12,2),
  notes text,
  contact_email text,
  contact_phone text,
  created_at timestamptz default now()
);

create index if not exists reservations_listing_idx on public.reservations(listing_id);
create index if not exists reservations_range_idx on public.reservations(start_date, end_date);
create index if not exists reservations_status_idx on public.reservations(status);

-- 6. Visits Table (property viewing appointments)
create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  scheduled_at timestamptz not null,
  duration_min int default 30,
  notes text,
  contact_email text,
  contact_phone text,
  contact_name text,
  status text check (status in ('pending','confirmed','cancelled','completed')) default 'pending',
  created_at timestamptz default now()
);

create index if not exists visits_listing_idx on public.visits(listing_id);
create index if not exists visits_time_idx on public.visits(scheduled_at);
create index if not exists visits_status_idx on public.visits(status);

-- 7. Favorites Table (user favorites)
create table if not exists public.favorites (
  user_id uuid references public.profiles(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete cascade,
  created_at timestamptz default now(),
  primary key(user_id, listing_id)
);

-- 8. Function to update timestamp
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end; 
$$ language plpgsql;

-- 9. Trigger for updating timestamps
create trigger listings_set_updated_at
before update on public.listings
for each row execute procedure public.set_updated_at();

-- =========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_media enable row level security;
alter table public.reservations enable row level security;
alter table public.visits enable row level security;
alter table public.favorites enable row level security;

-- Profiles policies
create policy "Profiles: read own" on public.profiles
  for select using (auth.uid() = id);

create policy "Profiles: insert self" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Profiles: update self" on public.profiles
  for update using (auth.uid() = id);

create policy "Profiles: admin read all" on public.profiles
  for select using (exists(
    select 1 from public.profiles p 
    where p.id = auth.uid() and p.role = 'admin'
  ));

-- Listings policies
create policy "Listings: public read published" on public.listings
  for select using (status = 'publie');

create policy "Listings: admin read all" on public.listings
  for select using (exists(
    select 1 from public.profiles p 
    where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "Listings: admin write" on public.listings
  for all using (exists(
    select 1 from public.profiles p 
    where p.id = auth.uid() and p.role = 'admin'
  ));

-- Media policies
create policy "Media: public read" on public.listing_media 
  for select using (exists(
    select 1 from public.listings l 
    where l.id = listing_id and l.status = 'publie'
  ));

create policy "Media: admin read all" on public.listing_media 
  for select using (exists(
    select 1 from public.profiles p 
    where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "Media: admin write" on public.listing_media 
  for all using (exists(
    select 1 from public.profiles p 
    where p.id = auth.uid() and p.role = 'admin'
  ));

-- Reservations policies
create policy "Reservations: public read by listing" on public.reservations
  for select using (true);

create policy "Reservations: create by auth users" on public.reservations
  for insert with check (auth.uid() is not null or auth.uid() is null);

create policy "Reservations: manage by admin" on public.reservations
  for all using (exists(
    select 1 from public.profiles p 
    where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "Reservations: users read own" on public.reservations
  for select using (auth.uid() = user_id);

-- Visits policies
create policy "Visits: public read by listing" on public.visits
  for select using (true);

create policy "Visits: create by auth users" on public.visits
  for insert with check (auth.uid() is not null or auth.uid() is null);

create policy "Visits: manage by admin" on public.visits
  for all using (exists(
    select 1 from public.profiles p 
    where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "Visits: users read own" on public.visits
  for select using (auth.uid() = user_id);

-- Favorites policies
create policy "Favorites: read own" on public.favorites
  for select using (auth.uid() = user_id);

create policy "Favorites: write own" on public.favorites
  for all using (auth.uid() = user_id);

-- =========================================
-- STORAGE SETUP
-- =========================================

-- Create a storage bucket for listing media
-- This should be done via the Supabase Dashboard > Storage
-- Bucket name: listings-media
-- Public: Yes

-- Storage policies for listings-media bucket
create policy "Listings Media: Public Access"
on storage.objects for select
using (bucket_id = 'listings-media');

create policy "Listings Media: Admin Upload"
on storage.objects for insert
with check (
  bucket_id = 'listings-media' 
  and exists(
    select 1 from public.profiles p 
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "Listings Media: Admin Delete"
on storage.objects for delete
using (
  bucket_id = 'listings-media' 
  and exists(
    select 1 from public.profiles p 
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- =========================================
-- AUTOMATIC PROFILE CREATION
-- =========================================

-- Function to automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'phone',
    'admin' -- First user gets admin, others get client by default
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function when a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================
-- SAMPLE DATA (Optional)
-- =========================================

-- Insert sample admin user (after creating auth user manually)
-- Replace 'uuid-of-admin-user' with actual UUID from auth.users
/*
insert into public.profiles (id, full_name, phone, role) values 
('uuid-of-admin-user', 'Admin MEFTAHI', '+21670123456', 'admin');
*/

-- Insert sample listings
/*
insert into public.listings (
  title, slug, description, purpose, kind, price, 
  address, city, bedrooms, bathrooms, area_m2, status
) values 
(
  'Appartement moderne à Bizerte Centre',
  'appartement-moderne-bizerte-centre',
  'Magnifique appartement de 3 pièces au cœur de Bizerte avec vue sur le port.',
  'location',
  'appartement', 
  800.00,
  'Avenue Habib Bourguiba',
  'Bizerte',
  2,
  1,
  85,
  'publie'
),
(
  'Villa avec jardin - Zone résidentielle',
  'villa-avec-jardin-zone-residentielle',
  'Belle villa familiale avec grand jardin dans quartier calme.',
  'vente',
  'villa',
  180000.00,
  'Rue des Palmiers',
  'Bizerte',
  4,
  2,
  150,
  'publie'
);
*/