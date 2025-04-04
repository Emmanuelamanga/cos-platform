// types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone_number: string | null
          county: string | null
          created_at: string
          updated_at: string
          role: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone_number?: string | null
          county?: string | null
          created_at?: string
          updated_at?: string
          role?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone_number?: string | null
          county?: string | null
          created_at?: string
          updated_at?: string
          role?: string
        }
      }
      cases: {
        Row: {
          id: string
          case_type: string
          county: string
          short_description: string
          detailed_description: string | null
          observation_date: string
          location_details: Json | null
          status: string
          reporter_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          case_type: string
          county: string
          short_description: string
          detailed_description?: string | null
          observation_date: string
          location_details?: Json | null
          status?: string
          reporter_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          case_type?: string
          county?: string
          short_description?: string
          detailed_description?: string | null
          observation_date?: string
          location_details?: Json | null
          status?: string
          reporter_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      evidence_files: {
        Row: {
          id: string
          case_id: string
          file_path: string
          file_type: string
          created_at: string
        }
        Insert: {
          id?: string
          case_id: string
          file_path: string
          file_type: string
          created_at?: string
        }
        Update: {
          id?: string
          case_id?: string
          file_path?: string
          file_type?: string
          created_at?: string
        }
      }
      verification_records: {
        Row: {
          id: string
          case_id: string
          admin_id: string
          verification_notes: string | null
          contact_method: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          case_id: string
          admin_id: string
          verification_notes?: string | null
          contact_method?: string | null
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          case_id?: string
          admin_id?: string
          verification_notes?: string | null
          contact_method?: string | null
          status?: string
          created_at?: string
        }
      }
      counties: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      case_types: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}