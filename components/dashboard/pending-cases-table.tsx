"use client";
// components/dashboard/pending-cases-table.tsx

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Added missing import
import { Input } from "@/components/ui/input";
import { ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type Case = {
  id: string;
  case_type: string;
  county: string;
  short_description: string;
  submitted_on: string;
  reporter: string;
};

export function PendingCasesTable() {
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClientComponentClient();
  
  // Fetch cases from Supabase
  useEffect(() => {
    async function fetchPendingCases() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('cases')
          .select(`
            id,
            case_type,
            county,
            short_description,
            created_at,
            profiles:reporter_id (
              full_name
            )
          `)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Transform the data to match the component's expected format
        const formattedData: Case[] = data.map(caseItem => ({
          id: caseItem.id.substring(0, 8).toUpperCase(), // Format as CAS-XXX
          case_type: caseItem.case_type,
          county: caseItem.county,
          short_description: caseItem.short_description,
          submitted_on: new Date(caseItem.created_at).toISOString().split('T')[0],
          reporter: caseItem.profiles.full_name
        }));
        
        setCases(formattedData);
        setFilteredCases(formattedData);
      } catch (err) {
        console.error('Error fetching pending cases:', err);
        setError('Failed to load pending cases');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPendingCases();
  }, [supabase]);
  
  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCases(cases);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = cases.filter(caseItem => 
      caseItem.id.toLowerCase().includes(query) ||
      caseItem.case_type.toLowerCase().includes(query) ||
      caseItem.county.toLowerCase().includes(query) ||
      caseItem.short_description.toLowerCase().includes(query) ||
      caseItem.reporter.toLowerCase().includes(query)
    );
    
    setFilteredCases(filtered);
  }, [searchQuery, cases]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return <div className="py-10 text-center">Loading pending cases...</div>;
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search cases..." 
          className="h-8 w-full" 
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>County</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCases.length > 0 ? (
              filteredCases.map((caseItem) => (
                <TableRow key={caseItem.id}>
                  <TableCell>{caseItem.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{caseItem.case_type}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[250px] truncate">
                    {caseItem.short_description}
                  </TableCell>
                  <TableCell>{caseItem.county}</TableCell>
                  <TableCell>{caseItem.submitted_on}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/cases/${caseItem.id}`}>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground"
                >
                  {searchQuery ? "No cases match your search" : "No pending cases to verify"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}