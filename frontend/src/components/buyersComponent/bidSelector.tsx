"use client";

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
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { projectsApi } from "@/lib/api/projects";
import type { Bid, Project } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  DollarSign,
  Loader2,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Status enum to match the Bid interface
type StatusEnum = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

interface BidSelectionProps {
  bids: Bid[];
  project: Project;
  userId: string | null;
  role: string;
  onProjectUpdate: (updatedProject: Project) => void;
}

export default function BidSelection({
  bids,
  project,
  userId,
  role,
  onProjectUpdate,
}: BidSelectionProps) {
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const selectSellerMutation = useMutation({
    mutationFn: ({ projectId, bidId }: { projectId: string; bidId: string }) =>
      projectsApi.selectSeller(projectId, bidId),
    onSuccess: (updatedProject) => {
      toast.success("Seller selected successfully! 🎉");
      onProjectUpdate(updatedProject);
      setConfirmDialogOpen(false);
      setSelectedBidId(null);
      queryClient.invalidateQueries({ queryKey: ["project", project.id] });
    },
    onError: (error) => {
      console.error("Failed to select seller:", error);
      toast.error("Failed to select seller. Please try again.");
    },
  });

  const handleSelectSeller = (bidId: string) => {
    setSelectedBidId(bidId);
    setConfirmDialogOpen(true);
  };

  const confirmSelection = () => {
    if (selectedBidId) {
      selectSellerMutation.mutate({
        projectId: project.id,
        bidId: selectedBidId,
      });
    }
  };

  const selectedBid = selectedBidId
    ? bids.find((bid) => bid.id === selectedBidId)
    : null;

  // Only show for buyers who own the project and project is still pending
  const canSelectSeller = role === "BUYER" && project.buyerId === userId;
  console.log("project.status", canSelectSeller);
  // Filter bids to show only approved ones, or all if no approved bids exist
  const approvedBids = bids.filter((bid) => bid.status === "IN_PROGRESS") || [];
  const bidsToShow = approvedBids.length > 0 ? approvedBids : bids || [];

  // Check if there's already a selected seller
  const hasSelectedSeller =
    project.selectedBidId && project.status === "IN_PROGRESS";
  const selectedSellerBid = hasSelectedSeller
    ? bids.find((bid) => bid.id === project.selectedBidId)
    : null;

  if (!bids || bids.length === 0) {
    return (
      <Card className="bg-[#161B22] border border-[#30363D]">
        <CardHeader>
          <CardTitle className="text-xl text-[#C9D1D9]">No Bids Yet</CardTitle>
          <CardDescription className="text-[#8B949E]">
            No sellers have submitted bids for this project yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-[#8B949E] mx-auto mb-4" />
            <p className="text-[#8B949E]">Check back later for new proposals</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show selected seller if project is in progress
  // Show selected seller if project is in progress
  if (hasSelectedSeller && selectedSellerBid) {
    console.log("selectedSellerBid", selectedSellerBid.seller?.email);
    return (
      <Card className="bg-[#161B22] border border-[#30363D]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-[#C9D1D9] flex items-center gap-2">
                <Award className="h-6 w-6 text-[#FFB347]" />
                Selected Seller
              </CardTitle>
              <CardDescription className="text-[#8B949E]">
                You have selected{" "}
                {selectedSellerBid.seller?.name ||
                  selectedSellerBid.seller?.email ||
                  "a seller"}{" "}
                for this project
              </CardDescription>
            </div>
            <Badge className="bg-[#28A745]/20 text-[#28A745] border-[#28A745]/30">
              Project In Progress
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#2F81F7] flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {selectedSellerBid.seller?.name
                    ? selectedSellerBid.seller.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : selectedSellerBid.seller?.email
                        ?.slice(0, 2)
                        .toUpperCase() || "S"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#C9D1D9]">
                  {selectedSellerBid.seller?.name || "Seller Name"}
                </p>
                <p className="text-xs text-[#8B949E]">
                  {selectedSellerBid.seller?.email}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-[#28A745]">
                ${selectedSellerBid.amount?.toLocaleString()}
              </p>
              <p className="text-xs text-[#8B949E]">Winning Bid</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-[#161B22] border border-[#30363D]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-[#C9D1D9]">
                {approvedBids.length > 0 ? "Approved Bids" : "All Bids"} (
                {bidsToShow.length})
              </CardTitle>
              <CardDescription className="text-[#8B949E]">
                {canSelectSeller
                  ? approvedBids.length > 0
                    ? "Review approved proposals and select the best seller"
                    : "Review all proposals for your project"
                  : approvedBids.length > 0
                  ? "Approved proposals for this project"
                  : "All proposals for this project"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {approvedBids.length > 0 && (
                <Badge className="bg-[#28A745]/20 text-[#28A745] border-[#28A745]/30">
                  {approvedBids.length} Approved
                </Badge>
              )}
              {canSelectSeller && (
                <Badge className="bg-[#FFB347]/20 text-[#FFB347] border-[#FFB347]/30">
                  Select a Seller
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Show info about bid filtering */}
          {approvedBids.length > 0 && bids.length > approvedBids.length && (
            <div className="mb-6 bg-[#2F81F7]/10 border border-[#2F81F7]/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-[#2F81F7] mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-[#2F81F7] mb-1">
                    Showing Approved Bids Only
                  </h4>
                  <p className="text-xs text-[#8B949E]">
                    Displaying {approvedBids.length} approved bids out of{" "}
                    {bids.length} total submissions. Only approved bids are
                    eligible for selection.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {bidsToShow.map((bid, index) => (
              <div key={bid.id}>
                <div
                  className={`rounded-lg p-6 transition-all duration-200 ${
                    bid.status === "IN_PROGRESS"
                      ? "bg-[#1F2A36] border-2 border-[#28A745]/30 hover:border-[#28A745]/50"
                      : "bg-[#1F2A36] border border-[#30363D] hover:bg-[#1F2A36]/80"
                  }`}
                >
                  {/* Bid Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          bid.status === "IN_PROGRESS"
                            ? "bg-[#28A745]"
                            : "bg-[#2F81F7]"
                        }`}
                      >
                        {bid.status === "IN_PROGRESS" ? (
                          <CheckCircle2 className="h-6 w-6 text-white" />
                        ) : (
                          <UserIcon className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-[#C9D1D9] text-lg">
                            {bid.seller?.email || "Anonymous Seller"}
                          </h4>
                          {bid.status === "IN_PROGRESS" && (
                            <Badge className="bg-[#28A745]/20 text-[#28A745] border-[#28A745]/30 text-xs">
                              Approved
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-[#8B949E]">
                          Submitted on{" "}
                          {new Date(bid.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <Badge
                          className={`text-lg px-3 py-1 ${
                            bid.status === "IN_PROGRESS"
                              ? "bg-[#28A745]/20 text-[#28A745] border-[#28A745]/30"
                              : "bg-[#2F81F7]/20 text-[#2F81F7] border-[#2F81F7]/30"
                          }`}
                        >
                          ${bid.amount.toLocaleString()}
                        </Badge>
                        <p className="text-xs text-[#8B949E] mt-1">
                          Bid Amount
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className="border-[#30363D] text-[#8B949E]"
                        >
                          {bid.estimatedTime}
                        </Badge>
                        <p className="text-xs text-[#8B949E] mt-1">Timeline</p>
                      </div>
                    </div>
                  </div>

                  {/* Bid Message */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-[#C9D1D9] mb-2">
                      Proposal
                    </h5>
                    <div className="bg-[#161B22] rounded-lg p-4 border border-[#30363D]">
                      <p className="text-[#8B949E] leading-relaxed">
                        {bid.message}
                      </p>
                    </div>
                  </div>

                  {/* Bid Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-[#161B22] rounded-lg p-3 border border-[#30363D]">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-[#FFB347] mr-2" />
                        <span className="text-xs text-[#8B949E]">Rate</span>
                      </div>
                      <p className="text-sm font-semibold text-[#C9D1D9] mt-1">
                        ${bid.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-[#161B22] rounded-lg p-3 border border-[#30363D]">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-[#2F81F7] mr-2" />
                        <span className="text-xs text-[#8B949E]">Timeline</span>
                      </div>
                      <p className="text-sm font-semibold text-[#C9D1D9] mt-1">
                        {bid.estimatedTime}
                      </p>
                    </div>
                    <div className="bg-[#161B22] rounded-lg p-3 border border-[#30363D]">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-[#28A745] mr-2" />
                        <span className="text-xs text-[#8B949E]">Status</span>
                      </div>
                      <p
                        className={`text-sm font-semibold mt-1 ${
                          bid.status === "IN_PROGRESS"
                            ? "text-[#28A745]"
                            : "text-[#C9D1D9]"
                        }`}
                      >
                        {bid.status === "IN_PROGRESS"
                          ? "IN_PROGRESS"
                          : "Pending"}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  {canSelectSeller && bid.status === "PENDING" && (
                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleSelectSeller(bid.id)}
                        disabled={selectSellerMutation.isPending}
                        className="bg-[#28A745] hover:bg-[#28A745]/90 text-white"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Select This Seller
                      </Button>
                    </div>
                  )}
                </div>

                {bidsToShow && index < bidsToShow.length - 1 && (
                  <Separator className="my-6 bg-[#30363D]" />
                )}
              </div>
            ))}
          </div>

          {/* Selection Tips */}
          {canSelectSeller && approvedBids.length > 0 && (
            <div className="mt-8 bg-[#FFB347]/10 border border-[#FFB347]/20 rounded-lg p-6">
              <h4 className="text-base font-medium text-[#FFB347] mb-3 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Tips for Selecting the Right Seller
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="text-sm text-[#8B949E] space-y-2">
                  <li>• Review their proposal details carefully</li>
                  <li>• Consider both price and timeline</li>
                  <li>• Look for relevant experience and skills</li>
                </ul>
                <ul className="text-sm text-[#8B949E] space-y-2">
                  <li>• Check seller ratings and reviews</li>
                  <li>• Ensure clear communication in their proposal</li>
                  <li>• Consider their understanding of your requirements</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="bg-[#161B22] border-[#30363D] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#C9D1D9] flex items-center">
              <CheckCircle2 className="h-5 w-5 text-[#28A745] mr-2" />
              Confirm Seller Selection
            </DialogTitle>
            <DialogDescription className="text-[#8B949E]">
              Are you sure you want to select this seller for your project?
            </DialogDescription>
          </DialogHeader>

          {selectedBid && (
            <div className="bg-[#1F2A36] rounded-lg p-4 my-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-[#C9D1D9]">
                  {selectedBid.seller?.email || "Selected Seller"}
                </h4>
                <Badge className="bg-[#28A745]/20 text-[#28A745] border-[#28A745]/30">
                  ${selectedBid.amount.toLocaleString()}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[#8B949E]">Timeline:</span>
                  <p className="text-[#C9D1D9] font-medium">
                    {selectedBid.estimatedTime}
                  </p>
                </div>
                <div>
                  <span className="text-[#8B949E]">Amount:</span>
                  <p className="text-[#C9D1D9] font-medium">
                    ${selectedBid.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={confirmSelection}
              disabled={selectSellerMutation.isPending}
              className="flex-1 bg-[#28A745] hover:bg-[#28A745]/90 text-white"
            >
              {selectSellerMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {selectSellerMutation.isPending
                ? "Selecting..."
                : "Confirm Selection"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              disabled={selectSellerMutation.isPending}
              className="border-[#30363D] text-[#8B949E] hover:bg-[#1F2A36]"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
