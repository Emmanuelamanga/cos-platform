// types/auth.ts

import { User, Session } from '@supabase/supabase-js';
import { Profile } from './index';

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<{ error: Error | null, data: any | null }>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<{ error: Error | null, data: Profile | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

// Sign In Form
export interface SignInFormValues {
  email: string;
  password: string;
}

// Sign Up Form
export interface SignUpFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  phone_number?: string;
  county?: string;
  terms_accepted: boolean;
}

// Reset Password Form
export interface ResetPasswordFormValues {
  email: string;
}

// Update Password Form
export interface UpdatePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Update Profile Form
export interface UpdateProfileFormValues {
  full_name: string;
  phone_number?: string;
  county?: string;
  email?: string;
}