"use client";

import { DashboardLayout } from "@/components/layout/dashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { bidsApi } from "@/lib/api/bids";
import type { SellerProject } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  Clock,
  DollarSign,
  Eye,
  MessageSquare,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface SellerDashboardProps {
  sellerProjects: SellerProject[];
}

export default function SellerDashboard({
  sellerProjects,
}: SellerDashboardProps) {
  const queryClient = useQueryClient();

  const deleteBidMutation = useMutation({
    mutationFn: bidsApi.deleteBids,
    onSuccess: (res) => {
      toast.success("Bid withdrawn successfully");

      sellerProjects = sellerProjects.filter(
        (project) => project.project.id === res.projectId
      );
      queryClient.invalidateQueries({ queryKey: ["seller-projects"] });
    },
    onError: () => {
      toast.error("Failed to withdraw bid");
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-[#E3B341]/20 text-[#E3B341] border-[#E3B341]/30";
      case "approved":
        return "bg-[#28A745]/20 text-[#28A745] border-[#28A745]/30";
      case "rejected":
        return "bg-[#F85149]/20 text-[#F85149] border-[#F85149]/30";
      default:
        return "bg-[#1F2A36] text-[#8B949E] border-[#30363D]";
    }
  };

  const handleWithdrawBid = (bidId: string) => {
    if (confirm("Are you sure you want to withdraw this bid?")) {
      deleteBidMutation.mutate(bidId);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0D1117]">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#C9D1D9]">
                My Project Bids
              </h1>
              <p className="text-[#8B949E] mt-2">
                Manage and track your project proposals
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-[#161B22] border-[#30363D]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#8B949E]">
                    Total Bids
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-[#8B949E]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#C9D1D9]">
                    {sellerProjects.length}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#161B22] border-[#30363D]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#8B949E]">
                    Total Value
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-[#8B949E]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#C9D1D9]">
                    {formatCurrency(
                      sellerProjects.reduce(
                        (sum, project) => sum + project.amount,
                        0
                      )
                    )}
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
                    {
                      sellerProjects.filter(
                        (p) => p.project.status === "PENDING"
                      ).length
                    }
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#161B22] border-[#30363D]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#8B949E]">
                    Avg. Bid
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-[#8B949E]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#C9D1D9]">
                    {sellerProjects.length > 0
                      ? formatCurrency(
                          sellerProjects.reduce(
                            (sum, project) => sum + project.amount,
                            0
                          ) / sellerProjects.length
                        )
                      : formatCurrency(0)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sellerProjects.map((sellerProject) => (
                <Card
                  key={sellerProject.id}
                  className="bg-[#161B22] border-[#30363D] hover:shadow-lg hover:shadow-[#2F81F7]/10 transition-all duration-200"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2 text-[#C9D1D9]">
                          {sellerProject.project.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-[#8B949E] line-clamp-2">
                          {sellerProject.project.description}
                        </CardDescription>
                      </div>
                      <Badge
                        className={getStatusColor(sellerProject.project.status)}
                      >
                        {sellerProject.project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Bid Details */}
                    <div className="bg-[#2F81F7]/20 border border-[#2F81F7]/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-[#2F81F7] mb-2">
                        Your Bid
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-[#2F81F7]" />
                          <span className="font-bold text-lg text-[#C9D1D9]">
                            {formatCurrency(sellerProject.amount)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[#2F81F7]" />
                          <span className="text-[#C9D1D9]">
                            {sellerProject.estimatedTime}
                          </span>
                        </div>
                      </div>
                      {sellerProject.message && (
                        <div className="mt-3">
                          <p className="text-sm text-[#8B949E] bg-[#1F2A36] p-2 rounded border border-[#30363D]">
                            {sellerProject.message}
                          </p>
                        </div>
                      )}
                    </div>

                    <Separator className="bg-[#30363D]" />

                    {/* Project Details */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#8B949E]">
                          Client Budget:
                        </span>
                        <span className="font-medium text-[#C9D1D9]">
                          {formatCurrency(sellerProject.project.budgetMin)} -{" "}
                          {formatCurrency(sellerProject.project.budgetMax)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#8B949E]">
                          Deadline:
                        </span>
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4 text-[#8B949E]" />
                          <span className="font-medium text-[#C9D1D9]">
                            {formatDate(sellerProject.project.deadline)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#8B949E]">
                          Bid Submitted:
                        </span>
                        <span className="font-medium text-[#C9D1D9]">
                          {formatDate(sellerProject.createdAt)}
                        </span>
                      </div>
                    </div>

                    <Separator className="bg-[#30363D]" />

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex-1 border-[#30363D] text-[#8B949E] hover:bg-[#1F2A36] hover:text-[#C9D1D9]"
                      >
                        <Link href={`/projects/${sellerProject.project.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWithdrawBid(sellerProject.id)}
                        disabled={deleteBidMutation.isPending}
                        className="border-[#F85149]/30 text-[#F85149] hover:bg-[#F85149]/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {sellerProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-[#161B22] rounded-lg border border-[#30363D] p-8 max-w-md mx-auto">
                  <div className="w-12 h-12 bg-[#1F2A36] rounded-lg flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-6 h-6 text-[#8B949E]" />
                  </div>
                  <h3 className="text-lg font-medium text-[#C9D1D9] mb-2">
                    No Bids Yet
                  </h3>
                  <p className="text-[#8B949E] mb-4">
                    You haven&apos;t submitted any bids yet. Browse projects to
                    get started
                  </p>
                  <Button className="bg-[#2F81F7] hover:bg-[#2F81F7]/90">
                    Browse Projects
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
