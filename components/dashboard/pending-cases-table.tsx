// components/dashboard/pending-cases-table.tsx
("use client");

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/dashboard/user-cases-table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Case = {
  id: string;
  case_type: string;
  county: string;
  short_description: string;
  submitted_on: string;
  reporter: string;
};

export function PendingCasesTable() {
  const [cases, setCases] = useState<Case[]>([
    {
      id: "CAS-001",
      case_type: "Infrastructure",
      county: "Nairobi",
      short_description: "Broken water pipe on Moi Avenue",
      submitted_on: "2023-06-18",
      reporter: "John Doe",
    },
    {
      id: "CAS-002",
      case_type: "Public Service",
      county: "Mombasa",
      short_description: "Garbage not collected for two weeks",
      submitted_on: "2023-06-17",
      reporter: "Jane Smith",
    },
    {
      id: "CAS-003",
      case_type: "Environment",
      county: "Kisumu",
      short_description: "Industrial waste dumping near Lake Victoria",
      submitted_on: "2023-06-15",
      reporter: "David Ochieng",
    },
    {
      id: "CAS-004",
      case_type: "Public Service",
      county: "Nakuru",
      short_description: "Street lights not working on Main Street",
      submitted_on: "2023-06-14",
      reporter: "Sarah Kamau",
    },
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search cases..." className="h-8 w-full" />
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
            {cases.length > 0 ? (
              cases.map((caseItem) => (
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
                  No pending cases to verify
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}