// types/index.ts

import { Database } from './supabase';

// User Profile
export type Profile = {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  county: string | null;
  created_at: string;
  updated_at: string;
  role: 'user' | 'admin' | 'moderator';
};

// Case
export type Case = {
  id: string;
  case_type: string;
  county: string;
  short_description: string;
  detailed_description: string | null;
  observation_date: string;
  location_details: LocationDetails | null;
  status: 'pending' | 'verified' | 'rejected' | 'under_review';
  reporter_id: string;
  created_at: string;
  updated_at: string;
};

// Location Details
export type LocationDetails = {
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  additional_info?: string;
};

// Evidence File
export type EvidenceFile = {
  id: string;
  case_id: string;
  file_path: string;
  file_type: string;
  created_at: string;
};

// Verification Record
export type VerificationRecord = {
  id: string;
  case_id: string;
  admin_id: string;
  verification_notes: string | null;
  contact_method: string | null;
  status: 'verified' | 'rejected' | 'needs_more_info';
  created_at: string;
};

// County
export type County = {
  id: string;
  name: string;
  created_at: string;
};

// Case Type
export type CaseType = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

// Form input types
export type CaseFormInput = {
  case_type: string;
  county: string;
  short_description: string;
  detailed_description: string;
  observation_date: Date;
  location_address: string;
  location_coordinates: { lat: number; lng: number } | null;
  files: File[];
  contact_consent: boolean;
};

// Supabase specific types - use these when working directly with the database
export type DbProfile = Database['public']['Tables']['profiles']['Row'];
export type DbCase = Database['public']['Tables']['cases']['Row'];
export type DbEvidenceFile = Database['public']['Tables']['evidence_files']['Row'];
export type DbVerificationRecord = Database['public']['Tables']['verification_records']['Row'];
export type DbCounty = Database['public']['Tables']['counties']['Row'];
export type DbCaseType = Database['public']['Tables']['case_types']['Row'];

// For creating new rows
export type NewCase = Omit<Case, 'id' | 'created_at' | 'updated_at'>;
export type NewEvidenceFile = Omit<EvidenceFile, 'id' | 'created_at'>;
export type NewVerificationRecord = Omit<VerificationRecord, 'id' | 'created_at'>;

// For updating existing rows
export type UpdateProfile = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
export type UpdateCase = Partial<Omit<Case, 'id' | 'created_at' | 'updated_at'>>;