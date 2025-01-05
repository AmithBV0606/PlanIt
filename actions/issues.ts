"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

interface IssuesDataProps {
  title: string;
  description?: string;
  status: IssuesStatus;
  priority: IssuesPriority;
  sprintId?: string;
  assigneeId?: string;
}

enum IssuesStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

enum IssuesPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export async function createIssue(projectId: string, data: IssuesDataProps) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  let user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  const lastIssue = await prisma.issue.findFirst({
    where: {
      projectId,
      status: data.status,
    },
    orderBy: {
      order: "desc",
    },
  });

  const newOrder = lastIssue ? lastIssue.order + 1 : 0;

  const issue = await prisma.issue.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      projectId: projectId,
      sprintId: data.sprintId,
      reporterId: user!.id,
      assigneeId: data.assigneeId || null, // Add this line
      order: newOrder,
    },
    include: {
      assignee: true,
      reporter: true,
    },
  });

  return issue;
}