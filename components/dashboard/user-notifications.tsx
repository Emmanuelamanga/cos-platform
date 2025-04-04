// user-notifications 

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function UserNotifications() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <Badge className="text-xs">4</Badge>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between space-x-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">You have a new message!</p>
                            <p className="text-xs text-muted-foreground">
                                2 minutes ago
                            </p>
                        </div>
                        <Button size="sm">View</Button>
                    </div>
                    <div className="flex items-center justify-between space-x-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                                New product launch!
                            </p>
                            <p className="text-xs text-muted-foreground">
                                1 hour ago
                            </p>
                        </div>
                        <Button size="sm">View</Button>
                    </div>
                    <div className="flex items-center justify-between space-x-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                                New product launch!
                            </p>
                            <p className="text-xs text-muted-foreground">
                                1 hour ago
                            </p>
                        </div>
                        <Button size="sm">View</Button>
                    </div>
                </div>
                <Link href="/dashboard/notifications" className="text-xs text-muted-foreground mt-4 inline-flex items-center">
                    View all <span className="ml-2" aria-hidden="true">→</span>
                </Link>
            </CardContent>
        </Card>
    )
}