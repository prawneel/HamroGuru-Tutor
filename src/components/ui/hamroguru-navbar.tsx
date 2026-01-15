"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Menu, X, Search, User, LogIn, LogOut, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
}

interface DropdownItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Find Tutors', href: '/find-tutors' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About', href: '#about' },
];

const dropdownItems: DropdownItem[] = [
  { label: 'Student Registration', href: '/register/student' },
  { label: 'Teacher Registration', href: '/register/teacher' },
];

export function HamroGuruNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className={cn(
              "w-10 h-10 md:w-12 md:h-12 rounded-xl",
              "bg-primary flex items-center justify-center",
              "transition-all duration-300 group-hover:scale-105"
            )}>
              <GraduationCap className="w-6 h-6 md:w-7 md:h-7 text-primary-foreground" />
            </div>
            <span className={cn(
              "text-xl md:text-2xl font-bold",
              "text-foreground transition-colors duration-300",
              !isScrolled && "text-white"
            )}>
              HamroGuru
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 hover:text-primary relative",
                  !isScrolled && "text-white/90 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={cn(
                  "flex items-center gap-1 text-sm font-medium transition-colors duration-200",
                  !isScrolled && "text-white/90 hover:text-white"
                )}
              >
                Register
                <ChevronDown className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  isDropdownOpen && "rotate-180"
                )} />
              </button>

              {/* Dropdown Content */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg overflow-hidden"
                    >
                      {dropdownItems.map((item, index) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-accent transition-colors"
                        >
                          <GraduationCap className="w-4 h-4" />
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-2",
                !isScrolled && "text-white/90 hover:text-white hover:bg-white/10"
              )}
            >
              <Search className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-2",
                !isScrolled && "text-white/90 hover:text-white hover:bg-white/10"
              )}
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
            <Button
              size="sm"
              className="gap-2"
            >
              <User className="w-4 h-4" />
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              !isScrolled && "text-white hover:bg-white/10"
            )}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-background border-b border-border"
            >
              <div className="py-6 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3 px-1">REGISTER AS</p>
                  {dropdownItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-2 py-3 text-sm hover:bg-accent transition-colors rounded-lg"
                    >
                      <GraduationCap className="w-4 h-4" />
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="pt-4 border-t border-border flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Button>
                  <Button
                    className="w-full justify-start gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
