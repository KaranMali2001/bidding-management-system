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
import { Textarea } from "@/components/ui/textarea";
import { projectsApi } from "@/lib/api/projects";
import { projectSchema } from "@/lib/schemas";
import type { CreateProjectPayload, Project } from "@/lib/types";
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
  Target,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type ProjectForm = z.infer<typeof projectSchema>;

export default function CreateProjectModalContent({
  onSuccess,
  setProjects,
}: {
  setProjects: Dispatch<SetStateAction<Project[]>>;
  onSuccess?: () => void;
}) {
  const form = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      budgetMin: 0,
      budgetMax: 0,
      deadline: "",
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: (data: CreateProjectPayload) => projectsApi.createProject(data),
    onSuccess: (project) => {
      toast.success("Project created successfully! 🎉");
      setProjects((prevProjects) => [...prevProjects, project]);
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Project creation error:", error);
      toast.error("Failed to create project. Please try again.");
    },
  });

  const onSubmit = (data: ProjectForm) => {
    console.log("data", data);
    const submitData: CreateProjectPayload = {
      ...data,
      deadline: data.deadline.toString(),
    };
    createProjectMutation.mutate(submitData);
  };

  const watchedBudgetMin = form.watch("budgetMin");
  const watchedBudgetMax = form.watch("budgetMax");

  return (
    <div className="w-full mx-auto px-4 overflow-y-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2F81F7]/20 rounded-full mb-4">
          <Target className="w-8 h-8 text-[#2F81F7]" />
        </div>
        <h1 className="text-3xl font-bold text-[#C9D1D9] mb-2">
          Create New Project
        </h1>
        <p className="text-[#8B949E] text-lg max-w-2xl mx-auto">
          Tell us about your project and start receiving proposals from talented
          freelancers worldwide
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Project Details Section */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#2F81F7]/20 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-[#2F81F7]" />
              </div>
              <h2 className="text-xl font-semibold text-[#C9D1D9]">
                Project Details
              </h2>
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#C9D1D9] font-medium text-base">
                      Project Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Build a modern e-commerce website with React and Node.js"
                        className="bg-[#1F2A36] border-[#30363D] text-[#C9D1D9] placeholder:text-[#8B949E] focus:border-[#2F81F7] focus:ring-[#2F81F7] h-12 text-base"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between items-center">
                      <FormMessage className="text-[#F85149]" />
                      <span className="text-xs text-[#8B949E]">
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
                    <FormLabel className="text-[#C9D1D9] font-medium text-base">
                      Project Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={8}
                        className="bg-[#1F2A36] border-[#30363D] text-[#C9D1D9] placeholder:text-[#8B949E] focus:border-[#2F81F7] focus:ring-[#2F81F7] resize-none text-base leading-relaxed"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between items-center">
                      <FormMessage className="text-[#F85149]" />
                      <span className="text-xs text-[#8B949E]">
                        {field.value.length}/2000
                      </span>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Budget & Timeline Section */}
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget Section */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#FFB347]/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-[#FFB347]" />
                </div>
                <h2 className="text-xl font-semibold text-[#C9D1D9]">
                  Budget Range
                </h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="budgetMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#C9D1D9] font-medium">
                          Minimum ($)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="500"
                            className="bg-[#1F2A36] border-[#30363D] text-[#C9D1D9] placeholder:text-[#8B949E] focus:border-[#2F81F7] focus:ring-[#2F81F7] h-12 text-base"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage className="text-[#F85149]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budgetMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#C9D1D9] font-medium">
                          Maximum ($)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="2000"
                            className="bg-[#1F2A36] border-[#30363D] text-[#C9D1D9] placeholder:text-[#8B949E] focus:border-[#2F81F7] focus:ring-[#2F81F7] h-12 text-base"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage className="text-[#F85149]" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Budget Preview */}
                {watchedBudgetMin > 0 &&
                  watchedBudgetMax > 0 &&
                  watchedBudgetMax >= watchedBudgetMin && (
                    <div className="bg-[#1F2A36] border border-[#30363D] rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-[#28A745]" />
                        <span className="text-sm font-medium text-[#28A745]">
                          Budget Range Set
                        </span>
                      </div>
                      <p className="text-[#C9D1D9] font-semibold">
                        ${watchedBudgetMin.toLocaleString()} - $
                        {watchedBudgetMax.toLocaleString()}
                      </p>
                      <p className="text-xs text-[#8B949E] mt-1">
                        Average: $
                        {Math.round(
                          (watchedBudgetMin + watchedBudgetMax) / 2
                        ).toLocaleString()}
                      </p>
                    </div>
                  )}
              </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#28A745]/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#28A745]" />
                </div>
                <h2 className="text-xl font-semibold text-[#C9D1D9]">
                  Project Timeline
                </h2>
              </div>

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-[#C9D1D9] font-medium text-base">
                      Project Deadline
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-12 pl-3 text-left font-normal bg-[#1F2A36] border-[#30363D] text-[#C9D1D9] hover:bg-[#1F2A36] hover:border-[#2F81F7]",
                              !field.value && "text-[#8B949E]"
                            )}
                          >
                            {field.value ? (
                              <span className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-[#2F81F7]" />
                                {format(new Date(field.value), "PPP")}
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-[#8B949E]" />
                                Select a deadline
                              </span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-[#161B22] border-[#30363D]"
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
                          className="bg-[#161B22] text-[#C9D1D9]"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-[#F85149]" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                disabled={createProjectMutation.isPending}
                className="flex-1 bg-[#2F81F7] hover:bg-[#2F81F7]/90 text-white font-medium h-12 text-base"
              >
                {createProjectMutation.isPending && (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                )}
                {createProjectMutation.isPending
                  ? "Creating Project..."
                  : "Create Project & Start Receiving Bids"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onSuccess}
                disabled={createProjectMutation.isPending}
                className="border-[#30363D] text-[#8B949E] hover:bg-[#1F2A36] hover:text-[#C9D1D9] h-12 px-8"
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
