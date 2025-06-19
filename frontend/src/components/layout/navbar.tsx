"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/lib/stores/auth-store";
import { LogOut, User } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <nav className="border-b bg-surface shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary">
          BiddingSystem
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/projects"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Browse Projects
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-primary/10"
                >
                  <User className="h-4 w-4 mr-2" />
                  {user?.name || user?.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-surface">
                <DropdownMenuItem asChild>
                  <Link
                    href={
                      user?.role === "BUYER"
                        ? "/buyer/dashboard"
                        : "/seller/dashboard"
                    }
                  >
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {user?.role === "SELLER" && (
                  <DropdownMenuItem asChild>
                    <Link href="/seller/bids">My Bids</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hover:bg-primary/10"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="bg-primary hover:bg-primary/90"
              >
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
