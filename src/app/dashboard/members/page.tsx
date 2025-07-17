
'use client';

import * as React from 'react';
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
import { users as initialUsers, User, LeadershipRole } from "@/lib/data"
import { Input } from "@/components/ui/input"
import { Search, MoreVertical } from "lucide-react"
import { useAuth } from '@/contexts/auth-provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const ALL_ROLES: User['role'][] = ['Chairperson', 'Vice-Chair', 'Secretary', 'Vice-Secretary', 'Treasurer', 'Public Relations Officer', 'Welfare Officer', 'Flame of Fairness Officer', 'Outreach & Partnership Officer', 'Member', 'Developer'];

export default function MembersPage() {
  const { user, updateUserRole } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = React.useState<User[]>(initialUsers);

  const isDeveloper = user?.role === 'Developer';

  const handleRoleChange = (userId: number, newRole: User['role']) => {
    // In a real app, this would be an API call.
    // For now, we update the local state and the context's mock data.
    const updatedUsers = users.map(u => u.id === userId ? { ...u, role: newRole } : u);
    setUsers(updatedUsers);
    
    // This function will update the "master" list in the auth context
    updateUserRole(userId, newRole);

    toast({
      title: "Role Updated",
      description: `The user's role has been changed to ${newRole}.`
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Member Directory</h1>
        <p className="text-muted-foreground">View, search, and manage all members.</p>
      </div>
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search members..." className="pl-8" />
        </div>
      </div>
      <div className="border rounded-2xl shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              {isDeveloper && <TableHead className="text-right">Manage Role</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={member.role === 'Developer' || member.role === 'Chairperson' ? 'default' : 'secondary'}>{member.role}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Active
                  </div>
                </TableCell>
                {isDeveloper && (
                  <TableCell className="text-right">
                    <Select
                      defaultValue={member.role}
                      onValueChange={(newRole: User['role']) => handleRoleChange(member.id, newRole)}
                      // You can't change your own role
                      disabled={member.id === user?.id}
                    >
                      <SelectTrigger className="w-[180px] ml-auto">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ALL_ROLES.map(r => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
