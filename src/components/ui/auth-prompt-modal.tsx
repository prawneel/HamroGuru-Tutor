"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSignUp: () => void;
    onSignIn: () => void;
    message?: string;
    title?: string;
}

export default function AuthPromptModal({
    isOpen,
    onClose,
    onSignUp,
    onSignIn,
    message = "Sign in as a student to view teacher profiles and contact information",
    title = "Authentication Required"
}: AuthPromptModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md"
                >
                    <Card className="rounded-3xl border-none shadow-2xl">
                        <CardHeader className="relative">
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 rounded-full p-2 hover:bg-muted transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <CardTitle className="text-2xl">{title}</CardTitle>
                            <CardDescription className="text-base mt-2">
                                {message}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 pb-6">
                            <Button
                                onClick={onSignUp}
                                className="w-full rounded-2xl gap-2 h-12 text-base"
                                size="lg"
                            >
                                <UserPlus className="h-5 w-5" />
                                Register as Student
                            </Button>
                            <Button
                                onClick={onSignIn}
                                variant="outline"
                                className="w-full rounded-2xl gap-2 h-12 text-base"
                                size="lg"
                            >
                                <LogIn className="h-5 w-5" />
                                Sign In
                            </Button>
                            <p className="text-xs text-center text-muted-foreground mt-4">
                                Already a teacher? Sign in to access your dashboard
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
