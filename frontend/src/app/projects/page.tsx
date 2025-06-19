import ProjectsPage from "@/components/projectComponents/projectsPage";
import { projectsApi } from "@/lib/api/projects";

export default async function Page() {
  const projects = await projectsApi.getOpenProjects();
  return <ProjectsPage projects={projects} />;
}
