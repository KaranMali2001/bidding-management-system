"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { bidSchema } from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import type { z } from "zod"

type BidForm = z.infer<typeof bidSchema>

interface BidFormProps {
  editingBid: string | null
  isLoading: boolean
  onSubmit: (data: BidForm) => void
  onCancel: () => void
  defaultValues?: Partial<BidForm>
}

export default function BidFormComponent({ editingBid, isLoading, onSubmit, onCancel, defaultValues }: BidFormProps) {
  const form = useForm<BidForm>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      amount: defaultValues?.amount || 0,
      estimatedTime: defaultValues?.estimatedTime || "",
      message: defaultValues?.message || "",
    },
  })

  return (
    <Card className="bg-[#161B22] border border-[#30363D]">
      <CardHeader>
        <CardTitle className="text-xl text-[#C9D1D9]">{editingBid ? "Edit Your Bid" : "Submit Your Bid"}</CardTitle>
        <CardDescription className="text-[#8B949E]">
          {editingBid ? "Update your proposal for this project" : "Provide your proposal for this project"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#C9D1D9] font-medium">Bid Amount ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter your bid amount"
                        className="bg-[#1F2A36] border-[#30363D] text-[#C9D1D9] placeholder:text-[#8B949E] focus:border-[#2F81F7] focus:ring-[#2F81F7]"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                    <FormLabel className="text-[#C9D1D9] font-medium">Estimated Time</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 2 weeks, 1 month"
                        className="bg-[#1F2A36] border-[#30363D] text-[#C9D1D9] placeholder:text-[#8B949E] focus:border-[#2F81F7] focus:ring-[#2F81F7]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#C9D1D9] font-medium">Proposal Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your approach, experience, and why you're the best fit for this project"
                      rows={4}
                      className="bg-[#1F2A36] border-[#30363D] text-[#C9D1D9] placeholder:text-[#8B949E] focus:border-[#2F81F7] focus:ring-[#2F81F7]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isLoading} className="bg-[#FFB347] hover:bg-[#FFB347]/90 text-[#0D1117]">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingBid ? "Update Bid" : "Submit Bid"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-[#30363D] text-[#8B949E] hover:bg-[#1F2A36]"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
