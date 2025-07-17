
'use client';

import * as React from 'react';
import { useAuth } from '@/contexts/auth-provider';
import { Button } from '@/components/ui/button';
import { PlusCircle, Gavel, UserCheck, BarChart3, Clock, Loader2, Vote } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isFuture } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/contexts/auth-provider';

// Placeholder data
type LeadershipRole = Exclude<User['role'], 'Member' | 'Developer'>;

interface Candidate {
  id: number;
  userId: string;
  post: LeadershipRole;
  reason: string;
}

interface Election {
    id: number;
    title: string;
    status: 'Applying' | 'Voting' | 'Finished';
    applicationDeadline: string;
    votingDeadline: string;
    posts: LeadershipRole[];
    candidates: Candidate[];
    votes: { userId: string, candidateId: number }[];
}

const users: Partial<User>[] = [
    { id: '1', name: 'Ethan Davis', role: 'Flame of Fairness Officer', avatar: 'https://placehold.co/100x100.png?text=E' },
    { id: '2', name: 'Fiona Green', role: 'Member', avatar: 'https://placehold.co/100x100.png?text=F' },
    { id: '3', name: 'George Harris', role: 'Member', avatar: 'https://placehold.co/100x100.png?text=G' },
];

const initialCandidates: Candidate[] = [
    { id: 1, userId: '2', post: 'Chairperson', reason: 'I am passionate about our cause and have strong leadership skills.' },
    { id: 2, userId: '3', post: 'Chairperson', reason: 'I believe I can bring new ideas and energy to the team.' },
];

const initialElections: Election[] = [
    {
        id: 1,
        title: 'Annual General Election',
        status: 'Voting',
        applicationDeadline: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
        votingDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // in 5 days
        posts: ['Chairperson', 'Secretary'],
        candidates: initialCandidates,
        votes: [
            { userId: '1', candidateId: 1 }
        ],
    },
];

const ALL_POSTS: LeadershipRole[] = ['Chairperson', 'Vice-Chair', 'Secretary', 'Vice-Secretary', 'Treasurer', 'Public Relations Officer', 'Welfare Officer', 'Flame of Fairness Officer', 'Outreach & Partnership Officer'];

export default function ElectionsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [elections, setElections] = React.useState<Election[]>(initialElections);
  const [isCreating, setIsCreating] = React.useState(false);
  const [isApplying, setIsApplying] = React.useState(false);

  // --- State for Forms ---
  const [newElectionTitle, setNewElectionTitle] = React.useState('');
  const [newAppDeadline, setNewAppDeadline] = React.useState('');
  const [newVoteDeadline, setNewVoteDeadline] = React.useState('');
  const [newSelectedPosts, setNewSelectedPosts] = React.useState<LeadershipRole[]>([]);
  
  const [applicationReason, setApplicationReason] = React.useState('');
  const [applicationPost, setApplicationPost] = React.useState<LeadershipRole>();

  const isFairnessOfficer = user?.role === 'Flame of Fairness Officer';

  const handleCreateElection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newElectionTitle || !newAppDeadline || !newVoteDeadline || newSelectedPosts.length === 0) {
      toast({ variant: 'destructive', title: 'Missing Fields', description: 'Please fill out all fields to create an election.' });
      return;
    }
    setIsCreating(true);
    // Simulate API call
    setTimeout(() => {
        const newElection: Election = {
            id: elections.length + 1,
            title: newElectionTitle,
            status: 'Applying',
            applicationDeadline: new Date(newAppDeadline).toISOString(),
            votingDeadline: new Date(newVoteDeadline).toISOString(),
            posts: newSelectedPosts,
            candidates: [],
            votes: [],
        };
        setElections(prev => [newElection, ...prev]);
        toast({ title: 'Election Created', description: `The "${newElection.title}" application period is now open.` });
        setIsCreating(false);
    }, 1000);
  };
  
  const handleApply = (electionId: number) => {
      if (!applicationReason || !applicationPost || !user) {
          toast({ variant: 'destructive', title: 'Missing Fields', description: 'Please select a post and provide a reason.' });
          return;
      }
      setIsApplying(true);
      setTimeout(() => {
          const newCandidate: Candidate = {
              id: Date.now(),
              userId: user.id,
              post: applicationPost,
              reason: applicationReason,
          };
          setElections(prev => prev.map(el => el.id === electionId ? { ...el, candidates: [...el.candidates, newCandidate] } : el));
          toast({ title: 'Application Submitted!', description: `Your application for ${applicationPost} has been received.` });
          setApplicationPost(undefined);
          setApplicationReason('');
          setIsApplying(false);
      }, 1000);
  };
  
  const handleVote = (electionId: number, candidateId: number) => {
    if(!user) return;
     setElections(prev => prev.map(el => {
        if(el.id === electionId) {
            // Remove previous vote by this user for this election
            const otherVotes = el.votes.filter(v => v.userId !== user.id);
            // Add new vote
            const newVote = { userId: user.id, candidateId };
            return { ...el, votes: [...otherVotes, newVote] };
        }
        return el;
     }));
     toast({ title: "Vote Cast!", description: "Your vote has been securely recorded." });
  };
  
  const hasUserApplied = (election: Election) => {
      return election.candidates.some(c => c.userId === user?.id);
  }

  const userHasVotedForPost = (election: Election, post: LeadershipRole, userId: string | undefined) => {
      if (!userId) return false;
      const postCandidateIds = election.candidates.filter(c => c.post === post).map(c => c.id);
      return election.votes.some(v => v.userId === userId && postCandidateIds.includes(v.candidateId));
  }
  
  const countVotes = (election: Election, candidateId: number) => {
      return election.votes.filter(v => v.candidateId === candidateId).length;
  };
  
  const getTotalVotesForPost = (election: Election, post: LeadershipRole) => {
      const postCandidateIds = election.candidates.filter(c => c.post === post).map(c => c.id);
      return election.votes.filter(v => postCandidateIds.includes(v.candidateId)).length;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Elections</h1>
          <p className="text-muted-foreground">Manage and participate in leadership elections.</p>
        </div>
        {isFairnessOfficer && (
           <Dialog>
            <DialogTrigger asChild>
                <Button><Gavel className="mr-2" /> Create New Election</Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleCreateElection}>
                    <DialogHeader>
                        <DialogTitle>Create New Election</DialogTitle>
                        <DialogDescription>Set up the details for the upcoming election.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Input placeholder="Election Title (e.g., Annual General Election)" value={newElectionTitle} onChange={e => setNewElectionTitle(e.target.value)} />
                        <div>
                            <Label>Application Deadline</Label>
                            <Input type="datetime-local" value={newAppDeadline} onChange={e => setNewAppDeadline(e.target.value)} />
                        </div>
                        <div>
                            <Label>Voting Deadline</Label>
                            <Input type="datetime-local" value={newVoteDeadline} onChange={e => setNewVoteDeadline(e.target.value)} />
                        </div>
                        <div>
                            <Label>Posts to Elect</Label>
                             <div className="grid grid-cols-2 gap-2 mt-2">
                                {ALL_POSTS.map(post => (
                                    <div key={post} className={`p-2 border rounded-md text-sm cursor-pointer ${newSelectedPosts.includes(post) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`} onClick={() => setNewSelectedPosts(prev => prev.includes(post) ? prev.filter(p => p !== post) : [...prev, post])}>
                                        {post}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isCreating}>{isCreating ? <><Loader2 className="mr-2 animate-spin"/> Creating...</> : "Create Election"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
           </Dialog>
        )}
      </div>

      <div className="space-y-6">
        {elections.map((election) => {
            const isApplicationOpen = election.status === 'Applying' && isFuture(new Date(election.applicationDeadline));
            const isVotingOpen = election.status === 'Voting' && isFuture(new Date(election.votingDeadline));
            const isFinished = election.status === 'Finished' || (!isApplicationOpen && !isVotingOpen);

            let statusText = 'Finished';
            let statusColor = 'bg-gray-500';
            let statusIcon = <BarChart3 className="h-4 w-4" />;
            
            if (isApplicationOpen) {
                statusText = 'Application Period Open';
                statusColor = 'bg-blue-500';
                statusIcon = <PlusCircle className="h-4 w-4" />;
            } else if (isVotingOpen) {
                statusText = 'Voting Period Open';
                statusColor = 'bg-green-500';
                statusIcon = <Vote className="h-4 w-4" />;
            }

            return (
                <Card key={election.id} className="rounded-2xl shadow-sm">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>{election.title}</CardTitle>
                                <CardDescription>Posts: {election.posts.join(', ')}</CardDescription>
                            </div>
                            <div className={`flex items-center gap-2 text-xs font-semibold text-white px-3 py-1 rounded-full ${statusColor}`}>
                                {statusIcon}
                                <span>{statusText}</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Application View */}
                        {isApplicationOpen && !hasUserApplied(election) && (
                             <Card className="bg-muted/50">
                                <CardHeader>
                                    <CardTitle>Apply for a Position</CardTitle>
                                    <CardDescription>Submit your application for one of the open leadership roles.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <Select onValueChange={(val: LeadershipRole) => setApplicationPost(val)}>
                                        <SelectTrigger><SelectValue placeholder="Select a post to apply for" /></SelectTrigger>
                                        <SelectContent>
                                            {election.posts.map(post => (
                                                <SelectItem key={post} value={post}>{post}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Textarea placeholder="Why are you a good fit for this role? (Your reason for applying)" value={applicationReason} onChange={e => setApplicationReason(e.target.value)} />
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={() => handleApply(election.id)} disabled={isApplying}>{isApplying ? <><Loader2 className="mr-2 animate-spin"/>Submitting...</> : "Submit Application"}</Button>
                                </CardFooter>
                            </Card>
                        )}
                        {hasUserApplied(election) && <p className="text-green-600 font-medium text-center p-4 bg-green-50 rounded-lg border border-green-200">✓ You have successfully applied for this election.</p>}

                        {/* Voting & Results View */}
                        {(isVotingOpen || isFinished) && election.posts.map(post => {
                             const candidatesForPost = election.candidates.filter(c => c.post === post);
                             const totalVotesForPost = getTotalVotesForPost(election, post);
                            return (
                                <div key={post} className="mb-6">
                                    <h3 className="text-xl font-semibold mb-3">{post}</h3>
                                    {candidatesForPost.length > 0 ? (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {candidatesForPost.map(candidate => {
                                            const candidateUser = users.find(u => u.id === candidate.userId);
                                            const voteCount = countVotes(election, candidate.id);
                                            const votePercentage = totalVotesForPost > 0 ? (voteCount / totalVotesForPost) * 100 : 0;
                                            return (
                                                <Card key={candidate.id}>
                                                    <CardHeader className="flex-row items-center gap-4 space-y-0">
                                                        <Avatar className="h-12 w-12">
                                                            <AvatarImage src={candidateUser?.avatar} />
                                                            <AvatarFallback>{candidateUser?.name?.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <CardTitle className="text-lg">{candidateUser?.name}</CardTitle>
                                                            <CardDescription>Candidate</CardDescription>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-sm italic text-muted-foreground mb-4">"{candidate.reason}"</p>
                                                        {isFinished && (
                                                            <div>
                                                                <div className="flex justify-between items-baseline mb-1">
                                                                    <span className="text-sm font-bold">{voteCount} Votes</span>
                                                                    <span className="text-xs text-muted-foreground">{votePercentage.toFixed(1)}%</span>
                                                                </div>
                                                                <Progress value={votePercentage} />
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                    {isVotingOpen && (
                                                        <CardFooter>
                                                            <Button className="w-full" variant={userHasVotedForPost(election, post, user?.id) ? 'secondary' : 'default'} onClick={() => handleVote(election.id, candidate.id)} >
                                                                {userHasVotedForPost(election, post, user?.id) ? <><UserCheck className="mr-2"/> Voted</> : <><Vote className="mr-2"/> Vote</>}
                                                            </Button>
                                                        </CardFooter>
                                                    )}
                                                </Card>
                                            )
                                        })}
                                    </div>
                                    ) : <p className="text-sm text-muted-foreground">No candidates applied for this position.</p>}
                                </div>
                            )
                        })}

                    </CardContent>
                    <CardFooter className="bg-muted/50 px-6 py-3 text-sm text-muted-foreground flex justify-between">
                       <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4"/>
                            <span>Application Deadline: {format(new Date(election.applicationDeadline), "MMM d, yyyy 'at' h:mm a")}</span>
                       </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4"/>
                            <span>Voting Deadline: {format(new Date(election.votingDeadline), "MMM d, yyyy 'at' h:mm a")}</span>
                       </div>
                    </CardFooter>
                </Card>
            )
        })}
      </div>
    </div>
  );
}

    