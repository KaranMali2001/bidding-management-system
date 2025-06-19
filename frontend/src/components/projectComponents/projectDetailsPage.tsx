"use client";

import { Navbar } from "@/components/layout/navbar";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { bidsApi } from "@/lib/api/bids";
import { Project } from "@/lib/types";
import { Calendar, DollarSign, Loader2, User } from "lucide-react";
import { toast } from "sonner";

const bidSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  estimatedTime: z.string().min(1, "Estimated time is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type BidForm = z.infer<typeof bidSchema>;

export default function ProjectDetailPage({
  project,
  userId,
  role,
}: {
  project: Project;
  userId: string;
  role: string;
}) {
  const params = useParams();

  const queryClient = useQueryClient();
  const [showBidForm, setShowBidForm] = useState(false);

  const form = useForm<BidForm>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      amount: 0,
      estimatedTime: "",
      message: "",
    },
  });

  const createBidMutation = useMutation({
    mutationFn: bidsApi.createBid,
    onSuccess: () => {
      toast.success("Bid submitted successfully");
      setShowBidForm(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["project", params.id] });
    },
    onError: () => {
      toast.error("Failed to submit bid");
    },
  });

  const onSubmitBid = (data: BidForm) => {
    createBidMutation.mutate({
      projectId: params.id as string,
      ...data,
    });
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Project not found</h1>
            <p className="text-muted-foreground">
              The project you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </div>
    );
  }
  console.log("project", project);
  const canBid = role === "SELLER" && project.status === "Pending";
  const userHasBid = project.bids?.some((bid) => bid.sellerId === userId);
  console.log("userBids", userHasBid);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {project.description}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    project.status === "Pending" ? "default" : "secondary"
                  }
                >
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold">
                      Budget: ${project.budgetMin} - ${project.budgetMax}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>
                      Deadline:{" "}
                      {new Date(project.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {canBid && !userHasBid && (
                    <Button
                      onClick={() => setShowBidForm(!showBidForm)}
                      className="w-full"
                    >
                      Submit Bid
                    </Button>
                  )}

                  {userHasBid && (
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        You have already submitted a bid for this project
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {showBidForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Submit Your Bid</CardTitle>
                <CardDescription>
                  Provide your proposal for this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmitBid)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bid Amount ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter your bid amount"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estimatedTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Time</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 2 weeks, 1 month"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Proposal Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your approach, experience, and why you're the best fit for this project"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={createBidMutation.isPending}
                      >
                        {createBidMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Submit Bid
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowBidForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {project.bids && project.bids.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Bids ({project.bids.length})</CardTitle>
                <CardDescription>
                  Proposals submitted for this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.bids.map((bid, index) => (
                    <div key={bid.id}>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {bid.seller?.name}
                            </span>
                            <Badge variant="outline">${bid.amount}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {bid.estimatedTime}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {bid.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Submitted on{" "}
                            {new Date(bid.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {project.bids && index < project.bids.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
