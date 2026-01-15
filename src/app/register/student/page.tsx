"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Loader2, CalendarDays, MapPin, BookOpen, Phone, Shield } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const steps = [
  { id: "account", title: "Account Info", icon: BookOpen },
  { id: "student", title: "Student Details", icon: CalendarDays },
  { id: "parent", title: "Parent Info", icon: Phone },
  { id: "consent", title: "Consent & Verification", icon: Shield },
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
  termsConsent: boolean;
  dataConsent: boolean;
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

export default function StudentRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    school: "",
    grade: "",
    address: "",
    district: "",
    city: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    relationship: "",
    termsConsent: false,
    dataConsent: false,
    additionalInfo: "",
  });

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Registration submitted successfully!");
      setIsSubmitting(false);
    }, 2000);
  };

  // Check if step is valid for next button
  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.fullName.trim() !== "" &&
               formData.email.trim() !== "" &&
               formData.password.trim() !== "" &&
               formData.confirmPassword.trim() !== "" &&
               formData.password === formData.confirmPassword;
      case 1:
        return formData.age !== "" &&
               formData.gender !== "" &&
               formData.school.trim() !== "" &&
               formData.grade !== "";
      case 2:
        return formData.parentName.trim() !== "" &&
               formData.parentPhone.trim() !== "" &&
               formData.relationship !== "";
      case 3:
        return formData.termsConsent && formData.dataConsent;
      default:
        return true;
    }
  };

  const grades = [
    "Grade 1-5",
    "Grade 6-8",
    "Grade 9-10",
    "Grade 11-12 (SEE)",
    "+2 (NEB)",
    "Bachelor",
    "Masters",
  ];

  const districts = [
    "Kathmandu",
    "Lalitpur",
    "Bhaktapur",
    "Pokhara",
    "Biratnagar",
    "Butwal",
    "Chitwan",
    "Other",
  ];

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
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
              <motion.div
                key={index}
                className="flex flex-col items-center flex-1"
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  className={cn(
                    "w-10 h-10 rounded-full cursor-pointer transition-colors duration-300 flex items-center justify-center",
                    index < currentStep
                      ? "bg-primary text-primary-foreground"
                      : index === currentStep
                        ? "bg-primary ring-4 ring-primary/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                  )}
                  onClick={() => {
                    if (index <= currentStep) {
                      setCurrentStep(index);
                    }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {index < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </motion.div>
                <motion.span
                  className={cn(
                    "text-xs mt-2 text-center hidden sm:block",
                    index === currentStep
                      ? "text-primary font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </motion.span>
              </motion.div>
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border shadow-md rounded-3xl overflow-hidden">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={contentVariants}
              >
                {/* Step 1: Account Info */}
                {currentStep === 0 && (
                  <>
                    <CardHeader>
                      <CardTitle>Create Account</CardTitle>
                      <CardDescription>
                        Let's start with your account information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(e) => updateFormData("fullName", e.target.value)}
                          className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                        />
                      </motion.div>

                      <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
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
                        <div className="space-y-2">
                          <Label htmlFor="age">Age *</Label>
                          <Input
                            id="age"
                            type="number"
                            placeholder="18"
                            value={formData.age}
                            onChange={(e) => updateFormData("age", e.target.value)}
                          />
                        </div>
                      </motion.div>

                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={(e) => updateFormData("password", e.target.value)}
                        />
                      </motion.div>

                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                        />
                        {formData.password !== formData.confirmPassword && formData.confirmPassword !== "" && (
                          <p className="text-sm text-destructive">Passwords do not match</p>
                        )}
                      </motion.div>
                    </CardContent>
                  </>
                )}

                {/* Step 2: Student Details */}
                {currentStep === 1 && (
                  <>
                    <CardHeader>
                      <CardTitle>Student Details</CardTitle>
                      <CardDescription>
                        Tell us about your education
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeInUp} className="space-y-2">
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
                      </motion.div>

                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="school">School/Institution *</Label>
                        <Input
                          id="school"
                          placeholder="Your school name"
                          value={formData.school}
                          onChange={(e) => updateFormData("school", e.target.value)}
                        />
                      </motion.div>

                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="grade">Grade/Level *</Label>
                        <Select
                          value={formData.grade}
                          onValueChange={(value) => updateFormData("grade", value)}
                        >
                          <SelectTrigger id="grade">
                            <SelectValue placeholder="Select your grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {grades.map((grade) => (
                              <SelectItem key={grade} value={grade}>
                                {grade}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="district">District *</Label>
                          <Select
                            value={formData.district}
                            onValueChange={(value) => updateFormData("district", value)}
                          >
                            <SelectTrigger id="district">
                              <SelectValue placeholder="Select district" />
                            </SelectTrigger>
                            <SelectContent>
                              {districts.map((district) => (
                                <SelectItem key={district} value={district}>
                                  {district}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            placeholder="City name"
                            value={formData.city}
                            onChange={(e) => updateFormData("city", e.target.value)}
                          />
                        </div>
                      </motion.div>

                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="address">Address *</Label>
                        <Input
                          id="address"
                          placeholder="Street address, ward number"
                          value={formData.address}
                          onChange={(e) => updateFormData("address", e.target.value)}
                        />
                      </motion.div>
                    </CardContent>
                  </>
                )}

                {/* Step 3: Parent/Guardian Info */}
                {currentStep === 2 && (
                  <>
                    <CardHeader>
                      <CardTitle>Parent/Guardian Information</CardTitle>
                      <CardDescription>
                        Parent or guardian details for safety
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                        <Input
                          id="parentName"
                          placeholder="Enter parent or guardian name"
                          value={formData.parentName}
                          onChange={(e) => updateFormData("parentName", e.target.value)}
                        />
                      </motion.div>

                      <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="parentPhone">Parent Phone Number *</Label>
                          <Input
                            id="parentPhone"
                            placeholder="+977 98XXXXXXXX"
                            value={formData.parentPhone}
                            onChange={(e) => updateFormData("parentPhone", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="parentEmail">Parent Email (Optional)</Label>
                          <Input
                            id="parentEmail"
                            type="email"
                            placeholder="parent@email.com"
                            value={formData.parentEmail}
                            onChange={(e) => updateFormData("parentEmail", e.target.value)}
                          />
                        </div>
                      </motion.div>

                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="relationship">Relationship *</Label>
                        <Select
                          value={formData.relationship}
                          onValueChange={(value) => updateFormData("relationship", value)}
                        >
                          <SelectTrigger id="relationship">
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="father">Father</SelectItem>
                            <SelectItem value="mother">Mother</SelectItem>
                            <SelectItem value="guardian">Guardian</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                    </CardContent>
                  </>
                )}

                {/* Step 4: Consent & Verification */}
                {currentStep === 3 && (
                  <>
                    <CardHeader>
                      <CardTitle>Consent & Verification</CardTitle>
                      <CardDescription>
                        Final steps to complete your registration
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeInUp} className="space-y-4">
                        <div className="flex items-start space-x-3 rounded-md border p-4 bg-muted/30">
                          <Checkbox
                            id="terms-consent"
                            checked={formData.termsConsent}
                            onCheckedChange={(checked) =>
                              updateFormData("termsConsent", checked as boolean)
                            }
                            className="mt-0.5"
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor="terms-consent"
                              className="cursor-pointer font-medium"
                            >
                              I agree to terms and conditions *
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              By checking this, you agree to HamroGuru's terms of service,
                              privacy policy, and data usage guidelines
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 rounded-md border p-4 bg-muted/30">
                          <Checkbox
                            id="data-consent"
                            checked={formData.dataConsent}
                            onCheckedChange={(checked) =>
                              updateFormData("dataConsent", checked as boolean)
                            }
                            className="mt-0.5"
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor="data-consent"
                              className="cursor-pointer font-medium"
                            >
                              I agree to data usage policy *
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              I consent to the collection and processing of my personal data
                              for the purpose of connecting with tutors on HamroGuru platform
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="additionalInfo">Additional Information</Label>
                        <Textarea
                          id="additionalInfo"
                          placeholder="Tell us about your learning goals, preferred subjects, any special requirements..."
                          value={formData.additionalInfo}
                          onChange={(e) => updateFormData("additionalInfo", e.target.value)}
                          className="min-h-[100px]"
                        />
                      </motion.div>
                    </CardContent>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <CardFooter className="flex justify-between pt-6 pb-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1 rounded-2xl"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
                  disabled={!isStepValid() || isSubmitting}
                  className={cn(
                    "flex items-center gap-1 rounded-2xl",
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      {currentStep === steps.length - 1 ? (
                        <>
                          Complete Registration <Check className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Next <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                    </>
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          </div>
        </Card>
      </motion.div>

      {/* Step indicator */}
      <motion.div
        className="mt-4 text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
      </motion.div>
    </div>
  );
}
