import { z } from "zod"

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["BUYER", "SELLER"], {
    required_error: "Please select a role",
  }),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const bidSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
  amount: z.number().positive("Amount must be positive"),
  estimatedTime: z.string().min(1, "Estimated time is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export const deliverableSchema = z.object({
  fileUrl: z.string().url("Invalid file URL"),
})

export const projectSchema = z
  .object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    budgetMin: z.number().nonnegative("Budget must be non-negative"),
    budgetMax: z.number().nonnegative("Budget must be non-negative"),
    deadline: z.string().datetime("Invalid deadline format"),
  })
  .refine((data) => data.budgetMax >= data.budgetMin, {
    message: "Maximum budget must be greater than or equal to minimum budget",
    path: ["budgetMax"],
  })

export const reviewSchema = z.object({
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  review: z.string().min(10, "Review must be at least 10 characters"),
})

export type RegisterForm = z.infer<typeof registerSchema>
export type LoginForm = z.infer<typeof loginSchema>
export type BidForm = z.infer<typeof bidSchema>
export type DeliverableForm = z.infer<typeof deliverableSchema>
export type ProjectForm = z.infer<typeof projectSchema>
export type ReviewForm = z.infer<typeof reviewSchema>
