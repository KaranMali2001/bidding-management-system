"use client";

import CreateProjectModalContent from "@/components/buyersComponent/createProject";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Project } from "@/lib/types";
import { CheckCircle, Clock, FolderOpen, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DashboardLayout } from "../layout/dashboardLayout";

export function BuyerDashboard({
  BuyersProject,
}: {
  BuyersProject: Project[];
}) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projects, setProjects] = useState(BuyersProject);

  const stats = {
    total: projects?.length || 0,
    pending: projects?.filter((p) => p.status === "PENDING").length || 0,
    inProgress: projects?.filter((p) => p.status === "IN_PROGRESS").length || 0,
    completed: projects?.filter((p) => p.status === "COMPLETED").length || 0,
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0D1117]">
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-[#C9D1D9]">
                  Buyer Dashboard
                </h1>
                <p className="text-[#8B949E]">
                  Manage your projects and review bids
                </p>
              </div>
              <Dialog
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-[#2F81F7] hover:bg-[#2F81F7]/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-[#161B22] border-[#30363D]">
                  <DialogHeader className="sr-only">
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Create a new project and start receiving bids
                    </DialogDescription>
                  </DialogHeader>
                  <CreateProjectModalContent
                    setProjects={setProjects}
                    onSuccess={() => setIsCreateModalOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card className="bg-[#161B22] border-[#30363D]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#8B949E]">
                  Total Projects
                </CardTitle>
                <FolderOpen className="h-4 w-4 text-[#8B949E]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#C9D1D9]">
                  {stats.total}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#161B22] border-[#30363D]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#8B949E]">
                  Pending
                </CardTitle>
                <Clock className="h-4 w-4 text-[#8B949E]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#C9D1D9]">
                  {stats.pending}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#161B22] border-[#30363D]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#8B949E]">
                  In Progress
                </CardTitle>
                <Clock className="h-4 w-4 text-[#8B949E]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#C9D1D9]">
                  {stats.inProgress}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#161B22] border-[#30363D]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#8B949E]">
                  Completed
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-[#8B949E]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#C9D1D9]">
                  {stats.completed}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#161B22] border-[#30363D]">
            <CardHeader>
              <CardTitle className="text-[#C9D1D9]">Recent Projects</CardTitle>
              <CardDescription className="text-[#8B949E]">
                Your latest project postings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {projects && projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 border border-[#30363D] rounded-lg bg-[#1F2A36]"
                    >
                      <div>
                        <h3 className="font-medium text-[#C9D1D9]">
                          {project.title}
                        </h3>
                        <p className="text-sm text-[#8B949E]">
                          ${project.budgetMin} - ${project.budgetMax}
                        </p>
                        <p className="text-xs text-[#8B949E]">
                          {project.bids?.length || 0} bid
                          {(project.bids?.length || 0) !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            project.status === "PENDING"
                              ? "bg-[#28A745]/20 text-[#28A745] border-[#28A745]/30"
                              : "bg-[#1F2A36] text-[#8B949E] border-[#30363D]"
                          }
                        >
                          {project.status}
                        </Badge>

                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-[#30363D] text-[#8B949E] hover:bg-[#0D1117]"
                        >
                          <Link href={`/projects/${project.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2 text-[#C9D1D9]">
                    No projects yet
                  </h3>
                  <p className="text-[#8B949E] mb-4">
                    Create your first project to get started
                  </p>
                  <Dialog
                    open={isCreateModalOpen}
                    onOpenChange={setIsCreateModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-[#2F81F7] hover:bg-[#2F81F7]/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl md:max-w-4xl lg:max-w-5xl w-full-y-auto bg-[#161B22] border-[#30363D]">
                      <DialogHeader className="sr-only">
                        <DialogTitle>Create New Project</DialogTitle>
                        <DialogDescription>
                          Create a new project and start receiving bids
                        </DialogDescription>
                      </DialogHeader>
                      <CreateProjectModalContent
                        setProjects={setProjects}
                        onSuccess={() => setIsCreateModalOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </DashboardLayout>
  );
}
