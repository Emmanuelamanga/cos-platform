// types/api.ts

import { Case, Profile, VerificationRecord, EvidenceFile, County, CaseType } from './index';

// Generic API response
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

// Case-related API responses
export interface GetCasesResponse extends ApiResponse<Case[]> {
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
  };
}

export type GetCaseResponse = ApiResponse<{
  caseData: Case;
  reporter: Profile;
  evidenceFiles: EvidenceFile[];
  verificationRecord?: VerificationRecord;
}>

export type SubmitCaseResponse = ApiResponse<{
  case: Case;
  evidenceUploadUrls?: string[];
}>

// User-related API responses
export type GetUserCasesResponse = ApiResponse<{
  cases: Case[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
  };
}>

export type GetUserProfileResponse = ApiResponse<Profile>

export type UpdateProfileResponse = ApiResponse<Profile>

// Admin-related API responses
export type VerifyCaseResponse = ApiResponse<{
  case: Case;
  verificationRecord: VerificationRecord;
}>

export type GetDashboardStatsResponse = ApiResponse<{
  totalCases: number;
  pendingCases: number;
  verifiedCases: number;
  rejectedCases: number;
  casesPerCounty: { county: string; count: number }[];
  casesPerType: { type: string; count: number }[];
  recentCases: Case[];
}>

// Reference data API responses
export type GetCountiesResponse = ApiResponse<County[]>

export type GetCaseTypesResponse = ApiResponse<CaseType[]>

// Filter parameters for API requests
export interface CaseFilterParams {
  county?: string;
  case_type?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  reporter_id?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Verification request parameters
export interface VerifyCaseParams {
  case_id: string;
  admin_id: string;
  status: 'verified' | 'rejected' | 'needs_more_info';
  verification_notes?: string;
  contact_method?: string;
}