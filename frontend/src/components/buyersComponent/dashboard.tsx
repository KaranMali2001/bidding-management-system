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
      <div className="min-h-screen bg-gray-900">
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">
                  Buyer Dashboard
                </h1>
                <p className="text-gray-400">
                  Manage your projects and review bids
                </p>
              </div>
              <Dialog
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-red-500 hover:bg-red-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-gray-800 border-gray-700">
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
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Total Projects
                </CardTitle>
                <FolderOpen className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.total}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Pending
                </CardTitle>
                <Clock className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.pending}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  In Progress
                </CardTitle>
                <Clock className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.inProgress}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Completed
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.completed}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Projects</CardTitle>
              <CardDescription className="text-gray-400">
                Your latest project postings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {projects && projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-800"
                    >
                      <div>
                        <h3 className="font-medium text-white">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          ${project.budgetMin} - ${project.budgetMax}
                        </p>
                        <p className="text-xs text-gray-400">
                          {project.bids?.length || 0} bid
                          {(project.bids?.length || 0) !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            project.status === "PENDING"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-gray-800 text-gray-400 border-gray-700"
                          }
                        >
                          {project.status}
                        </Badge>

                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-gray-700 text-gray-400 hover:bg-gray-700"
                        >
                          <Link href={`/projects/${project.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    No projects yet
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Create your first project to get started
                  </p>
                  <Dialog
                    open={isCreateModalOpen}
                    onOpenChange={setIsCreateModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-red-500 hover:bg-red-600">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl md:max-w-4xl lg:max-w-5xl w-full-y-auto bg-gray-800 border-gray-700">
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
