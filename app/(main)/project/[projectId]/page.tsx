import { getProject } from "@/actions/projects";
import { notFound } from "next/navigation";
import SprintCreationForm from "../_components/create-sprint";

const ProjectPage = async ({ params }: any) => {
  const { projectId } = await params;

  const project = await getProject(projectId);

  // console.log(project);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto">
      {/* Sprint Creation */}
      <SprintCreationForm
        projectTitle={project.name}
        projectId={projectId}
        projectKey={project.key}
        sprintKey={project.sprints?.length + 1}
      />

      {/* Sprint Board */}
    </div>
  );
};

export default ProjectPage;