"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Loader2, MapPin, GraduationCap, DollarSign, Calendar, Shield } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { auth, createUserWithEmailAndPassword, updateProfile } from "@/lib/firebase";


const steps = [
  { id: "personal", title: "Personal Info", icon: GraduationCap },
  { id: "professional", title: "Professional Info", icon: GraduationCap },
  { id: "teaching", title: "Teaching Details", icon: GraduationCap },
  { id: "pricing", title: "Pricing & Schedule", icon: DollarSign },
  { id: "consent", title: "Verification", icon: Shield },
];

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  age: string;
  gender: string;
  address: string;
  district: string;
  city: string;
  highestQualification: string;
  subjects: string[];
  teachingMode: string;
  experience: string;
  rateType: string;
  rateAmount: string;
  availability: string;
  whatsappNumber: string;
  whatsappConsent: boolean;
  termsConsent: boolean;
  additionalInfo: string;
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

const subjectsList = [
  "Mathematics",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Nepali",
  "Computer Science",
  "Economics",
  "Accountancy",
  "Social Studies",
  "Other",
];

export default function TeacherRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    age: "",
    gender: "",
    address: "",
    district: "",
    city: "",
    highestQualification: "",
    subjects: [],
    teachingMode: "",
    experience: "",
    rateType: "",
    rateAmount: "",
    availability: "",
    whatsappNumber: "",
    whatsappConsent: false,
    termsConsent: false,
    additionalInfo: "",
  });

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSubject = (subject: string) => {
    setFormData((prev) => {
      const subjects = [...prev.subjects];
      if (subjects.includes(subject)) {
        return { ...prev, subjects: subjects.filter((s) => s !== subject) };
      } else {
        return { ...prev, subjects: [...subjects, subject] };
      }
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    console.log("🚀 Starting teacher registration...");
    console.log("📋 Form data:", {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subjects: formData.subjects,
      hasPassword: !!formData.password
    });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      console.error("❌ Invalid email:", formData.email);
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("📧 Creating Firebase Auth user for:", formData.email);
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("✅ Firebase Auth user created:", userCredential.user.uid);

      // 2. Update display name
      await updateProfile(userCredential.user, {
        displayName: formData.name
      });
      console.log("✅ Display name updated");

      // 3. Sync profile data to Firestore via our registration API
      console.log("📤 Sending profile data to API...");
      const response = await fetch("/api/auth/register-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: userCredential.user.uid, // Pass the Firebase UID
          password: undefined, // Don't send password to Firestore
          confirmPassword: undefined,
        }),
      });

      const data = await response.json();
      console.log("📥 API Response:", data);

      if (!response.ok) {
        console.error("❌ API Error:", data);
        throw new Error(data.error || "Profile sync failed");
      }

      console.log("✅ Teacher registration successful!");
      toast.success("Teacher registration successful!");

      // Redirect to profile or home
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);

    } catch (error: any) {
      console.error("❌ Registration error:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        stack: error.stack
      });


      // Handle email already in use - attempt login instead
      if (error.code === "auth/email-already-in-use") {
        console.log("📧 Email already registered, attempting login...");
        toast.info("Email already registered. Logging you in...");

        try {
          const { signInWithEmailAndPassword } = await import("firebase/auth");
          const loginCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
          console.log("✅ Login successful:", loginCredential.user.uid);
          toast.success("Welcome back!");

          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
          setIsSubmitting(false);
          return;
        } catch (loginError: any) {
          console.error("❌ Login failed:", loginError);
          if (loginError.code === "auth/wrong-password") {
            toast.error("This email is already registered with a different password. Please use the correct password.");
          } else {
            toast.error("Login failed: " + loginError.message);
          }
          setIsSubmitting(false);
          return;
        }
      }

      // Provide user-friendly error messages for other errors
      let errorMessage = "Registration failed. Please try again.";
      if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address. Please check and try again.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use at least 6 characters.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };


  const isStepValid = () => {
    let valid = false;
    switch (currentStep) {
      case 0:
        valid = formData.name.trim() !== "" &&
          formData.email.trim() !== "" &&
          formData.password.length >= 6 &&
          formData.password === formData.confirmPassword &&
          formData.phone.trim() !== "" &&
          formData.age !== "" &&
          formData.gender !== "" &&
          formData.address.trim() !== "";
        break;
      case 1:
        valid = formData.highestQualification !== "" &&
          formData.experience !== "" &&
          formData.subjects.length > 0;
        break;
      case 2:
        valid = formData.teachingMode !== "";
        break;
      case 3:
        valid = formData.rateType !== "" &&
          formData.rateAmount !== "" &&
          formData.availability !== "";
        break;
      case 4:
        valid = formData.termsConsent;
        console.log("📋 Step 4 validation - Terms consent:", formData.termsConsent, "Valid:", valid);
        break;
      default:
        valid = true;
    }

    if (!valid && currentStep === 4) {
      console.log("⚠️ Registration button disabled - Please accept terms and conditions");
    }

    return valid;
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      {/* Progress indicator */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between mb-4">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full cursor-pointer transition-colors duration-300 flex items-center justify-center",
                    index < currentStep
                      ? "bg-primary text-primary-foreground"
                      : index === currentStep
                        ? "bg-primary ring-4 ring-primary/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                  )}
                  onClick={() => {
                    if (index <= currentStep) setCurrentStep(index);
                  }}
                >
                  {index < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </div>
                <span className={cn(
                  "text-xs mt-2 text-center hidden sm:block",
                  index === currentStep ? "text-primary font-medium" : "text-muted-foreground"
                )}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
        <div className="w-full bg-muted h-2 rounded-full overflow-hidden mt-2">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Form card */}
      <Card className="border shadow-md rounded-3xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}
          >
            {/* Step 1: Personal Info */}
            {currentStep === 0 && (
              <div className="p-6 space-y-4">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold">Personal Information</h3>
                  <p className="text-muted-foreground">Let's get to know you better</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Min 6 characters"
                        value={formData.password}
                        onChange={(e) => updateFormData("password", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Repeat password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="+977 98XXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="25"
                        value={formData.age}
                        onChange={(e) => updateFormData("age", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => updateFormData("gender", value)}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      placeholder="Street address"
                      value={formData.address}
                      onChange={(e) => updateFormData("address", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Professional Info */}
            {currentStep === 1 && (
              <div className="p-6 space-y-4">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold">Professional Background</h3>
                  <p className="text-muted-foreground">Tell us about your qualifications</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="qualification">Highest Qualification *</Label>
                    <Select
                      value={formData.highestQualification}
                      onValueChange={(value) => updateFormData("highestQualification", value)}
                    >
                      <SelectTrigger id="qualification">
                        <SelectValue placeholder="Select qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phd">PhD</SelectItem>
                        <SelectItem value="masters">Master's Degree</SelectItem>
                        <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                        <SelectItem value="plus2">+2 / Higher Secondary</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience *</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => updateFormData("experience", value)}
                    >
                      <SelectTrigger id="experience">
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label>Subjects You Teach *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {subjectsList.map((subject) => (
                        <div
                          key={subject}
                          className={cn(
                            "flex items-center space-x-2 rounded-md border p-3 cursor-pointer",
                            formData.subjects.includes(subject) ? "border-primary bg-primary/10" : "border-border"
                          )}
                          onClick={() => toggleSubject(subject)}
                        >
                          <Checkbox
                            id={`subject-${subject}`}
                            checked={formData.subjects.includes(subject)}
                            onCheckedChange={() => toggleSubject(subject)}
                          />
                          <Label htmlFor={`subject-${subject}`} className="cursor-pointer text-sm font-normal">
                            {subject}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Teaching Details */}
            {currentStep === 2 && (
              <div className="p-6 space-y-4">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold">Teaching Preferences</h3>
                  <p className="text-muted-foreground">How would you like to teach?</p>
                </div>
                <div className="space-y-4">
                  <Label>Teaching Mode *</Label>
                  <RadioGroup
                    value={formData.teachingMode}
                    onValueChange={(value) => updateFormData("teachingMode", value)}
                    className="space-y-2"
                  >
                    {[
                      { value: "online", label: "Online Teaching" },
                      { value: "home", label: "Home Tuition" },
                      { value: "both", label: "Both Modes" },
                    ].map((mode) => (
                      <div
                        key={mode.value}
                        className={cn(
                          "flex items-center space-x-3 rounded-md border p-4 cursor-pointer",
                          formData.teachingMode === mode.value ? "border-primary bg-primary/10" : "border-border"
                        )}
                        onClick={() => updateFormData("teachingMode", mode.value)}
                      >
                        <RadioGroupItem value={mode.value} id={`mode-${mode.value}`} />
                        <Label htmlFor={`mode-${mode.value}`} className="cursor-pointer font-medium">
                          {mode.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 4: Pricing & Schedule */}
            {currentStep === 3 && (
              <div className="p-6 space-y-4">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold">Pricing & Availability</h3>
                  <p className="text-muted-foreground">Set your rates and schedule</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rateType">Rate Type *</Label>
                    <Select
                      value={formData.rateType}
                      onValueChange={(value) => updateFormData("rateType", value)}
                    >
                      <SelectTrigger id="rateType">
                        <SelectValue placeholder="Select rate type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly Rate</SelectItem>
                        <SelectItem value="monthly">Monthly Rate</SelectItem>
                        <SelectItem value="per-subject">Per Subject</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rateAmount">Rate Amount (NPR) *</Label>
                    <Input
                      id="rateAmount"
                      type="number"
                      placeholder="500"
                      value={formData.rateAmount}
                      onChange={(e) => updateFormData("rateAmount", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability *</Label>
                    <Select
                      value={formData.availability}
                      onValueChange={(value) => updateFormData("availability", value)}
                    >
                      <SelectTrigger id="availability">
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="afternoon">Afternoon</SelectItem>
                        <SelectItem value="evening">Evening</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Verification */}
            {currentStep === 4 && (
              <div className="p-6 space-y-4">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold">Final Verification</h3>
                  <p className="text-muted-foreground">Almost there!</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsappNumber">WhatsApp Number (Optional)</Label>
                    <Input
                      id="whatsappNumber"
                      placeholder="+977 98XXXXXXXX"
                      value={formData.whatsappNumber}
                      onChange={(e) => updateFormData("whatsappNumber", e.target.value)}
                    />
                  </div>
                  <div className="flex items-start space-x-3 rounded-md border p-4 bg-muted/30">
                    <Checkbox
                      id="whatsapp-consent"
                      checked={formData.whatsappConsent}
                      onCheckedChange={(checked) => updateFormData("whatsappConsent", checked as boolean)}
                    />
                    <Label htmlFor="whatsapp-consent" className="cursor-pointer">
                      Allow students to contact me via WhatsApp
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3 rounded-md border p-4 bg-muted/30">
                    <Checkbox
                      id="terms-consent"
                      checked={formData.termsConsent}
                      onCheckedChange={(checked) => updateFormData("termsConsent", checked as boolean)}
                    />
                    <Label htmlFor="terms-consent" className="cursor-pointer">
                      I agree to the terms and conditions *
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Additional Information</Label>
                    <Textarea
                      id="additionalInfo"
                      placeholder="Teaching style, certifications..."
                      value={formData.additionalInfo}
                      onChange={(e) => updateFormData("additionalInfo", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <CardFooter className="flex justify-between p-6 bg-muted/20">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="rounded-2xl"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Button
            type="button"
            onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
            disabled={!isStepValid() || isSubmitting}
            className="rounded-2xl"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              currentStep === steps.length - 1 ? "Complete Registration" : "Next"
            )}
            {!(isSubmitting || currentStep === steps.length - 1) && <ChevronRight className="h-4 w-4 ml-1" />}
            {currentStep === steps.length - 1 && !isSubmitting && <Check className="h-4 w-4 ml-1" />}
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
      </div>
    </div>
  );
}
