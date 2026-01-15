"use client";

import React, { useState, useEffect } from 'react';
import { Search, GraduationCap, Award, Shield, Users, BookOpen } from 'lucide-react';
import { cn } from "@/lib/utils";

// --- Data for image accordion adapted for HamroGuru ---
const accordionItems = [
  {
    id: 1,
    title: 'Find Teachers',
    description: 'Browse verified tutors in your area',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1974&auto=format&fit=crop',
    icon: Search,
  },
  {
    id: 2,
    title: 'Expert Tutors',
    description: 'Qualified teachers you can trust',
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2070&auto=format&fit=crop',
    icon: Award,
  },
  {
    id: 3,
    title: 'Safe Platform',
    description: 'Consent-based communication',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1974&auto=format&fit=crop',
    icon: Shield,
  },
  {
    id: 4,
    title: 'Local Learning',
    description: 'Connect with tutors near you',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2090&auto=format&fit=crop',
    icon: Users,
  },
  {
    id: 5,
    title: 'All Subjects',
    description: 'Math, Science, Languages & more',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop',
    icon: BookOpen,
  },
];

// --- Accordion Item Component ---
const AccordionItem = ({ item, isActive, onClick, onMouseEnter }) => {
  const Icon = item.icon;

  return (
    <div
      className={cn(
        "relative h-[350px] md:h-[450px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ease-in-out",
        isActive ? "flex-[5] md:flex-[4]" : "flex-1 md:flex-[0.5]"
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      {/* Background Image */}
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = 'https://placehold.co/400x450/2d3748/ffffff?text=Image+Error';
        }}
      />
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      {/* Darker overlay on hover/active */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

      {/* Caption Text */}
      <div
        className={cn(
          "absolute text-white transition-all duration-300 ease-in-out",
          isActive
            ? "bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 rotate-0 text-center px-2 md:px-4 w-full"
            : "bottom-12 left-1/2 -translate-x-1/2 rotate-90 whitespace-nowrap opacity-0 md:opacity-100"
        )}
      >
        {isActive && (
          <div className="space-y-1 md:space-y-2">
            <Icon className="h-5 w-5 md:h-8 md:w-8 mx-auto" />
            <span className="text-sm md:text-lg font-semibold block">{item.title}</span>
            <p className="text-[10px] md:text-sm text-white/80 max-w-[250px] mx-auto line-clamp-2 md:line-clamp-none">
              {item.description}
            </p>
          </div>
        )}
        {!isActive && (
          <span className="text-xs md:text-base font-semibold">{item.title}</span>
        )}
      </div>
    </div>
  );
};

// --- Main Component ---
export function LandingAccordionItem({ user, onViewChange }: { user?: any; onViewChange?: (view: string) => void }) {
  const [activeIndex, setActiveIndex] = useState(0); // Default to first item per user request

  useEffect(() => {
    // Auto-play interval for mobile view (phones)
    const interval = setInterval(() => {
      // Only auto-play on mobile phones (standard breakpoint 768px for tablets)
      if (window.innerWidth < 768) {
        setActiveIndex((current) => (current + 1) % accordionItems.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleItemHover = (index: number) => {
    setActiveIndex(index);
  };

  const isTeacher = user?.role === "teacher";

  return (
    <div className="bg-background font-sans">
      <section className="container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Side: Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight tracking-tight mb-6">
              {isTeacher ? (
                <>Welcome back, <span className="text-primary">Teacher</span>. Share your knowledge.</>
              ) : (
                <>Connect with Trusted <span className="text-primary">Tutors</span> in Nepal</>
              )}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              {isTeacher
                ? "Manage your classes, respond to student inquiries, and update your professional profile to attract more students."
                : "Find verified teachers for personalized learning. Safe, consent-based communication, and local tutors across all major subjects. Join thousands of students and parents who trust HamroGuru."}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {isTeacher ? (
                <button
                  onClick={() => onViewChange ? onViewChange('profile') : window.location.href = '/profile'}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-primary/90 transition-colors duration-300"
                >
                  <GraduationCap className="w-4 h-4" />
                  My Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onViewChange ? onViewChange('find-teacher') : window.location.href = '/find-teacher'}
                    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-primary/90 transition-colors duration-300"
                  >
                    <Search className="w-4 h-4" />
                    Find a Teacher
                  </button>
                  <button
                    onClick={() => onViewChange ? onViewChange('become-teacher') : window.location.href = '/become-teacher'}
                    className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-secondary/90 transition-colors duration-300"
                  >
                    <GraduationCap className="w-4 h-4" />
                    Become a Teacher
                  </button>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Verified Teachers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">5000+</div>
                <div className="text-sm text-muted-foreground">Happy Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* Right Side: Image Accordion */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div className="flex flex-row items-center justify-center gap-1 md:gap-2 overflow-x-hidden p-2 md:p-4 w-full">
              {accordionItems.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isActive={index === activeIndex}
                  onClick={() => handleItemHover(index)}
                  onMouseEnter={() => handleItemHover(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
