"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Award,
  Star,
  Mail,
  Phone,
  MapPin,
  Users,
  GraduationCap,
  ArrowRight,
  Search,
  BookOpen,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LandingAccordionItem } from "@/components/ui/interactive-image-accordion";
import { PinContainer } from "@/components/ui/3d-pin";
import { Timeline } from "@/components/ui/timeline";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

const features = [
  {
    icon: Shield,
    title: "Verified Teachers",
    description: "Every teacher undergoes a strict verification process including background checks and credential validation.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Award,
    title: "Quality Education",
    description: "Access expert tutors with proven track records. Our rating system ensures you get the best learning experience.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Users,
    title: "Consent-Based Contact",
    description: "Your privacy is our priority. Contact details are shared only after mutual consent, ensuring a safe environment.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
];

const howItWorksSteps = [
  {
    title: "Create Your Profile",
    description: "Sign up as a student or teacher. Tell us about your learning goals or teaching expertise to get started.",
    icon: <Users className="h-6 w-6 text-primary" />,
    color: "bg-blue-500/10",
  },
  {
    title: "Find Your Match",
    description: "Browse through our verified base of expert tutors. Filter by subject, location, and your preferred budget.",
    icon: <GraduationCap className="h-6 w-6 text-primary" />,
    color: "bg-purple-500/10",
  },
  {
    title: "Start Learning",
    description: "Connect via WhatsApp or direct inquiry. Schedule your first session and embark on your academic journey.",
    icon: <Target className="h-6 w-6 text-primary" />,
    color: "bg-orange-500/10",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Student, Grade 10",
    content: "Found an amazing math tutor through HamroGuru. My grades improved significantly!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    name: "Rajesh Kumar",
    role: "Verified Teacher",
    content: "Great platform to connect with students. The verification process ensures quality and trust.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  },
  {
    name: "Anita Thapa",
    role: "Parent",
    content: "Love the safety features. I feel confident letting my kids use this platform to find help.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
];

export default function HamroGuruLanding({ user, onViewChange }: { user?: any; onViewChange?: (view: string) => void }) {
  const isTeacher = user?.role === "teacher";

  const handleNavigation = (view: string) => {
    if (onViewChange) {
      onViewChange(view);
    } else {
      window.location.href = view === 'landing' ? '/' : `/${view}`;
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden flex flex-col gap-20 pb-20">
      {/* Hero Section with Interactive Accordion */}
      <LandingAccordionItem user={user} onViewChange={onViewChange} />

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Why Choose HamroGuru?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Safe, verified, and trusted platform connecting thousands of students with expert tutors across Nepal.</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {features.map((feature, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 h-full hover:shadow-lg group">
                  <CardHeader>
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", feature.bg)}>
                      <feature.icon className={cn("h-8 w-8", feature.color)} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative group/timeline">
        <Timeline
          data={howItWorksSteps.map((step, index) => ({
            title: step.title,
            content: (
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative space-y-4">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", step.color)}>
                    {step.icon}
                  </div>
                  <p className="text-muted-foreground text-base md:text-xl leading-relaxed max-w-xl">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          }))}
        />
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-6 py-10">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold lg:text-5xl">Trusted by Students & Teachers</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Don't just take our word for it. Hear from our growing community.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-primary/5 bg-card/40 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 overflow-hidden rounded-full">
                      <img src={testimonial.image} alt={testimonial.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="italic text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t pt-16 pb-8 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">HamroGuru</span>
              </div>
              <p className="text-muted-foreground">
                Connecting students with expert teachers across Nepal. Empowering education through technology.
              </p>
            </div>
            <div>
              <h4 className="mb-6 font-bold uppercase tracking-wider text-sm text-foreground">Platform</h4>
              <ul className="space-y-3 text-muted-foreground transition-all">
                <li onClick={() => handleNavigation('find-teacher')} className="hover:text-primary cursor-pointer transition-colors">Find a Tutor</li>
                <li onClick={() => handleNavigation('become-teacher')} className="hover:text-primary cursor-pointer transition-colors">Become a Teacher</li>
                <li className="hover:text-primary cursor-not-allowed transition-colors text-muted-foreground/50">Online Classes</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-6 font-bold uppercase tracking-wider text-sm text-foreground">Company</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="hover:text-primary cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Contact</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="mb-6 font-bold uppercase tracking-wider text-sm text-foreground">Connect</h4>
              <div className="flex flex-col gap-3 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>support@hamroguru.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+977 123456789</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Kathmandu, Nepal</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} HamroGuru Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
