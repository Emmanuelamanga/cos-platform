// types/props.ts

import { Profile, Case, County, CaseType, VerificationRecord, EvidenceFile } from './index';
import { User } from '@supabase/supabase-js';

// User-related component props
export interface UserNavProps {
  user: Profile;
}

export interface UserProfileCardProps {
  profile: Profile;
  isLoading?: boolean;
  onEdit?: () => void;
}

export interface UserCasesTableProps {
  userId: string;
  limit?: number;
  showViewAll?: boolean;
}

export interface UserNotificationsProps {
  userId: string;
  limit?: number;
  showViewAll?: boolean;
}

// Case-related component props
export interface CaseCardProps {
  caseData: Case;
  isDetailed?: boolean;
  actions?: React.ReactNode;
}

export interface CaseDetailProps {
  caseData: Case;
  evidenceFiles: EvidenceFile[];
  verificationRecord?: VerificationRecord;
}

export interface CaseFilterProps {
  counties: County[];
  caseTypes: CaseType[];
  selectedCounty?: string;
  selectedType?: string;
  selectedDate?: string;
  query?: string;
  onChange?: (filters: any) => void;
}

export interface CaseListProps {
  cases: Case[];
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
}

export interface FileUploaderProps {
  files: File[];
  setFiles: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  accept?: string;
  disabled?: boolean;
}

// Layout component props
export interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export interface TabsProps {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
  defaultTab?: string;
}

export interface SubmitCaseClientProps {
  profile: Profile;
  caseTypes: CaseType[];
  counties: County[];
  user: User;
}

export interface DateRangePickerProps {
  onChange: (range: { from: Date; to: Date }) => void;
  value: { from: Date; to: Date } | undefined;
}

export interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
}

export interface ConfirmDialogProps {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

export interface StatusBadgeProps {
  status: 'pending' | 'verified' | 'rejected' | 'under_review';
}