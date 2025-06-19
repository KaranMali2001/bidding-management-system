"use client";
import { Button } from "@/components/ui/button"; // Adjust import based on your UI lib
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <div className="max-w-md">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-6">
          We encountered an unexpected error. Please try again or go back to the
          homepage.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </div>
      </div>
    </div>
  );
}
