import { Project } from "@/lib/types";
import Link from "next/link";

export default function ProjectsPage({ projects }: { projects: Project[] }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">Open Projects</h1>
      {projects && projects.length === 0 && <p>No open projects found.</p>}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {projects?.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="border rounded p-4 hover:shadow"
          >
            <h2 className="font-medium text-lg mb-2">{project.title}</h2>
            <p className="text-sm line-clamp-3 mb-2">{project.description}</p>
            <p className="text-sm font-semibold">
              Budget: ${project.budgetMin} - ${project.budgetMax}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Deadline: {new Date(project.deadline).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
