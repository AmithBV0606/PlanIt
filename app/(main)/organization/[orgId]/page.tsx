import { getOrganization } from "@/actions/organization";
import OrgSwitcher from "@/components/org-switcher";

const Organization = async ({ params }: any) => {
  const { orgId } = await params; // I have awaited only after getting the error messagge.
  const organization = await getOrganization({ slug: orgId });

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
        <h1 className="text-5xl font-bold gradient-title-2">{organization.name}&rsquo;s Projects</h1>

        {/* Org switcher */}
        <OrgSwitcher />
      </div>

      <div className="mb-4">Show org projects</div>

      <div className="mt-8">Show user assigned and reported issues here</div>
    </div>
  );
};

export default Organization;