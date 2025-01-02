import { getOrganization } from "@/actions/organization";

const Organization = async ({ params }: any) => {
  const { orgId } = params;
  const organization = await getOrganization({ slug: orgId });

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div>
      <div>
        <h1>{organization.name}&rsquo;s Projects</h1>
      </div>
    </div>
  );
};

export default Organization;