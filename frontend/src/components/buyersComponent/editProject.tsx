"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { projectsApi } from "@/lib/api/projects";
import { projectSchema } from "@/lib/schemas";
import type { Project, UpdateProjectPayload } from "@/lib/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  CalendarIcon,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Loader2,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type UpdateProjectForm = z.infer<typeof projectSchema>;

export default function EditProjectModalContent({
  project,
  onSuccess,
  setProjects,
}: {
  project: Project;
  setProjects: Dispatch<SetStateAction<Project>>;
  onSuccess?: () => void;
}) {
  const form = useForm<UpdateProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
      budgetMin: project.budgetMin,
      budgetMax: project.budgetMax,
      deadline: project.deadline,
      status: project.status as "PENDING" | "IN_PROGRESS" | "COMPLETED",
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: (data: UpdateProjectPayload) =>
      projectsApi.updateProject(project.id, data),
    onSuccess: (updatedProject) => {
      toast.success("Project updated successfully! ✨");
      setProjects(updatedProject);
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Project update error:", error);
      toast.error("Failed to update project. Please try again.");
    },
  });

  const onSubmit = (data: UpdateProjectForm) => {
    const submitData: UpdateProjectPayload = {
      ...data,
      deadline: data.deadline,
    };
    updateProjectMutation.mutate(submitData);
  };

  const watchedBudgetMin = form.watch("budgetMin");
  const watchedBudgetMax = form.watch("budgetMax");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "IN_PROGRESS":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "COMPLETED":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "CANCELLED":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-800 text-gray-400 border-gray-700";
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 max-h-[90vh]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Project Details Section */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Project Details
              </h2>
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-base">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Build an e-commerce website"
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between items-center">
                      <FormMessage className="text-red-400" />
                      <span className="text-xs text-gray-400">
                        {field.value.length}/100
                      </span>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium text-base">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed description..."
                        rows={8}
                        className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 resize-none text-base leading-relaxed"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between items-center">
                      <FormMessage className="text-red-400" />
                      <span className="text-xs text-gray-400">
                        {field.value.length}/2000
                      </span>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Budget, Timeline & Status Section */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Budget Section */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-yellow-500" />
                </div>
                <h2 className="text-xl font-semibold text-white">Budget</h2>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="budgetMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-medium">
                        Min ($)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="500"
                          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budgetMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-medium">
                        Max ($)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="2000"
                          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Budget Preview */}
                {watchedBudgetMin > 0 &&
                  watchedBudgetMax > 0 &&
                  watchedBudgetMax >= watchedBudgetMin && (
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                      <p className="text-white font-semibold text-sm">
                        ${watchedBudgetMin.toLocaleString()} - $
                        {watchedBudgetMax.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        Avg: $
                        {Math.round(
                          (watchedBudgetMin + watchedBudgetMax) / 2
                        ).toLocaleString()}
                      </p>
                    </div>
                  )}
              </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Timeline</h2>
              </div>

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-white font-medium text-base">
                      Project Deadline
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-12 pl-3 text-left font-normal bg-gray-900 border-gray-700 text-white hover:bg-gray-800 hover:border-blue-500",
                              !field.value && "text-gray-400"
                            )}
                          >
                            {field.value ? (
                              <span className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-blue-500" />
                                {format(new Date(field.value), "PPP")}
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-gray-400" />
                                Select a deadline
                              </span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-gray-800 border-gray-700"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date ? date.toISOString() : "")
                          }
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="bg-gray-800 text-white"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            {/* Status Section */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-yellow-500" />
                </div>
                <h2 className="text-xl font-semibold text-white">Status</h2>
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium">
                      Project Status
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-900 border-gray-700 text-white h-12">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem
                          value="Pending"
                          className="text-white hover:bg-gray-700 focus:bg-gray-700"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            Pending
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="IN_PROGRESS"
                          className="text-white hover:bg-gray-700 focus:bg-gray-700"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            In Progress
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="COMPLETED"
                          className="text-white hover:bg-gray-700 focus:bg-gray-700"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Completed
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="CANCELLED"
                          className="text-white hover:bg-gray-700 focus:bg-gray-700"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            Cancelled
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />

                    {/* Current Status Display */}
                    <div
                      className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2",
                        getStatusColor(field.value || "PENDING")
                      )}
                    >
                      Current:{" "}
                      {field.value === "IN_PROGRESS"
                        ? "In Progress"
                        : field.value}
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                disabled={updateProjectMutation.isPending}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium h-12 text-base"
              >
                {updateProjectMutation.isPending && (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                )}
                {updateProjectMutation.isPending
                  ? "Updating Project..."
                  : "Update Project"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onSuccess}
                disabled={updateProjectMutation.isPending}
                className="border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white h-12 px-8"
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
