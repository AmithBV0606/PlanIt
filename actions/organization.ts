"use server";

import prisma from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getOrganization({ slug }: { slug: string }) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get the organization details
  const organization = await clerkClient().organizations.getOrganization({
    slug,
  });

  if (!organization) {
    return null;
  }

  // Check if user belongs to this organization
  const { data: membership } =
    await clerkClient().organizations.getOrganizationMembershipList({
      organizationId: organization.id,
    });

  const userMembership = membership.find(
    (member) => member.publicUserData?.userId === userId
  );

  if (!userMembership) {
    return null;
  }

  return organization;
}