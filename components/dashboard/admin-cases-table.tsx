"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ChevronRight, 
  MoreVertical, 
  Check, 
  X, 
  Search, 
  FileText, 
  ArrowUpDown,
  Filter,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Case {
  id: string;
  case_type: string;
  county: string;
  short_description: string;
  status: string;
  reporter_name: string;
  created_at: string;
}

interface AdminCasesTableProps {
  filter: "all" | "pending" | "verified" | "rejected";
}

export function AdminCasesTable({ filter }: AdminCasesTableProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [countyFilter, setCountyFilter] = useState<string>("all");
  const [caseTypeFilter, setCaseTypeFilter] = useState<string>("all");
  
  const [counties, setCounties] = useState<string[]>([]);
  const [caseTypes, setCaseTypes] = useState<string[]>([]);
  
  // Initial data fetch
  useEffect(() => {
    async function fetchCases() {
      try {
        setLoading(true);
        
        // Build the query
        let query = supabase
          .from('cases')
          .select(`
            id,
            case_type,
            county,
            short_description,
            status,
            created_at,
            reporter_id,
            profiles:profiles(full_name)
          `);
        
        // Add status filter
        if (filter !== "all") {
          query = query.eq('status', filter);
        }
        
        // Execute query
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Extract unique counties and case types
        const uniqueCounties = [...new Set(data?.map(item => item.county) || [])];
        const uniqueCaseTypes = [...new Set(data?.map(item => item.case_type) || [])];
        
        setCounties(uniqueCounties);
        setCaseTypes(uniqueCaseTypes);
        
        // Transform data
        const formattedData = data?.map(item => ({
          id: item.id,
          case_type: item.case_type,
          county: item.county,
          short_description: item.short_description,
          status: item.status,
          reporter_name: item.profiles?.full_name || "Unknown",
          created_at: item.created_at
        })) || [];
        
        setCases(formattedData);
        setFilteredCases(formattedData);
      } catch (err) {
        console.error("Error fetching cases:", err);
        setError("Failed to load cases data");
        setCases([]);
        setFilteredCases([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCases();
  }, [supabase, filter]);
  
  // Apply filters, sorting and search
  useEffect(() => {
    let result = [...cases];
    
    // Apply county filter
    if (countyFilter !== "all") {
      result = result.filter(item => item.county === countyFilter);
    }
    
    // Apply case type filter
    if (caseTypeFilter !== "all") {
      result = result.filter(item => item.case_type === caseTypeFilter);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item => item.short_description.toLowerCase().includes(query) ||
               item.id.toLowerCase().includes(query) ||
               item.county.toLowerCase().includes(query) ||
               item.case_type.toLowerCase().includes(query) ||
               item.reporter_name.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB;
      
      // Determine sort values based on column
      switch (sortBy) {
        case "created_at":
          valueA = new Date(a.created_at).getTime();
          valueB = new Date(b.created_at).getTime();
          break;
        case "short_description":
          valueA = a.short_description;
          valueB = b.short_description;
          break;
        case "case_type":
          valueA = a.case_type;
          valueB = b.case_type;
          break;
        case "county":
          valueA = a.county;
          valueB = b.county;
          break;
        default:
          valueA = a[sortBy];
          valueB = b[sortBy];
      }
      
      // Compare values based on sort order
      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    setFilteredCases(result);
  }, [cases, searchQuery, sortBy, sortOrder, countyFilter, caseTypeFilter]);
  
  // Handle sort toggle
  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  
  // Quick verification handlers
  const handleVerifyCase = async (caseId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("You must be logged in to verify cases");
        return;
      }
      
      // Create verification record
      await supabase
        .from('verification_records')
        .insert({
          case_id: caseId,
          admin_id: user.id,
          verification_notes: "Verified from cases list",
          status: "verified"
        });
        
      // Update case status
      await supabase
        .from('cases')
        .update({ 
          status: "verified", 
          updated_at: new Date().toISOString() 
        })
        .eq('id', caseId);
      
      // Refresh data
      router.refresh();
      
      // Update local state
      setCases(prevCases => 
        prevCases.map(item => 
          item.id === caseId ? { ...item, status: "verified" } : item
        )
      );
    } catch (error) {
      console.error("Error verifying case:", error);
      alert("Failed to verify case. Please try again.");
    }
  };
  
  const handleRejectCase = async (caseId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("You must be logged in to reject cases");
        return;
      }
      
      // Create verification record
      await supabase
        .from('verification_records')
        .insert({
          case_id: caseId,
          admin_id: user.id,
          verification_notes: "Rejected from cases list",
          status: "rejected"
        });
        
      // Update case status
      await supabase
        .from('cases')
        .update({ 
          status: "rejected", 
          updated_at: new Date().toISOString() 
        })
        .eq('id', caseId);
      
      // Refresh data
      router.refresh();
      
      // Update local state
      setCases(prevCases => 
        prevCases.map(item => 
          item.id === caseId ? { ...item, status: "rejected" } : item
        )
      );
    } catch (error) {
      console.error("Error rejecting case:", error);
      alert("Failed to reject case. Please try again.");
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading cases...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Button onClick={() => router.refresh()}>Retry</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search cases..." 
            className="h-8 w-full sm:w-[250px]" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Select value={countyFilter} onValueChange={setCountyFilter}>
              <SelectTrigger className="h-8 w-[150px]">
                <Filter className="h-3.5 w-3.5 mr-2" />
                <SelectValue placeholder="County" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Counties</SelectItem>
                {counties.map(county => (
                  <SelectItem key={county} value={county}>{county}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={caseTypeFilter} onValueChange={setCaseTypeFilter}>
              <SelectTrigger className="h-8 w-[150px]">
                <FileText className="h-3.5 w-3.5 mr-2" />
                <SelectValue placeholder="Case Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {caseTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <div className="flex items-center cursor-pointer" onClick={() => toggleSort("id")}>
                  ID
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => toggleSort("case_type")}>
                  Type
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="max-w-[250px]">
                <div className="flex items-center cursor-pointer" onClick={() => toggleSort("short_description")}>
                  Description
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => toggleSort("county")}>
                  County
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => toggleSort("status")}>
                  Status
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => toggleSort("created_at")}>
                  Date
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCases.length > 0 ? (
              filteredCases.map((caseItem) => (
                <TableRow key={caseItem.id}>
                  <TableCell className="font-medium">
                    {caseItem.id.substring(0, 8)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{caseItem.case_type}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[250px] truncate">
                    {caseItem.short_description}
                  </TableCell>
                  <TableCell>{caseItem.county}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        caseItem.status === "verified" ? "success" :
                        caseItem.status === "rejected" ? "destructive" :
                        "outline"
                      }
                      className="capitalize"
                    >
                      {caseItem.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(caseItem.created_at), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/cases/${caseItem.id}`}>
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {caseItem.status === "pending" && (
                            <>
                              <DropdownMenuItem onClick={() => handleVerifyCase(caseItem.id)}>
                                <Check className="mr-2 h-4 w-4 text-green-600" />
                                Verify
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRejectCase(caseItem.id)}>
                                <X className="mr-2 h-4 w-4 text-red-600" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Link href={`/admin/cases/${caseItem.id}`}>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No cases found
                  {(countyFilter !== "all" || caseTypeFilter !== "all" || searchQuery) && (
                    <div className="mt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSearchQuery("");
                          setCountyFilter("all");
                          setCaseTypeFilter("all");
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}