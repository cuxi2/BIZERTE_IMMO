// Database type definitions for MEFTAHI IMMO

export type PropertyKind = 
  | 'appartement'
  | 'villa'
  | 'studio' 
  | 'terrain'
  | 'bureau'
  | 'autre';

export type ListingPurpose = 'vente' | 'location';

export type ListingStatus = 
  | 'brouillon'
  | 'publie'
  | 'reserve'
  | 'occupe'
  | 'vendu'
  | 'retire';

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export type VisitStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type UserRole = 'admin' | 'agent' | 'client';

export interface Profile {
  id: string;
  full_name?: string;
  phone?: string;
  role: UserRole;
  created_at: string;
}

export interface Listing {
  id: string;
  title: string;
  slug: string;
  description?: string;
  purpose: ListingPurpose;
  kind: PropertyKind;
  price: number;
  currency: string;
  address?: string;
  city: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  area_m2?: number;
  year_built?: number;
  status: ListingStatus;
  main_image_url?: string;
  owner_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ListingMedia {
  id: string;
  listing_id: string;
  url: string;
  type: 'image' | 'video';
  position: number;
  created_at: string;
}

export interface Reservation {
  id: string;
  listing_id: string;
  user_id?: string;
  start_date: string;
  end_date: string;
  status: ReservationStatus;
  total_price?: number;
  notes?: string;
  contact_email?: string;
  contact_phone?: string;
  created_at: string;
}

export interface Visit {
  id: string;
  listing_id: string;
  user_id?: string;
  scheduled_at: string;
  duration_min: number;
  notes?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_name?: string;
  status: VisitStatus;
  created_at: string;
}

export interface Favorite {
  user_id: string;
  listing_id: string;
  created_at: string;
}

// Extended types for frontend usage
export interface ListingWithMedia extends Listing {
  media?: ListingMedia[];
  reservations?: Reservation[];
}

export interface CreateListingData {
  title: string;
  description?: string;
  purpose: ListingPurpose;
  kind: PropertyKind;
  price: number;
  currency?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  area_m2?: number;
  year_built?: number;
  status?: ListingStatus;
}

export interface UpdateListingData extends Partial<CreateListingData> {
  id: string;
}

export interface CreateReservationData {
  listing_id: string;
  start_date: string;
  end_date: string;
  notes?: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface CreateVisitData {
  listing_id: string;
  scheduled_at: string;
  duration_min?: number;
  notes?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_name?: string;
}

// Filter types for searching
export interface ListingFilters {
  purpose?: ListingPurpose;
  kind?: PropertyKind;
  city?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  min_area?: number;
  max_area?: number;
  available_from?: string;
  available_to?: string;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form types
export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  message: string;
  listing_id?: string;
}

export interface SearchParams {
  q?: string;
  purpose?: ListingPurpose;
  kind?: PropertyKind;
  city?: string;
  min_price?: string;
  max_price?: string;
  bedrooms?: string;
  bathrooms?: string;
  sort?: 'price_asc' | 'price_desc' | 'date_desc' | 'date_asc';
}