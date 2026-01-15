"use client";

import * as React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, MapPin, Phone, GraduationCap, Users, Shield, Star, Heart } from "lucide-react";

export function FooterSection() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribing:", email);
    setEmail("");
  };

  const quickLinks = [
    { label: "About Us", href: "#about" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Find Teachers", href: "/find-teacher" },
    { label: "Become a Teacher", href: "/become-teacher" },
    { label: "Sign In", href: "#sign-in" },
    { label: "Sign Up", href: "#sign-up" },
  ];

  const contactInfo = {
    email: "support@hamroguru.com",
    phone: "+977 98XXXXXXXX",
    address: "Kathmandu, Nepal",
  };

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/hamroguru", color: "bg-blue-600 hover:bg-blue-700" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/hamroguru", color: "bg-sky-500 hover:bg-sky-600" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/in/hamroguru", color: "bg-blue-700 hover:bg-blue-800" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/hamroguru", color: "bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/@hamroguru", color: "bg-red-600 hover:bg-red-700" },
  ];

  return (
    <footer className="relative border-t bg-background transition-colors duration-300">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent animate-pulse-slow" />
      </div>

      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/20 to-primary/60 blur-md animate-pulse" />
                <div className="relative w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">HamroGuru</h3>
                <p className="text-sm text-muted-foreground">Connect. Learn. Grow.</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting students with trusted tutors across Nepal. Find your perfect match today!
            </p>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">10,000+</div>
                  <div className="text-xs text-muted-foreground">Verified Tutors</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">4.9/5</div>
                  <div className="text-xs text-muted-foreground">Average Rating</div>
                </div>
              </div>
            </div>

            {/* App Download CTA */}
            <div className="pt-6">
              <Button
                className="w-full group relative overflow-hidden transition-all duration-300"
                variant="outline"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <div className="w-5 h-5">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm animate-pulse" />
                    <GraduationCap className="w-5 h-5 text-primary relative z-10" />
                  </div>
                  <span className="font-medium">Get the App</span>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-primary/80 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-primary rounded-full" />
              Quick Links
            </h4>
            <nav className="space-y-2">
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-200 py-1 px-2 rounded-lg hover:bg-accent -mx-2"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">›</span>
                  <span>{link.label}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* For Teachers */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-primary rounded-full" />
              For Teachers
            </h4>
            <nav className="space-y-2">
              {[
                { label: "Teacher Dashboard", href: "#teacher-dashboard" },
                { label: "Profile Settings", href: "#teacher-settings" },
                { label: "Teaching Resources", href: "#resources" },
                { label: "Student Reviews", href: "#reviews" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-200 py-1 px-2 rounded-lg hover:bg-accent -mx-2"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">›</span>
                  <span>{link.label}</span>
                </a>
              ))}
            </nav>

            {/* Teacher Stats Mini */}
            <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="font-semibold text-2xl font-bold text-primary">₹ 50K+</div>
                  <div className="text-xs text-muted-foreground">Avg Earnings</div>
                </div>
                <div>
                  <div className="font-semibold text-2xl font-bold text-primary">127</div>
                  <div className="text-xs text-muted-foreground">Active Students</div>
                </div>
              </div>
            </div>
          </div>

          {/* For Students */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-primary rounded-full" />
              For Students
            </h4>
            <nav className="space-y-2">
              {[
                { label: "Student Dashboard", href: "#student-dashboard" },
                { label: "My Teachers", href: "#my-teachers" },
                { label: "Schedule Classes", href: "#schedule" },
                { label: "Payment History", href: "#payments" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-200 py-1 px-2 rounded-lg hover:bg-accent -mx-2"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">›</span>
                  <span>{link.label}</span>
                </a>
              ))}
            </nav>

            {/* Student Stats Mini */}
            <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="font-semibold text-2xl font-bold text-primary">₹ 15K</div>
                  <div className="text-xs text-muted-foreground">Spent on Learning</div>
                </div>
                <div>
                  <div className="font-semibold text-2xl font-bold text-primary">4.8</div>
                  <div className="text-xs text-muted-foreground">My Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Newsletter Section */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse" />
                <div className="relative w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center">
                  <Mail className="w-3 h-3 text-primary/80" />
                </div>
              </div>
              Contact Us
            </h4>

            <div className="space-y-3">
              <a
                href={`mailto:${contactInfo.email}`}
                className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span className="group-hover:text-primary transition-colors duration-300">{contactInfo.email}</span>
              </a>

              <a
                href={`tel:${contactInfo.phone}`}
                className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span className="group-hover:text-primary transition-colors duration-300">{contactInfo.phone}</span>
              </a>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary/50" />
                <span>{contactInfo.address}</span>
              </div>
            </div>

            {/* Safety Notice */}
            <div className="mt-4 p-4 bg-primary/5 border border-primary/10 rounded-xl">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-primary text-sm">Safe & Secure</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    All teachers are verified. Parental consent required for student safety.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Stay Updated
            </h4>

            <p className="text-sm text-muted-foreground">
              Get exclusive tips, study resources, and platform updates delivered to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
              />
              <Button
                type="submit"
                className="w-full relative overflow-hidden group"
                variant="outline"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <div className="w-5 h-5">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm animate-pulse" />
                    <Mail className="w-3 h-3 text-primary/80" />
                  </div>
                  <span className="relative z-10">Subscribe Now</span>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-primary/80 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
              </Button>
            </form>

            <p className="text-xs text-muted-foreground">
              Join 5,000+ parents and students getting weekly learning tips and updates.
            </p>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 pt-8 border-t space-y-6">
          {/* Social Links */}
          <div className="flex justify-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`w-10 h-10 rounded-full ${social.color} flex items-center justify-center text-white shadow-lg transition-all duration-200`}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 HamroGuru. All rights reserved.</p>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href="#privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#cookies" className="hover:text-primary transition-colors">Cookie Settings</a>
            <a href="#safety" className="hover:text-primary transition-colors">Safety Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
