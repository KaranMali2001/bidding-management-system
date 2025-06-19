"use client";

import EditProjectModalContent from "@/components/buyersComponent/editProject";
import { DashboardLayout } from "@/components/layout/dashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { bidsApi } from "@/lib/api/bids";
import type { bidSchema } from "@/lib/schemas";
import type { Project } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";
import BidSelection from "../buyersComponent/bidSelector";
import BidFormComponent from "./bid-form";
import DeliverablesUpload from "./deliverables";
import ProjectHeader from "./project-header";
import ProjectActions from "./projectActions";

type BidForm = z.infer<typeof bidSchema>;

export default function ProjectDetailPage({
  projectDetails,
  userId,
  role,
}: {
  projectDetails: Project;
  userId: string | null;
  role: string;
}) {
  const params = useParams();
  const [project, setProject] = useState(projectDetails);
  const queryClient = useQueryClient();
  const [showBidForm, setShowBidForm] = useState(false);
  const [editingBid, setEditingBid] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  const handleProjectUpdate = (updatedProject: Project) => {
    setProject(updatedProject);
  };

  const createBidMutation = useMutation({
    mutationFn: bidsApi.createBid,
    onSuccess: (data) => {
      toast.success("Bid submitted successfully");
      projectDetails.bids = [...(projectDetails.bids ?? []), data];
      setShowBidForm(false);
      queryClient.invalidateQueries({ queryKey: ["project", params.id] });
    },
    onError: () => {
      toast.error("Failed to submit bid");
    },
  });

  const editBidMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BidForm }) =>
      bidsApi.updateBid(id, data),
    onSuccess: () => {
      toast.success("Bid updated successfully");
      setEditingBid(null);
      setShowBidForm(false);
      queryClient.invalidateQueries({ queryKey: ["project", params.id] });
    },
    onError: () => {
      toast.error("Failed to update bid");
    },
  });

  const deleteBidMutation = useMutation({
    mutationFn: bidsApi.deleteBids,
    onSuccess: (res) => {
      toast.success("Bid deleted successfully");
      projectDetails.bids = projectDetails?.bids?.filter(
        (bid) => bid.id !== res.id
      );
      queryClient.invalidateQueries({ queryKey: ["project", params.id] });
    },
    onError: () => {
      toast.error("Failed to delete bid");
    },
  });

  const onSubmitBid = (data: BidForm) => {
    if (editingBid) {
      editBidMutation.mutate({ id: editingBid, data });
    } else {
      createBidMutation.mutate({
        projectId: params.id as string,
        ...data,
      });
    }
  };

  const handleEditBid = (bid: any) => {
    setEditingBid(bid.id);
    setShowBidForm(true);
  };

  const handleDeleteBid = (bidId: string) => {
    if (confirm("Are you sure you want to delete this bid?")) {
      deleteBidMutation.mutate(bidId);
    }
  };

  const handleCancelBidForm = () => {
    setShowBidForm(false);
    setEditingBid(null);
  };

  if (!project) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[#0D1117]">
          <div className="p-6">
            <div className="text-center py-12">
              <div className="bg-[#161B22] rounded-lg border border-[#30363D] p-8 max-w-md mx-auto">
                <div className="w-12 h-12 bg-[#1F2A36] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-[#8B949E]" />
                </div>
                <h1 className="text-xl font-semibold text-[#C9D1D9] mb-2">
                  Project Not Found
                </h1>
                <p className="text-[#8B949E] mb-4">
                  The project you're looking for doesn't exist.
                </p>
                <Link href="/projects">
                  <Button
                    variant="outline"
                    className="border-[#30363D] text-[#8B949E] hover:bg-[#1F2A36]"
                  >
                    Back to Projects
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Authentication and authorization checks
  const isAuthenticated = role !== "UNAUTHENTICATED" && userId !== null;
  const canBid =
    isAuthenticated && role === "SELLER" && project.status === "PENDING";
  const userHasBid =
    isAuthenticated && project.bids?.some((bid) => bid.sellerId === userId);
  const userBid =
    isAuthenticated && project.bids?.find((bid) => bid.sellerId === userId);
  const isProjectOwner =
    isAuthenticated && role === "BUYER" && project.buyerId === userId;

  // Check if current user is the winning seller and project is in progress
  const winningBid = project.bids?.find((bid) => bid.status === "IN_PROGRESS");

  const isWinningSeller =
    isAuthenticated &&
    role === "SELLER" &&
    winningBid?.sellerId === userId &&
    project.status === "IN_PROGRESS";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0D1117]">
        <div className="p-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/projects"
              className="flex items-center text-[#8B949E] hover:text-[#C9D1D9] mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Project Header */}
            <ProjectHeader
              project={project}
              isProjectOwner={isProjectOwner}
              onEditProject={handleEditProject}
            />

            {/* Project Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2"></div>
              <ProjectActions
                project={project}
                isAuthenticated={isAuthenticated}
                role={role}
                canBid={canBid}
                userHasBid={userHasBid || false}
                userBid={userBid}
                onSubmitBid={() => setShowBidForm(!showBidForm)}
                onEditBid={handleEditBid}
                onDeleteBid={handleDeleteBid}
              />
            </div>

            {/* Edit Project Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="max-w-3xl md:max-w-4xl lg:max-w-5xl w-full overflow-y-auto bg-[#161B22] border-[#30363D]">
                <DialogHeader>
                  <DialogTitle>Edit Project</DialogTitle>
                  <DialogDescription>
                    Update your project details
                  </DialogDescription>
                </DialogHeader>
                {editingProject && (
                  <EditProjectModalContent
                    project={editingProject}
                    setProjects={setProject}
                    onSuccess={() => {
                      setIsEditModalOpen(false);
                      setEditingProject(null);
                    }}
                  />
                )}
              </DialogContent>
            </Dialog>

            {/* Bid Form */}
            {showBidForm && canBid && (
              <BidFormComponent
                editingBid={editingBid}
                isLoading={
                  createBidMutation.isPending || editBidMutation.isPending
                }
                onSubmit={onSubmitBid}
                onCancel={handleCancelBidForm}
                defaultValues={
                  editingBid && userBid
                    ? {
                        amount: userBid.amount,
                        estimatedTime: userBid.estimatedTime,
                        message: userBid.message,
                      }
                    : undefined
                }
              />
            )}

            {/* Deliverables Upload - Show for winning seller when project is in progress */}
            {isWinningSeller && (
              <DeliverablesUpload
                projectId={project.id}
                onUploadSuccess={() => {
                  toast.success("Deliverables uploaded successfully!");
                  queryClient.invalidateQueries({
                    queryKey: ["project", params.id],
                  });
                }}
              />
            )}

            {/* Bid Selection */}
            {role === "BUYER" && (
              <BidSelection
                bids={project.bids || []}
                project={project}
                userId={userId}
                role={role}
                onProjectUpdate={handleProjectUpdate}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
