"use client";

import { useState, useEffect } from "react";
import HamroGuruLanding from "@/components/ui/hamroguru-landing";
import FindTeacherForm from "@/components/ui/find-teacher-form";
import TeacherRegistrationForm from "@/components/ui/teacher-registration-form";
import StudentRegistrationForm from "@/components/ui/student-registration-form";
import { AuthUI } from "@/components/ui/auth-fuse";
import { Navbar } from "@/components/ui/navbar";
import ProfileDashboard from "@/components/ui/profile-dashboard";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";


export default function Home() {
  const [currentView, setCurrentView] = useState<string>("landing");

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check for user session on mount using Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({
            ...firebaseUser,
            ...userDoc.data(),
            id: firebaseUser.uid,
          });
        } else {
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (userData: any) => {
    // AuthUI now handles the actual Firebase login, so onAuthStateChanged will trigger
    setCurrentView("landing");
  };


  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };


  const renderView = () => {
    switch (currentView) {
      case "landing":
        return <HamroGuruLanding user={user} onViewChange={setCurrentView} />;
      case "find-teacher":
        return <FindTeacherForm onViewChange={setCurrentView} />;
      case "become-teacher":
      case "sign-up":
        return <TeacherRegistrationForm />;
      case "student-registration":
        return <StudentRegistrationForm onViewChange={setCurrentView} />;
      case "profile-dashboard":
        return <ProfileDashboard />;
      case "sign-in":
        return <AuthUI onLoginSuccess={handleLoginSuccess} />;
      default:
        return <HamroGuruLanding user={user} onViewChange={setCurrentView} />;
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
