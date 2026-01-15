"use client";

import * as React from "react";
import {
  Home,
  Users,
  GraduationCap,
  LogIn,
  UserPlus,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  Search
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface NavbarProps {
  className?: string;
  currentView?: string;
  onViewChange?: (view: string) => void;
  user?: any;
  onLogout?: () => void;
}

export function Navbar({ className, currentView, onViewChange, user, onLogout }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("hamroguru_user");
      window.location.href = "/";
    }
  };

  const navLinks = [
    { label: "Home", href: "landing", icon: Home },
  ];

  // Hide these for Teachers
  if (!user || user.role !== 'teacher') {
    navLinks.push(
      { label: "Find Teacher", href: "find-teacher", icon: Users },
      { label: "Become a Teacher", href: "become-teacher", icon: GraduationCap }
    );
  }

  if (!user) {
    navLinks.push(
      { label: "Sign In", href: "sign-in", icon: LogIn },
      { label: "Sign Up", href: "sign-up", icon: UserPlus }
    );
  }

  const handleNavigation = (href: string) => {
    // If routing to specific pages that exist as actual routes
    if (href === 'profile') {
      window.location.href = '/profile';
      return;
    }

    if (onViewChange) {
      onViewChange(href);
    } else {
      // Fallback if not on SPA main page
      if (href === 'landing') window.location.href = '/';
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={cn(
      "border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50",
      className
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onViewChange("landing")}
          >
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.href;
              return (
                <Button
                  key={link.href}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => handleNavigation(link.href)}
                  className={cn(
                    "gap-2",
                    link.label === "Sign In" || link.label === "Sign Up"
                      ? "bg-primary/10 hover:bg-primary/20 text-primary"
                      : ""
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Button>
              );
            })}

            {user && (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l">
                <Button variant={currentView === 'profile' ? 'default' : 'ghost'} onClick={() => window.location.href = '/profile'} className="gap-2">
                  <UserIcon className="w-4 h-4" />
                  {user.name.split(' ')[0]}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.href;
              return (
                <Button
                  key={link.href}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => handleNavigation(link.href)}
                  className={cn(
                    "w-full justify-start gap-2",
                    link.label === "Sign In" || link.label === "Sign Up"
                      ? "bg-primary/10 hover:bg-primary/20 text-primary"
                      : ""
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Button>
              );
            })}
            {user && (
              <>
                <Button variant="ghost" onClick={() => window.location.href = '/profile'} className="w-full justify-start gap-2">
                  <UserIcon className="w-4 h-4" />
                  Profile
                </Button>
                <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-2 text-destructive">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function LogOut({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}
