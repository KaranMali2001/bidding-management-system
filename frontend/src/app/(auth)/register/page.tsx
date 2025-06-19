"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authApi } from "@/lib/api/auth";
import { registerSchema, type RegisterForm } from "@/lib/schemas";
import { useAuthStore } from "@/lib/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import cookies from "cookies-next";
import { Briefcase, Loader2, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const router = useRouter();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "BUYER",
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(data);
      setAuth(response.user, response.token);
      toast.success("Registration successful");
      cookies.setCookie("Authorization", response.token);
      if (response.user.role === "BUYER") {
        router.push("/dashboard/buyer/");
      } else {
        router.push("/dashboard/seller/");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">BidConnect</span>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">
              Join BidConnect
            </CardTitle>
            <CardDescription className="text-gray-400">
              Create your account and start connecting with top talent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">I want to</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-900 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem
                            value="BUYER"
                            className="text-white hover:bg-gray-700 focus:bg-gray-700"
                          >
                            <div className="flex items-center space-x-2">
                              <Briefcase className="w-4 h-4 text-red-500" />
                              <span>Hire freelancers (Buyer)</span>
                            </div>
                          </SelectItem>
                          <SelectItem
                            value="SELLER"
                            className="text-white hover:bg-gray-700 focus:bg-gray-700"
                          >
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-red-500" />
                              <span>Work as freelancer (Seller)</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-semibold"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Account
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-400">Already have an account? </span>
              <Link
                href="/login"
                className="text-red-500 hover:text-red-400 font-medium hover:underline"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
