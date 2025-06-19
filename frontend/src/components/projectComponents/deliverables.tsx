"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUp, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const deliverableSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  files: z.any().optional(),
});

type DeliverableForm = z.infer<typeof deliverableSchema>;

interface DeliverablesUploadProps {
  projectId: string;
  onUploadSuccess?: () => void;
}

export default function DeliverablesUpload({
  projectId,
  onUploadSuccess,
}: DeliverablesUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const form = useForm<DeliverableForm>({
    resolver: zodResolver(deliverableSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const onSubmit = async (data: DeliverableForm) => {
    setIsUploading(true);
    try {
      // TODO: Implement actual file upload logic here
      // This is a placeholder for the upload functionality
      console.log("Uploading deliverables:", {
        ...data,
        files: selectedFiles,
        projectId,
      });

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Deliverables uploaded successfully!");
      form.reset();
      setSelectedFiles(null);
      onUploadSuccess?.();
    } catch (error) {
      toast.error("Failed to upload deliverables");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="bg-[#161B22] border border-[#30363D]">
      <CardHeader>
        <CardTitle className="text-xl text-[#C9D1D9] flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Deliverables
        </CardTitle>
        <CardDescription className="text-[#8B949E]">
          Upload your completed work and project deliverables
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#C9D1D9] font-medium">
                    Deliverable Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Final Website Design, Mobile App v1.0"
                      className="bg-[#1F2A36] border-[#30363D] text-[#C9D1D9] placeholder:text-[#8B949E] focus:border-[#2F81F7] focus:ring-[#2F81F7]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#C9D1D9] font-medium">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what you've delivered, any special instructions, or notes for the client"
                      rows={3}
                      className="bg-[#1F2A36] border-[#30363D] text-[#C9D1D9] placeholder:text-[#8B949E] focus:border-[#2F81F7] focus:ring-[#2F81F7]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <label className="text-[#C9D1D9] font-medium text-sm">
                Upload Files
              </label>
              <div className="border-2 border-dashed border-[#30363D] rounded-lg p-6 text-center hover:border-[#2F81F7] transition-colors">
                <FileUp className="h-8 w-8 text-[#8B949E] mx-auto mb-2" />
                <p className="text-[#8B949E] mb-2">
                  Drag and drop files here, or click to select
                </p>
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="bg-[#1F2A36] border-[#30363D] text-[#C9D1D9] file:bg-[#2F81F7] file:text-white file:border-0 file:rounded file:px-3 file:py-1"
                />
                {selectedFiles && selectedFiles.length > 0 && (
                  <div className="mt-3 text-left">
                    <p className="text-sm text-[#C9D1D9] mb-1">
                      Selected files:
                    </p>
                    {Array.from(selectedFiles).map((file, index) => (
                      <p key={index} className="text-xs text-[#8B949E]">
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isUploading}
                className="bg-[#28A745] hover:bg-[#28A745]/90 text-white"
              >
                {isUploading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Upload Deliverables
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setSelectedFiles(null);
                }}
                className="border-[#30363D] text-[#8B949E] hover:bg-[#1F2A36]"
              >
                Clear
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
