import { getUserIssues } from "@/actions/organization";
import IssueCard from "@/components/issue-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";

type AssigneeProp = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  clerkUserId: string;
  email: string;
  imageUrl: string;
};

type ReporterProp = {
  id: string;
  clerkUserId: string;
  email: string;
  name: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

enum IssuePriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

enum IssueStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_PREVIEW",
  DONE = "DONE",
}

interface IssueCardProps {
  assignee: AssigneeProp;
  assigneeId: string;
  createdAt: Date;
  description?: string;
  id: string;
  order: number;
  priority: IssuePriority;
  projectId: string;
  reporter: ReporterProp;
  reporterId: string;
  sprintId: string;
  status: IssueStatus;
  title: string;
  updatedAt: Date;
}

const UserIssues = async ({ userId }: { userId: string }) => {
  const issues = await getUserIssues(userId);

  if (issues.length === 0) {
    return null;
  }

  const assignedIssues = issues.filter(
    (issue) => issue.assignee?.clerkUserId === userId
  );
  const reportedIssues = issues.filter(
    (issue) => issue.reporter.clerkUserId === userId
  );

  return (
    <>
      <h1 className="text-4xl font-bold gradient-title-2 mb-4">My Issues</h1>

      <Tabs defaultValue="assigned" className="w-full">
        <TabsList>
          <TabsTrigger value="assigned">Assigned to you</TabsTrigger>
          <TabsTrigger value="reported">Reported by you</TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="mt-4">
          <Suspense fallback={<div>Loading...</div>}>
            <IssueGrid
              // @ts-ignore
              issues={assignedIssues}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="reported" className="mt-4">
          <Suspense fallback={<div>Loading...</div>}>
            <IssueGrid
              // @ts-ignore
              issues={reportedIssues}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </>
  );
};

function IssueGrid({ issues }: { issues: IssueCardProps[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} showStatus={true} />
      ))}
    </div>
  );
}

export default UserIssues;
