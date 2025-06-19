import { DashboardLayout } from "@/components/layout/dashboardLayout";
import type { Project } from "@/lib/types";
import { Calendar, Clock, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage({ projects }: { projects: Project[] }) {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0D1117]">
        <div className="p-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#C9D1D9]">
                  Open Projects
                </h1>
                <p className="text-[#8B949E] mt-1">
                  Browse and bid on available projects
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-[#161B22] rounded-lg border border-[#30363D] px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-[#28A745]" />
                    <span className="text-sm font-medium text-[#C9D1D9]">
                      {projects?.length || 0} Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {projects && projects.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-[#161B22] rounded-lg border border-[#30363D] p-8 max-w-md mx-auto">
                <div className="w-12 h-12 bg-[#1F2A36] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-[#8B949E]" />
                </div>
                <h3 className="text-lg font-medium text-[#C9D1D9] mb-2">
                  No Projects Available
                </h3>
                <p className="text-[#8B949E]">
                  Check back later for new project opportunities
                </p>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects?.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div className="bg-[#161B22] rounded-lg border border-[#30363D] p-6 hover:border-[#2F81F7] hover:shadow-lg hover:shadow-[#2F81F7]/10 transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#C9D1D9] text-lg mb-2 line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-[#8B949E] text-sm line-clamp-3 mb-4">
                        {project.description}
                      </p>
                    </div>
                    <span
                      className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-3
                      ${
                        project.status === "PENDING"
                          ? "bg-[#28A745]/20 text-[#28A745] border border-[#28A745]/30"
                          : "bg-[#1F2A36] text-[#8B949E] border border-[#30363D]"
                      }
                    `}
                    >
                      {project.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-[#8B949E]">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span className="text-sm">Budget</span>
                      </div>
                      <span className="font-semibold text-[#C9D1D9]">
                        ${project.budgetMin.toLocaleString()} - $
                        {project.budgetMax.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#30363D]">
                      <div className="flex items-center text-[#8B949E]">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          Due {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-[#2F81F7] text-sm font-medium hover:text-[#2F81F7]/80">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
