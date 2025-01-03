"use server";

import prisma from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

interface ProjectData {
  name: string;
  key: string;
  description?: string;
  organizationId?: string;
}

export async function createProject(data: ProjectData) {
  const { userId, orgId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!orgId) {
    throw new Error("No Organization Selected");
  }

  // Check if the user is an admin of the organization
  const { data: membershipList } =
    await clerkClient().organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const userMembership = membershipList.find(
    // @ts-ignore
    (membership) => membership.publicUserData.userId === userId
  );

  if (!userMembership || userMembership.role !== "org:admin") {
    throw new Error("Only organization admins can create projects");
  }

  try {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        key: data.key,
        description: data.description,
        organizationId: orgId,
      },
    });

    return project;
  } catch (error: any) {
    throw new Error("Error creating project: " + error.message);
  }
}

export async function getProjects(orgId: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Find user to verify existence
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const projects = await prisma.project.findMany({
    where: {
      organizationId: orgId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return projects;
}

export async function deleteProject(projectId: string) {
  const { userId, orgId, orgRole } = auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  if (orgRole !== "org:admin") {
    throw new Error("Only organization admins can delete projects.");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!prisma || project?.organizationId !== orgId) {
    throw new Error(
      "Project not found or you don't have permission to delete it"
    );
  }

  await prisma.project.delete({
    where: {
      id: projectId
    }
  });

  return { success: true }
}