import { getProject } from "@/actions/projects";
import { notFound } from "next/navigation";

const ProjectPage = async ({ params }: any) => {
  const { projectId } = await params;

  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  return <div>ProjectPage 101</div>;
};

export default ProjectPage;