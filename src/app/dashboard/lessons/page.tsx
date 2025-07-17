import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function LessonsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Lessons</h1>
        <p className="text-muted-foreground">Manage and track educational materials.</p>
      </div>
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>This section is under development.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[300px]">
          <BookOpen className="h-16 w-16 mb-4" />
          <p className="text-lg font-semibold">Lesson & Certificate Management</p>
          <p>Create lessons, track member progress, and award certificates.</p>
        </CardContent>
      </Card>
    </div>
  );
}
