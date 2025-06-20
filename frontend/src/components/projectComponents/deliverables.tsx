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
import { Project } from "@/lib/types";
import { getTokenClient } from "@/utils/getTokenClient";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Archive, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const deliverableSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  file: z.any().optional(),
});

type DeliverableForm = z.infer<typeof deliverableSchema>;

interface DeliverablesUploadProps {
  projectId: string;
  onUploadSuccess?: () => void;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
}

export default function DeliverablesUpload({
  projectId,
  onUploadSuccess,
  setProject,
}: DeliverablesUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<DeliverableForm>({
    resolver: zodResolver(deliverableSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Check if file is a ZIP file
      const isZipFile =
        file.type === "application/zip" ||
        file.type === "application/x-zip-compressed" ||
        file.name.toLowerCase().endsWith(".zip");

      if (!isZipFile) {
        toast.error("Please select a ZIP file only");
        e.target.value = ""; // Clear the input
        return;
      }

      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const onSubmit = async (data: DeliverableForm) => {
    if (!selectedFile) {
      toast.error("Please select a ZIP file to upload");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", data.title);
      formData.append("description", data.description);
      const token = getTokenClient();
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/deliverables/${projectId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token}`,
          },
        }
      );
      setProject((prev) => ({
        ...prev,
        status: "COMPLETED",
      }));
      form.reset();
      setSelectedFile(null);
      onUploadSuccess?.();
    } catch (error) {
      toast.error("Failed to upload deliverable");
      console.error("Upload error:", error);
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
          Upload your completed work as a single ZIP file
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
                Upload ZIP File
              </label>
              <div className="border-2 border-dashed border-[#30363D] rounded-lg p-6 text-center hover:border-[#2F81F7] transition-colors">
                <Archive className="h-8 w-8 text-[#8B949E] mx-auto mb-2" />
                <p className="text-[#8B949E] mb-2">
                  Select a ZIP file containing your deliverables
                </p>
                <Input
                  type="file"
                  accept=".zip,application/zip,application/x-zip-compressed"
                  onChange={handleFileChange}
                  className="bg-[#1F2A36] border-[#30363D] text-[#C9D1D9] file:bg-[#2F81F7] file:text-white file:border-0 file:rounded file:px-3 file:py-1"
                />
                {selectedFile && (
                  <div className="mt-3 text-left">
                    <p className="text-sm text-[#C9D1D9] mb-1">
                      Selected file:
                    </p>
                    <div className="flex items-center gap-2">
                      <Archive className="h-4 w-4 text-[#8B949E]" />
                      <span className="text-xs text-[#8B949E]">
                        {selectedFile.name} (
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isUploading || !selectedFile}
                className="bg-[#28A745] hover:bg-[#28A745]/90 text-white"
              >
                {isUploading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Upload Deliverable
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setSelectedFile(null);
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
