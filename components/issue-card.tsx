import { boolean } from "zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import UserAvatar from "./user-avatar";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

const priorityColor = {
  LOW: "border-green-600",
  MEDIUM: "border-yellow-300",
  HIGH: "border-orange-400",
  URGENT: "border-red-400",
};

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
  assignee: AssigneeProp | null;
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

const IssueCard = ({
  issue,
  showStatus = false,
  onDelete,
  onUpdate,
}: {
  issue: IssueCardProps;
  showStatus: boolean;
  onDelete: () => void;
  onUpdate: () => void;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });

  return (
    <>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader
          className={`border-t-2 ${priorityColor[issue.priority]} rounded-lg`}
        >
          <CardTitle>{issue.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 -mt-3">
          {showStatus && <Badge>{issue.status}</Badge>}
          <Badge variant={"outline"} className="-ml-1">
            {issue.priority}
          </Badge>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-3">
          {issue.assignee ? (
            <UserAvatar user={issue.assignee} />
          ) : (
            <span>No assignee</span>
          )}

          <div className="text-xs text-gray-400 w-full">Created {created}</div>
        </CardFooter>
      </Card>
    </>
  );
};

export default IssueCard;
