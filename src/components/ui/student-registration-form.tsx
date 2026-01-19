"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Loader2, Users, User, Shield, Phone, Mail } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";


const steps = [
  { id: "account", title: "Account Info", icon: User },
  { id: "student", title: "Student Details", icon: Users },
  { id: "parent", title: "Parent Info", icon: Shield },
];

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: string;
  gender: string;
  school: string;
  grade: string;
  address: string;
  district: string;
  city: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  relationship: string;
  consentTerms: boolean;
  consentData: boolean;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const contentVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
};

export default function StudentRegistrationForm({ onViewChange }: { onViewChange?: (view: string) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    address: "",
    preferredSubject: "",
    phone: "",
    grade: "",
  });

  const [rememberCredentials, setRememberCredentials] = useState(false);
  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      // 2. Update display name
      await updateProfile(userCredential.user, {
        displayName: formData.fullName
      });

      // 3. Sync profile data to Firestore via our registration API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userCredential.user.uid, // Pass the Firebase UID
          name: formData.fullName,
          email: formData.email,
          role: "student",
          age: parseInt(formData.age),
          address: formData.address,
          preferredSubject: formData.preferredSubject,
          phone: formData.phone,
          grade: formData.grade,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile sync failed");
      }


      toast.success("Registration successful!");

      // Save email (and optionally password) locally for next-time login
      try {
        localStorage.setItem("hg_last_email", formData.email);
        if (rememberCredentials) {
          localStorage.setItem("hg_saved_password", formData.password);
          localStorage.setItem("hg_save_password", "1");
        } else {
          localStorage.removeItem("hg_saved_password");
          localStorage.removeItem("hg_save_password");
        }
      } catch (e) {
        // ignore storage errors
      }

      if (onViewChange) {
        onViewChange("landing");
      } else {
        window.location.href = "/";
      }

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.fullName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.age !== "" &&
      formData.address.trim() !== "" &&
      formData.preferredSubject !== "" &&
      formData.password.length >= 6 &&
      formData.password === formData.confirmPassword
    );
  };

  return (
    <div className="min-h-screen bg-background py-8">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo />
            </div>
            <Button
              variant="outline"
              onClick={() => onViewChange ? onViewChange('landing') : window.location.href = '/'}
              className="gap-2"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-12">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold tracking-tight">Student Registration</h1>
            <p className="text-muted-foreground mt-2">Join HamroGuru to find your perfect mentor</p>
          </motion.div>

          <Card className="border shadow-lg rounded-3xl overflow-hidden">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
                <CardDescription>Fill in your information to get started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Your age"
                      value={formData.age}
                      onChange={(e) => updateFormData("age", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade *</Label>
                    <Input
                      id="grade"
                      placeholder="e.g. Grade 11"
                      value={formData.grade}
                      onChange={(e) => updateFormData("grade", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Preferred Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="e.g. Mathematics"
                      value={formData.preferredSubject}
                      onChange={(e) => updateFormData("preferredSubject", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    placeholder="City, District"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="e.g. +977 98XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="min 6 chars"
                      value={formData.password}
                      onChange={(e) => updateFormData("password", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-6">
                <div className="px-4 mb-2">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={rememberCredentials} onChange={(e) => setRememberCredentials(e.target.checked)} />
                    <span className="text-sm">Remember credentials (save locally)</span>
                  </label>
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-2xl h-12 text-lg"
                  disabled={!isFormValid() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Student Account"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
