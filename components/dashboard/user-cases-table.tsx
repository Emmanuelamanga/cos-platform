'use client';
// components/dashboard/user-cases-table.tsx

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client'; // Updated import
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EyeIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

type Case = {
  id: string;
  case_type: string;
  county: string;
  short_description: string;
  observation_date: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
};

type UserCasesTableProps = {
  userId: string;
};

export function UserCasesTable({ userId }: UserCasesTableProps) {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use the new client
  const supabase = createClient();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('cases')
          .select(`
            id,
            case_type,
            county,
            short_description,
            observation_date,
            status,
            created_at
          `)
          .eq('reporter_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setCases(data || []);
      } catch (err) {
        console.error('Error fetching cases:', err);
        setError('Failed to load your cases. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [userId, supabase]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <ClockIcon className="mr-1 h-3 w-3" /> Pending
          </Badge>
        );
      case 'verified':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircleIcon className="mr-1 h-3 w-3" /> Verified
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircleIcon className="mr-1 h-3 w-3" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading your cases...</div>;
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 my-4">
        <div className="flex">
          <div className="text-red-700">{error}</div>
        </div>
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">You haven&apos;t submitted any cases yet.</p>
        <Link href="/submit-case">
          <Button>Submit Your First Case</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Case Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>County</TableHead>
            <TableHead>Observation Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.case_type}</TableCell>
              <TableCell className="max-w-[200px] truncate">{c.short_description}</TableCell>
              <TableCell>{c.county}</TableCell>
              <TableCell>
                {new Date(c.observation_date).toLocaleDateString()}
              </TableCell>
              <TableCell>{getStatusBadge(c.status)}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/cases/${c.id}`}>
                  <Button size="sm" variant="ghost">
                    <EyeIcon className="h-4 w-4 mr-1" /> View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}