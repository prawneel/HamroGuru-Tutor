"use client";

import { useState, useEffect } from "react";
import HamroGuruLanding from "@/components/ui/hamroguru-landing";
import FindTeacherForm from "@/components/ui/find-teacher-form";
import TeacherRegistrationForm from "@/components/ui/teacher-registration-form";
import StudentRegistrationForm from "@/components/ui/student-registration-form";
import { AuthUI } from "@/components/ui/auth-fuse";
import { Navbar } from "@/components/ui/navbar";

export default function Home() {
  const [currentView, setCurrentView] = useState<string>("landing");

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check for user session on mount
    const storedUser = localStorage.getItem("hamroguru_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    localStorage.setItem("hamroguru_user", JSON.stringify(userData));
    setCurrentView("landing");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("hamroguru_user");
  };

  const renderView = () => {
    switch (currentView) {
      case "landing":
        return <HamroGuruLanding user={user} onViewChange={setCurrentView} />;
      case "find-teacher":
        return <FindTeacherForm onViewChange={setCurrentView} />;
      case "become-teacher":
        return <TeacherRegistrationForm />;
      case "student-registration":
        return <StudentRegistrationForm onViewChange={setCurrentView} />;
      case "sign-in":
      case "sign-up":
        return <AuthUI onLoginSuccess={handleLoginSuccess} />;
      default:
        return <HamroGuruLanding />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="min-h-[calc(100vh-4rem)]">
        {renderView()}
      </div>
    </div>
  );
}
