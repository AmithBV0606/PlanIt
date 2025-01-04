"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

interface SprintDataProps {
  name: string;
  startDate: Date;
  endDate: Date;
}

export async function createSprint(projectId: string, data: SprintDataProps) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error("Project not found");
  }

  const sprint = await prisma.sprint.create({
    data: {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "PLANNED",
      projectId: projectId,
    },
  });

  return sprint;
}