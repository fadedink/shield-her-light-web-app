
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
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { useAuth, User } from '@/contexts/auth-provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const ALL_ROLES: User['role'][] = ['Chairperson', 'Vice-Chair', 'Secretary', 'Vice-Secretary', 'Treasurer', 'Public Relations Officer', 'Welfare Officer', 'Flame of Fairness Officer', 'Outreach & Partnership Officer', 'Member', 'Developer'];

export default function MembersPage() {
  const { user, updateUserRole } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  const isDeveloper = user?.role === 'Developer';

  React.useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
        const usersData: User[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as User));
        setUsers(usersData);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    try {
      await updateUserRole(userId, newRole);
      toast({
        title: "Role Updated",
        description: `The user's role has been changed to ${newRole}.`
      });
    } catch (error) {
        console.error("Failed to update role: ", error);
        toast({
            variant: 'destructive',
            title: "Update Failed",
            description: "Could not update the user's role.",
        });
    }
  };

  const filteredUsers = users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin"/>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Member Directory</h1>
        <p className="text-muted-foreground">View, search, and manage all members.</p>
      </div>
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search members..." 
            className="pl-8" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
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
            {filteredUsers.map((member) => (
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
