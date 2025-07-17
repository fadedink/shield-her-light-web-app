import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, ShieldAlert, BookOpen } from "lucide-react"
import { users } from "@/lib/data"


export default function DashboardPage() {
  const recentMembers = users.slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's a summary of your organization.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">+2 since last week</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Concerns</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 since yesterday</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">All members on track</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Recent Members</CardTitle>
            <CardDescription>
              A list of the most recent members who have joined.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Date Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentMembers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell className="text-right">2024-05-15</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="col-span-3 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Plan and prepare for upcoming activities.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                  <div className="bg-muted rounded-lg p-3 flex items-center justify-center">
                      <p className="font-bold text-primary">JUL<br/>28</p>
                  </div>
                  <div>
                      <p className="font-semibold">Leadership Summit</p>
                      <p className="text-sm text-muted-foreground">Online via Zoom</p>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <div className="bg-muted rounded-lg p-3 flex items-center justify-center">
                      <p className="font-bold text-primary">AUG<br/>12</p>
                  </div>
                  <div>
                      <p className="font-semibold">Community Outreach</p>
                      <p className="text-sm text-muted-foreground">Downtown Park</p>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <div className="bg-muted rounded-lg p-3 flex items-center justify-center">
                      <p className="font-bold text-primary">SEP<br/>05</p>
                  </div>
                  <div>
                      <p className="font-semibold">Quarterly Review Meeting</p>
                      <p className="text-sm text-muted-foreground">HQ Conference Room</p>
                  </div>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
