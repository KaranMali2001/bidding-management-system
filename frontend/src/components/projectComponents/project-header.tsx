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
import type { Project } from "@/lib/types";
import { Calendar, DollarSign, Edit } from "lucide-react";

interface ProjectHeaderProps {
  project: Project;
  isProjectOwner: boolean;
  onEditProject: (project: Project) => void;
}

export default function ProjectHeader({
  project,
  isProjectOwner,
  onEditProject,
}: ProjectHeaderProps) {
  return (
    <Card className="bg-[#161B22] border border-[#30363D]">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl text-[#C9D1D9] mb-2">
              {project.title}
            </CardTitle>
            <CardDescription className="text-[#8B949E] text-base leading-relaxed">
              {project.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant={project.status === "PENDING" ? "default" : "secondary"}
              className={`${
                project.status === "PENDING"
                  ? "bg-[#28A745]/20 text-[#28A745] border-[#28A745]/30"
                  : project.status === "IN_PROGRESS"
                  ? "bg-[#2F81F7]/20 text-[#2F81F7] border-[#2F81F7]/30"
                  : project.status === "COMPLETED"
                  ? "bg-[#FFB347]/20 text-[#FFB347] border-[#FFB347]/30"
                  : "bg-[#1F2A36] text-[#8B949E] border-[#30363D]"
              }`}
            >
              {project.status === "IN_PROGRESS"
                ? "In Progress"
                : project.status}
            </Badge>
            {isProjectOwner && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditProject(project)}
                className="border-[#FFB347]/30 text-[#FFB347] hover:bg-[#FFB347]/10"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#1F2A36] rounded-lg p-4">
            <div className="flex items-center mb-2">
              <DollarSign className="h-5 w-5 text-[#8B949E] mr-2" />
              <span className="text-sm font-medium text-[#8B949E]">
                Budget Range
              </span>
            </div>
            <p className="text-xl font-bold text-[#C9D1D9]">
              ${project.budgetMin.toLocaleString()} - $
              {project.budgetMax.toLocaleString()}
            </p>
          </div>

          <div className="bg-[#1F2A36] rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-[#8B949E] mr-2" />
              <span className="text-sm font-medium text-[#8B949E]">
                Deadline
              </span>
            </div>
            <p className="text-lg font-semibold text-[#C9D1D9]">
              {new Date(project.deadline).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
