"use client";

import * as React from "react";
import { useState, useId, useEffect } from "react";
import { Slot } from "@radix-ui/react-slot";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff, GraduationCap, Users } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";


function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TypewriterProps {
  text: string | string[];
  speed?: number;
  cursor?: string;
  loop?: boolean;
  deleteSpeed?: number;
  delay?: number;
  className?: string;
}

export function Typewriter({
  text,
  speed = 100,
  cursor = "|",
  loop = false,
  deleteSpeed = 50,
  delay = 1500,
  className,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textArrayIndex, setTextArrayIndex] = useState(0);

  const textArray = Array.isArray(text) ? text : [text];
  const currentText = textArray[textArrayIndex] || "";

  useEffect(() => {
    if (!currentText) return;

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentIndex < currentText.length) {
            setDisplayText((prev) => prev + currentText[currentIndex]);
            setCurrentIndex((prev) => prev + 1);
          } else if (loop) {
            setTimeout(() => setIsDeleting(true), delay);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText((prev) => prev.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentIndex(0);
            setTextArrayIndex((prev) => (prev + 1) % textArray.length);
          }
        }
      },
      isDeleting ? deleteSpeed : speed,
    );

    return () => clearTimeout(timeout);
  }, [
    currentIndex,
    isDeleting,
    currentText,
    loop,
    speed,
    deleteSpeed,
    delay,
    displayText,
    text,
  ]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">{cursor}</span>
    </span>
  );
}

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input dark:border-input/50 bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary-foreground/60 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-6",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
const AuthButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
AuthButton.displayName = "Button";

const AuthInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-input dark:border-input/50 bg-background px-3 py-3 text-sm text-foreground shadow-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70 focus-visible:bg-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
AuthInput.displayName = "Input";

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}
const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, ...props }, ref) => {
    const id = useId();
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    return (
      <div className="grid w-full items-center gap-2">
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="relative">
          <AuthInput id={id} type={showPassword ? "text" : "password"} className={cn("pe-10", className)} ref={ref} {...props} />
          <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 end-0 flex h-full w-10 items-center justify-center text-muted-foreground/80 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? (<EyeOff className="size-4" aria-hidden="true" />) : (<Eye className="size-4" aria-hidden="true" />)}
          </button>
        </div>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

// Role Selection Component
type UserRole = "student" | "teacher" | null;

interface RoleSelectorProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const RoleSelector = ({ selectedRole, onRoleChange }: RoleSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => onRoleChange("student")}
        className={cn(
          "flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all duration-300",
          selectedRole === "student"
            ? "border-primary bg-primary/10 shadow-lg"
            : "border-border hover:border-primary/50 hover:bg-accent"
        )}
      >
        <GraduationCap className={cn("h-8 w-8", selectedRole === "student" ? "text-primary" : "text-muted-foreground")} />
        <div className="text-center">
          <p className="font-semibold text-sm">Student</p>
          <p className="text-xs text-muted-foreground">Find a tutor</p>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onRoleChange("teacher")}
        className={cn(
          "flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all duration-300",
          selectedRole === "teacher"
            ? "border-primary bg-primary/10 shadow-lg"
            : "border-border hover:border-primary/50 hover:bg-accent"
        )}
      >
        <Users className={cn("h-8 w-8", selectedRole === "teacher" ? "text-primary" : "text-muted-foreground")} />
        <div className="text-center">
          <p className="font-semibold text-sm">Teacher</p>
          <p className="text-xs text-muted-foreground">Teach students</p>
        </div>
      </button>
    </div>
  );
};

function SignInForm({ role, onSwitchToSignUp, onSuccess }: { role: UserRole; onSwitchToSignUp: () => void; onSuccess?: (user: any) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  // Load saved credentials (email always, password only if saved)
  React.useEffect(() => {
    try {
      const savedEmail = localStorage.getItem("hg_last_email");
      const savePasswordFlag = localStorage.getItem("hg_save_password");
      const savedPassword = localStorage.getItem("hg_saved_password");
      if (savedEmail) setEmail(savedEmail);
      if (savePasswordFlag && savedPassword) {
        setPassword(savedPassword);
        setRemember(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Use Firebase Client SDK for sign in
      const userCredential = await signInWithEmailAndPassword(auth, email as string, password as string);

      // Save last email and optionally password
      try {
        localStorage.setItem("hg_last_email", email);
        if (remember) {
          localStorage.setItem("hg_saved_password", password);
          localStorage.setItem("hg_save_password", "1");
        } else {
          localStorage.removeItem("hg_saved_password");
          localStorage.removeItem("hg_save_password");
        }
      } catch (e) {}

      toast.success("Login successful!");
      if (onSuccess) onSuccess(userCredential.user);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} autoComplete="on" className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">
          Sign in as {role === "student" ? "Student" : "Teacher"}
        </h1>
        <p className="text-balance text-sm text-muted-foreground">
          {role === "student"
            ? "Find your perfect tutor and start learning"
            : "Connect with students and share your knowledge"}
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <AuthInput id="email" name="email" type="email" placeholder="m@example.com" required autoComplete="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
        </div>
        <PasswordInput name="password" label="Password" required autoComplete="current-password" placeholder="Password" value={password} onChange={(e: any) => setPassword(e.target.value)} />
        <div className="text-right">
          <button type="button" className="text-sm text-primary hover:underline">
            Forgot password?
          </button>
        </div>
        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <span className="text-sm">Remember me</span>
          </label>
        </div>
        <AuthButton type="submit" className="mt-2" disabled={isSubmitting}>
          {isSubmitting ? "Signing In..." : `Sign In as ${role === "student" ? "Student" : "Teacher"}`}
        </AuthButton>
      </div>
      <div className="text-center text-sm">
        New to HamroGuru?{" "}
        <Button variant="link" className="pl-1 text-foreground p-0 h-auto" onClick={onSwitchToSignUp}>
          Create an account
        </Button>
      </div>
    </form>
  );
}

function SignUpForm({ role, onSwitchToSignIn, onSuccess }: { role: UserRole; onSwitchToSignIn: () => void; onSuccess?: (user: any) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const age = formData.get("age");
    const address = formData.get("address");
    const preferredSubject = formData.get("preferredSubject");

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      // Use Firebase Client SDK for sign up
      const userCredential = await createUserWithEmailAndPassword(auth, email as string, password as string);

      // Update display name
      await updateProfile(userCredential.user, {
        displayName: name as string
      });

      // Call the registration API to sync data to Firestore and set custom claims
      // We still use the API route for server-side operations like Firestore sync and claims
      const response = await fetch(role === "student" ? "/api/auth/register" : "/api/auth/register-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userCredential.user.uid, // Pass the UID
          name,
          email,
          role,
          age: age ? parseInt(age as string) : undefined,
          address,
          preferredSubject,
          // Pass all other teacher fields if role is teacher
          ...(role === "teacher" ? Object.fromEntries(formData) : {})
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || data.message || "Registration sync failed");
      }
      toast.success("Account created successfully!");

      // remember email for next time
      try {
        localStorage.setItem("hg_last_email", email as string);
      } catch (e) {}
      if (onSuccess) onSuccess(userCredential.user);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} autoComplete="on" className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">
          Create {role === "student" ? "Student" : "Teacher"} Account
        </h1>
        <p className="text-balance text-sm text-muted-foreground">
          {role === "student"
            ? "Join thousands of students learning with expert tutors"
            : "Start teaching and earn while sharing knowledge"}
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-1">
          <Label htmlFor="name">Full Name</Label>
          <AuthInput id="name" name="name" type="text" placeholder="John Doe" required autoComplete="name" />
        </div>

        {role === "student" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label htmlFor="age">Age</Label>
              <AuthInput id="age" name="age" type="number" placeholder="15" required />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="preferredSubject">Preferred Subject</Label>
              <AuthInput id="preferredSubject" name="preferredSubject" type="text" placeholder="Math" required />
            </div>
          </div>
        )}

        {role === "student" && (
          <div className="grid gap-1">
            <Label htmlFor="address">Address</Label>
            <AuthInput id="address" name="address" type="text" placeholder="Kathmandu, Nepal" required />
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <AuthInput id="email" name="email" type="email" placeholder="m@example.com" required autoComplete="email" />
        </div>
        <PasswordInput name="password" label="Password" required autoComplete="new-password" placeholder="Password" />
        <PasswordInput name="confirmPassword" label="Confirm Password" required autoComplete="new-password" placeholder="Confirm Password" />
        <AuthButton type="submit" className="mt-2" disabled={isSubmitting}>
          {isSubmitting ? "Creating Account..." : `Create ${role === "student" ? "Student" : "Teacher"} Account`}
        </AuthButton>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Button variant="link" className="pl-1 text-foreground p-0 h-auto" onClick={onSwitchToSignIn}>
          Sign in
        </Button>
      </div>
    </form>
  );
}

interface AuthContentProps {
  image?: {
    src: string;
    alt: string;
  };
  quote?: {
    text: string;
    author: string;
  }
}

interface AuthUIProps {
  signInContent?: AuthContentProps;
  signUpContent?: AuthContentProps;
  onLoginSuccess?: (user: any) => void;
}

const defaultSignInContent = {
  image: {
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    alt: "Students learning together"
  },
  quote: {
    text: "Welcome Back! Your learning journey continues.",
    author: "HamroGuru"
  }
};

const defaultSignUpContent = {
  image: {
    src: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80",
    alt: "Teacher helping student"
  },
  quote: {
    text: "Start your journey today. Success awaits!",
    author: "HamroGuru"
  }
};

export function AuthUI({ signInContent = {}, signUpContent = {}, onLoginSuccess }: AuthUIProps) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>(null);

  const finalSignInContent = {
    image: { ...defaultSignInContent.image, ...signInContent.image },
    quote: { ...defaultSignInContent.quote, ...signInContent.quote },
  };
  const finalSignUpContent = {
    image: { ...defaultSignUpContent.image, ...signUpContent.image },
    quote: { ...defaultSignUpContent.quote, ...signUpContent.quote },
  };

  const currentContent = isSignIn ? finalSignInContent : finalSignUpContent;

  return (
    <div className="w-full min-h-screen md:grid md:grid-cols-2">
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
      `}</style>

      {/* Left side - Auth Form */}
      <div className="flex h-screen items-center justify-center p-6 md:h-auto md:p-0 md:py-12 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Logo/Brand */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-primary">HamroGuru</h1>
            <p className="text-sm text-muted-foreground">Connect. Learn. Grow.</p>
          </div>

          {/* Role Selector */}
          {!userRole && (
            <div className="space-y-4 p-6 border rounded-xl bg-card">
              <div className="text-center space-y-2">
                <h2 className="text-lg font-semibold">Choose your role</h2>
                <p className="text-sm text-muted-foreground">
                  Select how you want to use HamroGuru
                </p>
              </div>
              <RoleSelector selectedRole={userRole} onRoleChange={setUserRole} />
            </div>
          )}

          {/* Auth Form - Only show when role is selected */}
          {userRole && (
            <div className="space-y-6">
              {/* Back to role selection */}
              <Button
                variant="ghost"
                onClick={() => setUserRole(null)}
                className="text-sm"
              >
                ← Change role
              </Button>

              {/* Sign In / Sign Up Toggle */}
              {isSignIn ? (
                <SignInForm role={userRole} onSwitchToSignUp={() => setIsSignIn(false)} onSuccess={onLoginSuccess} />
              ) : (
                <SignUpForm role={userRole} onSwitchToSignIn={() => setIsSignIn(true)} onSuccess={onLoginSuccess} />
              )}

            </div>
          )}
        </div>
      </div>

      {/* Right side - Image & Quote */}
      <div
        className="hidden md:block relative bg-cover bg-center transition-all duration-500 ease-in-out"
        style={{ backgroundImage: `url(${currentContent.image.src})` }}
        key={currentContent.image.src}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
        <div className="absolute inset-x-0 bottom-0 h-[100px] bg-gradient-to-t from-background to-transparent" />

        <div className="relative z-10 flex h-full flex-col items-center justify-end p-2 pb-6">
          <blockquote className="space-y-2 text-center text-white">
            <p className="text-lg font-medium">
              <Typewriter
                key={currentContent.quote.text}
                text={currentContent.quote.text}
                speed={60}
              />
            </p>
            <cite className="block text-sm font-light text-white/80 not-italic">
              — {currentContent.quote.author}
            </cite>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
