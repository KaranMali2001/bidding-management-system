import ErrorPage from "@/components/Error";
import ProjectsPage from "@/components/projectComponents/projectsPage";
import { projectsApi } from "@/lib/api/projects";

export default async function Page() {
  try {
    const projects = await projectsApi.getOpenProjects();
    return <ProjectsPage projects={projects} />;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return (
      <>
        <ErrorPage />
      </>
    );
  }
}
