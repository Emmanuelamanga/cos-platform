"use client";
// components/dashboard/recent-verifications-table.tsx

import { useState, useEffect } from "react";
import { CheckCircle, Eye, XCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { cn } from "@/lib/utils";

type Verification = {
  id: string;
  caseId: string;
  status: "verified" | "rejected";
  description: string;
  verifiedBy: string;
  date: string;
};

export function RecentVerificationsTable() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    async function fetchVerifications() {
      try {
        setLoading(true);
        
        // First check if the tables exist by querying table information
        const { data: tableInfo, error: tableError } = await supabase
          .from('verification_records')
          .select('id')
          .limit(1);
          
        if (tableError) {
          console.warn('Error checking verification_records table:', tableError);
          throw new Error(`Table error: ${tableError.message}`);
        }
        
        // Query verification records along with related case information
        const { data, error } = await supabase
          .from('verification_records')
          .select(`
            id,
            status,
            created_at,
            case_id,
            admin_id
          `)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) {
          throw new Error(`Query error: ${error.message}`);
        }
        
        if (!data || data.length === 0) {
          setVerifications([]);
          return;
        }
        
        // Get the case details in a separate query
        const caseIds = data.map(record => record.case_id);
        const { data: casesData, error: casesError } = await supabase
          .from('cases')
          .select('id, short_description')
          .in('id', caseIds);
          
        if (casesError) {
          throw new Error(`Cases query error: ${casesError.message}`);
        }
        
        // Get admin details
        const adminIds = data.map(record => record.admin_id);
        const { data: adminsData, error: adminsError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', adminIds);
          
        if (adminsError) {
          throw new Error(`Admins query error: ${adminsError.message}`);
        }
        
        // Create a lookup map for faster access
        const casesMap = (casesData || []).reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});
        
        const adminsMap = (adminsData || []).reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});
        
        // Transform the data to match the component's expected format
        const formattedData: Verification[] = data.map(record => {
          const caseInfo = casesMap[record.case_id] || { short_description: 'Unknown case' };
          const adminInfo = adminsMap[record.admin_id] || { full_name: 'Unknown admin' };
          
          return {
            id: record.id,
            caseId: record.case_id,
            status: record.status?.toLowerCase() === 'approved' ? 'verified' : 'rejected',
            description: caseInfo.short_description,
            verifiedBy: adminInfo.full_name,
            date: new Date(record.created_at).toISOString().split('T')[0]
          };
        });
        
        setVerifications(formattedData);
      } catch (err) {
        console.error('Error fetching verification records:', err);
        setError(`Failed to load verification records: ${err.message}`);
        
        // Fall back to empty data
        setVerifications([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchVerifications();
  }, [supabase]);

  if (loading) {
    return <div className="py-10 text-center">Loading verification records...</div>;
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <p className="text-red-500 mb-2">{error}</p>
        <p className="text-sm text-muted-foreground">Showing sample data instead</p>
        
        {/* Display sample data as fallback */}
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>CAS-001</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[250px] truncate">
                  Sample case description
                </TableCell>
                <TableCell>2023-06-18</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Case ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {verifications.length > 0 ? (
            verifications.map((verification) => (
              <TableRow key={verification.id}>
                <TableCell>{verification.caseId.substring(0, 8)}</TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      verification.status === "verified" &&
                        "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800",
                      verification.status === "rejected" &&
                        "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
                    )}
                  >
                    {verification.status === "verified" ? (
                      <CheckCircle className="mr-1 h-3 w-3" />
                    ) : (
                      <XCircle className="mr-1 h-3 w-3" />
                    )}
                    {verification.status === "verified"
                      ? "Verified"
                      : "Rejected"}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[250px] truncate">
                  {verification.description}
                </TableCell>
                <TableCell>{verification.date}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/cases/${verification.caseId}`}>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-6 text-muted-foreground"
              >
                No recent verifications
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}