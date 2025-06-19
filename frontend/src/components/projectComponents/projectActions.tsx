"use client";

import { Button } from "@/components/ui/button";
import type { Bid, Project } from "@/lib/types";
import { CheckCircle, Edit, LogIn, Trash2 } from "lucide-react";
import Link from "next/link";

interface ProjectActionsProps {
  project: Project;
  isAuthenticated: boolean;
  role: string;
  canBid: boolean;
  canEditBid: boolean;
  userHasBid: boolean;
  userBid: Bid | null | undefined | false;
  onSubmitBid: () => void;
  onEditBid: (bid: Bid) => void;
  onDeleteBid: (bidId: string) => void;
}

export default function ProjectActions({
  project,
  isAuthenticated,
  role,
  canBid,
  canEditBid,
  userHasBid,
  userBid,
  onSubmitBid,
  onEditBid,
  onDeleteBid,
}: ProjectActionsProps) {
  return (
    <div className="flex flex-col justify-center">
      {/* Unauthenticated user - show login prompt */}
      {!isAuthenticated && project.status === "PENDING" && (
        <div className="bg-[#2F81F7]/20 border border-[#2F81F7]/30 rounded-lg p-4">
          <div className="text-center">
            <LogIn className="h-5 w-5 text-[#2F81F7] mx-auto mb-2" />
            <p className="text-sm text-[#2F81F7] mb-3">Login to submit a bid</p>
            <Link href="/login">
              <Button
                size="sm"
                className="w-full bg-[#2F81F7] hover:bg-[#2F81F7]/90"
              >
                Login to Bid
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Authenticated seller who can bid */}
      {canBid && !userHasBid && (
        <Button
          onClick={onSubmitBid}
          className="w-full bg-[#FFB347] hover:bg-[#FFB347]/90 text-[#0D1117]"
        >
          Submit Bid
        </Button>
      )}

      {/* Authenticated seller who already has a bid */}
      {userHasBid && (
        <div className="bg-[#28A745]/20 border border-[#28A745]/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-[#28A745] mr-2" />
              <span className="text-sm font-medium text-[#28A745]">
                Bid Submitted
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => userBid && onEditBid(userBid)}
                disabled={!canEditBid}
                className="border-[#30363D] text-[#8B949E] hover:bg-[#1F2A36]"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => userBid && onDeleteBid(userBid.id)}
                disabled={!canEditBid}
                className="border-[#F85149]/30 text-[#F85149] hover:bg-[#F85149]/10"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Authenticated buyer or wrong role */}
      {isAuthenticated && role === "BUYER" && (
        <div className="bg-[#1F2A36] rounded-lg p-4 text-center">
          <p className="text-sm text-[#8B949E]">
            Only sellers can bid on projects
          </p>
        </div>
      )}

      {/* Project not accepting bids */}
      {project.status !== "PENDING" && (
        <div className="bg-[#1F2A36] rounded-lg p-4 text-center">
          <p className="text-sm text-[#8B949E]">
            This project is no longer accepting bids
          </p>
        </div>
      )}
    </div>
  );
}
