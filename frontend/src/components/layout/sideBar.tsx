"use client";

import { authApi } from "@/lib/api/auth";
import { getTokenClient } from "@/utils/getTokenClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next/client";
import { FolderOpen, LayoutDashboard, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner"; // or your preferred toast library
import { Button } from "../ui/button";

const buyerNavigation = [
  { name: "Dashboard", href: "/dashboard/buyer", icon: LayoutDashboard },
  { name: "Explore Projects", href: "/projects", icon: FolderOpen },
];

const sellerNavigation = [
  { name: "Dashboard", href: "/dashboard/seller", icon: LayoutDashboard },
  { name: "Browse Projects", href: "/projects", icon: FolderOpen },
];
const defaultNavigation = [
  { name: "Browse Projects", href: "/projects", icon: FolderOpen },
];

// Function to get navigation based on role
const getNavigationByRole = (role: string) => {
  console.log("role from sidbar", role);
  switch (role?.toLowerCase()) {
    case "buyer":
      return buyerNavigation;
    case "seller":
      return sellerNavigation;
    default:
      return defaultNavigation; // Default to seller navigation
  }
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = getTokenClient();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: authApi.getCurrentUser,
    enabled: !!token,
  });

  // Get navigation based on user role
  const navigation = user?.role
    ? getNavigationByRole(user.role)
    : defaultNavigation;

  // Get user initials for avatar
  const getUserInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };
  console.log("user", user);
  // Logout function
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      deleteCookie("Authorization");
      // Clear all queries
      queryClient.clear();

      // Redirect to login page
      router.push("/login");

      // Show success message
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 border-r border-gray-800">
      <div className="flex h-16 items-center px-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">BidManager</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }
              `}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-800 p-4">
        {isLoading ? (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center animate-pulse">
              <User className="h-4 w-4 text-gray-400" />
            </div>
            <div className="ml-3">
              <div className="h-4 bg-gray-600 rounded animate-pulse mb-1"></div>
              <div className="h-3 bg-gray-700 rounded animate-pulse w-24"></div>
            </div>
          </div>
        ) : isError ? (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Guest</p>
              <p className="text-xs text-gray-400">Not logged in</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {getUserInitials(user?.name, user?.email)}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {user?.name || user?.email || "Guest"}
                </p>
                <p className="text-xs text-gray-400">
                  {user?.email || user?.role}
                </p>
                {user?.role && (
                  <p className="text-xs text-blue-400 capitalize">
                    {user.role}
                  </p>
                )}
              </div>
            </div>

            {/* Logout Button */}
            {user && (
              <Button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors group"
              >
                <LogOut className="mr-3 h-4 w-4 flex-shrink-0" />
                Logout
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
