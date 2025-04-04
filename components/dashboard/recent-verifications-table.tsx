// components/dashboard/recent-verifications-table.tsx
("use client");

import { CheckCircle, Eye, XCircle } from "lucide-react";

type Verification = {
  id: string;
  caseId: string;
  status: "verified" | "rejected";
  description: string;
  verifiedBy: string;
  date: string;
};

export function RecentVerificationsTable() {
  const [verifications, setVerifications] = useState<Verification[]>([
    {
      id: "VER-001",
      caseId: "CAS-101",
      status: "verified",
      description: "Road maintenance issue in CBD",
      verifiedBy: "Admin User",
      date: "2023-06-17",
    },
    {
      id: "VER-002",
      caseId: "CAS-102",
      status: "rejected",
      description: "Complaint about local business",
      verifiedBy: "Admin User",
      date: "2023-06-16",
    },
    {
      id: "VER-003",
      caseId: "CAS-103",
      status: "verified",
      description: "Public park vandalism report",
      verifiedBy: "Moderator",
      date: "2023-06-15",
    },
    {
      id: "VER-004",
      caseId: "CAS-104",
      status: "verified",
      description: "Water shortage in residential area",
      verifiedBy: "Admin User",
      date: "2023-06-15",
    },
  ]);

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
                <TableCell>{verification.caseId}</TableCell>
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