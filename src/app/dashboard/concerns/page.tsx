import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export default function ConcernsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Concerns Center</h1>
        <p className="text-muted-foreground">Address and track all raised concerns.</p>
      </div>
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>This section is under development.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[300px]">
          <ShieldAlert className="h-16 w-16 mb-4" />
          <p className="text-lg font-semibold">Centralized Concerns Hub</p>
          <p>Review, manage, and respond to concerns raised by members and leaders.</p>
        </CardContent>
      </Card>
    </div>
  );
}
