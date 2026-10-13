/**
 * Database types for Supabase.
 *
 * This file mirrors supabase/migrations/001_initial_schema.sql and is written by hand
 * so the project type-checks out of the box. Once your Supabase project is running you
 * can regenerate it from the real database with:
 *
 *   npm run db:types
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
export type UserRole = 'user' | 'agent' | 'admin';
export type AreaUnit = 'sq_m' | 'hectare' | 'bigha' | 'biswa' | 'kanal' | 'marla' | 'acre';
export type LandType =
  | 'irrigated'
  | 'unirrigated'
  | 'orchard'
  | 'residential'
  | 'commercial'
  | 'forest'
  | 'pasture'
  | 'barren'
  | 'other';
export type MutationType =
  | 'sale'
  | 'inheritance'
  | 'gift'
  | 'partition'
  | 'lease'
  | 'mortgage'
  | 'court_order'
  | 'other';
export type MutationStatus = 'pending' | 'attested' | 'rejected';
export type ListingStatus =
  | 'draft'
  | 'pending_review'
  | 'active'
  | 'sold'
  | 'withdrawn'
  | 'rejected'
  | 'expired';
export type ReportType = 'pre_purchase' | 'ownership_history' | 'encumbrance' | 'mutation_summary';
export type ReportStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type RiskLevel = 'low' | 'medium' | 'high' | 'unknown';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

// ---------------------------------------------------------------------------
// Row types (use `type`, not `interface`, so they satisfy supabase-js generics)
// ---------------------------------------------------------------------------
export type ProfileRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  preferred_locale: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type LandRecordRow = {
  id: string;
  district: string;
  tehsil: string;
  village: string;
  khasra_number: string;
  khewat_number: string | null;
  khatauni_number: string | null;
  owner_name: string;
  father_name: string | null;
  area: number;
  area_unit: AreaUnit;
  land_type: LandType;
  jamabandi_year: number;
  raw_data: Json;
  map_geojson: Json | null;
  source: string | null;
  is_verified: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type MutationRow = {
  id: string;
  land_record_id: string;
  mutation_number: string;
  mutation_type: MutationType;
  mutation_date: string | null;
  status: MutationStatus;
  previous_owner: string | null;
  new_owner: string | null;
  area_affected: number | null;
  area_unit: AreaUnit;
  remarks: string | null;
  raw_data: Json;
  created_at: string;
  updated_at: string;
};

export type ListingRow = {
  id: string;
  seller_id: string;
  land_record_id: string | null;
  title: string;
  description: string | null;
  district: string;
  tehsil: string;
  village: string;
  price: number;
  price_negotiable: boolean;
  area: number;
  area_unit: AreaUnit;
  land_type: LandType;
  contact_name: string | null;
  contact_phone: string | null;
  images: string[];
  latitude: number | null;
  longitude: number | null;
  status: ListingStatus;
  is_verified: boolean;
  is_featured: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ReportRow = {
  id: string;
  user_id: string;
  land_record_id: string | null;
  listing_id: string | null;
  report_type: ReportType;
  status: ReportStatus;
  risk_level: RiskLevel | null;
  title: string;
  summary: string | null;
  findings: Json;
  input_params: Json;
  file_path: string | null;
  payment_status: PaymentStatus;
  amount_paid: number | null;
  payment_reference: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SavedSearchRow = {
  id: string;
  user_id: string;
  name: string;
  params: Json;
  created_at: string;
};

// ---------------------------------------------------------------------------
// Insert helper: columns with defaults become optional
// ---------------------------------------------------------------------------
type WithOptional<Row, Keys extends keyof Row> = Omit<Row, Keys> & Partial<Pick<Row, Keys>>;

export type ProfileInsert = WithOptional<
  ProfileRow,
  | 'full_name'
  | 'phone'
  | 'role'
  | 'preferred_locale'
  | 'avatar_url'
  | 'created_at'
  | 'updated_at'
>;

export type LandRecordInsert = WithOptional<
  LandRecordRow,
  | 'id'
  | 'khewat_number'
  | 'khatauni_number'
  | 'father_name'
  | 'area_unit'
  | 'land_type'
  | 'raw_data'
  | 'map_geojson'
  | 'source'
  | 'is_verified'
  | 'created_by'
  | 'created_at'
  | 'updated_at'
>;

export type MutationInsert = WithOptional<
  MutationRow,
  | 'id'
  | 'mutation_type'
  | 'mutation_date'
  | 'status'
  | 'previous_owner'
  | 'new_owner'
  | 'area_affected'
  | 'area_unit'
  | 'remarks'
  | 'raw_data'
  | 'created_at'
  | 'updated_at'
>;

export type ListingInsert = WithOptional<
  ListingRow,
  | 'id'
  | 'land_record_id'
  | 'description'
  | 'price_negotiable'
  | 'area_unit'
  | 'land_type'
  | 'contact_name'
  | 'contact_phone'
  | 'images'
  | 'latitude'
  | 'longitude'
  | 'status'
  | 'is_verified'
  | 'is_featured'
  | 'expires_at'
  | 'created_at'
  | 'updated_at'
>;

export type ReportInsert = WithOptional<
  ReportRow,
  | 'id'
  | 'land_record_id'
  | 'listing_id'
  | 'report_type'
  | 'status'
  | 'risk_level'
  | 'summary'
  | 'findings'
  | 'input_params'
  | 'file_path'
  | 'payment_status'
  | 'amount_paid'
  | 'payment_reference'
  | 'completed_at'
  | 'created_at'
  | 'updated_at'
>;

export type SavedSearchInsert = WithOptional<SavedSearchRow, 'id' | 'params' | 'created_at'>;

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      land_records: {
        Row: LandRecordRow;
        Insert: LandRecordInsert;
        Update: Partial<LandRecordRow>;
        Relationships: [
          {
            foreignKeyName: 'land_records_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      mutations: {
        Row: MutationRow;
        Insert: MutationInsert;
        Update: Partial<MutationRow>;
        Relationships: [
          {
            foreignKeyName: 'mutations_land_record_id_fkey';
            columns: ['land_record_id'];
            isOneToOne: false;
            referencedRelation: 'land_records';
            referencedColumns: ['id'];
          },
        ];
      };
      listings: {
        Row: ListingRow;
        Insert: ListingInsert;
        Update: Partial<ListingRow>;
        Relationships: [
          {
            foreignKeyName: 'listings_seller_id_fkey';
            columns: ['seller_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'listings_land_record_id_fkey';
            columns: ['land_record_id'];
            isOneToOne: false;
            referencedRelation: 'land_records';
            referencedColumns: ['id'];
          },
        ];
      };
      reports: {
        Row: ReportRow;
        Insert: ReportInsert;
        Update: Partial<ReportRow>;
        Relationships: [
          {
            foreignKeyName: 'reports_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reports_land_record_id_fkey';
            columns: ['land_record_id'];
            isOneToOne: false;
            referencedRelation: 'land_records';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reports_listing_id_fkey';
            columns: ['listing_id'];
            isOneToOne: false;
            referencedRelation: 'listings';
            referencedColumns: ['id'];
          },
        ];
      };
      saved_searches: {
        Row: SavedSearchRow;
        Insert: SavedSearchInsert;
        Update: Partial<SavedSearchRow>;
        Relationships: [
          {
            foreignKeyName: 'saved_searches_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      search_land_records: {
        Args: {
          p_district?: string;
          p_tehsil?: string;
          p_village?: string;
          p_khasra?: string;
          p_khewat?: string;
          p_khatauni?: string;
          p_owner?: string;
          p_year?: number;
          p_limit?: number;
          p_offset?: number;
        };
        Returns: LandRecordRow[];
      };
    };
    Enums: {
      user_role: UserRole;
      area_unit: AreaUnit;
      land_type: LandType;
      mutation_type: MutationType;
      mutation_status: MutationStatus;
      listing_status: ListingStatus;
      report_type: ReportType;
      report_status: ReportStatus;
      risk_level: RiskLevel;
      payment_status: PaymentStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// ---------------------------------------------------------------------------
// Convenience helpers (same shape as the Supabase CLI generates)
// ---------------------------------------------------------------------------
type PublicSchema = Database['public'];

export type Tables<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Row'];
export type TablesInsert<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Update'];
export type Enums<T extends keyof PublicSchema['Enums']> = PublicSchema['Enums'][T];
