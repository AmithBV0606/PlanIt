import { Suspense } from "react";
import { BarLoader } from "react-spinners";

const ProjectLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto">
      <Suspense fallback={<span>Loading projects...</span>}>
        {children}
      </Suspense>
    </div>
  );
};

export default ProjectLayout;