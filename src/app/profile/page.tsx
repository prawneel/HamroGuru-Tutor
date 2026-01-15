"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import FindTeacherForm from "@/components/ui/find-teacher-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    User,
    Mail,
    MapPin,
    GraduationCap,
    Edit,
    Save,
    X,
    Phone,
    BookOpen,
    DollarSign,
    Clock,
    CheckCircle2,
    AlertCircle,
    Users,
    Shield
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [teacherProfile, setTeacherProfile] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("hamroguru_user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            if (parsedUser.role === 'teacher') {
                fetchTeacherProfile(parsedUser.id);
            } else {
                setIsLoading(false);
            }
        } else {
            window.location.href = "/";
        }
    }, []);

    const fetchTeacherProfile = async (userId: string) => {
        try {
            const response = await fetch(`/api/teacher/profile?userId=${userId}`);
            const data = await response.json();
            if (response.ok) {
                setTeacherProfile(data.profile);
                setFormData(data.profile);
            } else {
                toast.error("Failed to load teacher profile");
            }
        } catch (error) {
            toast.error("An error occurred while fetching profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("hamroguru_user");
        window.location.href = "/";
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch("/api/teacher/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                setTeacherProfile(data.profile);
                setIsEditing(false);
                toast.success("Profile updated successfully!");
            } else {
                throw new Error(data.error || "Failed to update profile");
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground animate-pulse">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar currentView="profile" user={user} onLogout={handleLogout} />

            <div className="container mx-auto px-4 py-8">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
                        <p className="text-muted-foreground">Manage your professional presence and student inquiries.</p>
                    </div>
                    {!isEditing && user.role === 'teacher' && (
                        <Button onClick={() => setIsEditing(true)} className="gap-2">
                            <Edit className="w-4 h-4" />
                            Edit Profile
                        </Button>
                    )}
                </div>

                {/* Profile Card */}
                <Card className="mb-8 overflow-hidden border-none shadow-xl bg-gradient-to-br from-card to-muted/20">
                    <CardContent className="p-0">
                        <div className="h-32 bg-primary/10 relative">
                            <div className="absolute -bottom-12 left-8">
                                <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                        <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row justify-between items-end gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold">{user.name}</h2>
                                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                                        {user.role === 'teacher' ? 'Educator' : 'Student'}
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {user.email}</span>
                                    {teacherProfile && (
                                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {teacherProfile.city}, {teacherProfile.district}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-medium">Profile Status</p>
                                    <p className="text-xs text-green-500 font-bold flex items-center gap-1 justify-end">
                                        <CheckCircle2 className="w-3 h-3" /> Active
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Area */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Details & Stats */}
                    <div className="lg:col-span-2 space-y-6">
                        {isEditing ? (
                            <Card className="border-primary/20">
                                <CardHeader>
                                    <CardTitle>Professional Details</CardTitle>
                                    <CardDescription>Update your teaching expertise and contact information.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="pl-10" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="highestQualification">Highest Qualification</Label>
                                            <div className="relative">
                                                <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input id="highestQualification" name="highestQualification" value={formData.highestQualification} onChange={handleInputChange} className="pl-10" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subjects">Subjects (comma separated)</Label>
                                        <div className="relative">
                                            <BookOpen className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <Input id="subjects" name="subjects" value={formData.subjects} onChange={handleInputChange} className="pl-10" />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="rateAmount">Rate Amount (Rs)</Label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input id="rateAmount" name="rateAmount" value={formData.rateAmount} onChange={handleInputChange} className="pl-10" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="experience">Experience</Label>
                                            <Input id="experience" name="experience" value={formData.experience} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="availability">Availability</Label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input id="availability" name="availability" value={formData.availability} onChange={handleInputChange} className="pl-10" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="additionalInfo">Additional Information</Label>
                                        <Textarea
                                            id="additionalInfo"
                                            name="additionalInfo"
                                            value={formData.additionalInfo}
                                            onChange={handleInputChange}
                                            rows={4}
                                            placeholder="Tell potential students more about your teaching style..."
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end gap-3 border-t pt-6 bg-muted/50 rounded-b-xl">
                                    <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={isSaving}>
                                        <X className="w-4 h-4 mr-2" /> Cancel
                                    </Button>
                                    <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90">
                                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                        Save Changes
                                    </Button>
                                </CardFooter>
                            </Card>
                        ) : teacherProfile ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Professional Info</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-muted-foreground flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Qualification</span>
                                            <span className="font-semibold">{teacherProfile.highestQualification}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-muted-foreground flex items-center gap-2"><BookOpen className="w-4 h-4" /> Subjects</span>
                                            <span className="font-semibold text-right">{teacherProfile.subjects}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4" /> Experience</span>
                                            <span className="font-semibold">{teacherProfile.experience}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Teaching Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-muted-foreground flex items-center gap-2"><DollarSign className="w-4 h-4" /> Rate</span>
                                            <span className="font-semibold">Rs. {teacherProfile.rateAmount} / {teacherProfile.rateType}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4" /> Availability</span>
                                            <span className="font-semibold">{teacherProfile.availability}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4" /> Mode</span>
                                            <span className="font-semibold capitalize">{teacherProfile.teachingMode}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="md:col-span-2">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Biography & Extra Info</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm leading-relaxed text-muted-foreground italic">
                                            {teacherProfile.additionalInfo || "No additional information provided."}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center group transition-all hover:bg-primary/5">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <AlertCircle className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Profile Not Set Up</h3>
                                <p className="text-muted-foreground max-w-xs mb-6">Your professional profile is missing. Students won't be able to find you until you complete your profile.</p>
                                <Button onClick={() => window.location.href = '/become-teacher'}>Complete Profile Now</Button>
                            </Card>
                        )}

                        {/* Additional Dashboard Sections for Teachers */}
                        {user.role === 'teacher' && !isEditing && (
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card className="hover:shadow-md transition-shadow cursor-not-allowed opacity-75">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium">Student Views</CardTitle>
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">124</div>
                                        <p className="text-xs text-muted-foreground">+20% from last month</p>
                                    </CardContent>
                                </Card>
                                <Card className="hover:shadow-md transition-shadow cursor-not-allowed opacity-75">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium">Direct Inquiries</CardTitle>
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">8</div>
                                        <p className="text-xs text-muted-foreground">+2 new since yesterday</p>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Actions & Notifications */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <Button variant="outline" className="justify-start gap-2" onClick={() => window.location.href = '/'}>
                                    <BookOpen className="w-4 h-4" />
                                    View Marketplace
                                </Button>
                                <Button variant="outline" className="justify-start gap-2">
                                    <Shield className="w-4 h-4" />
                                    Account Security
                                </Button>
                                <div className="border-t my-2 pt-2">
                                    <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10 gap-2" onClick={handleLogout}>
                                        <X className="w-4 h-4" />
                                        Logout Session
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-primary/5 border-primary/10">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    Notifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-sm p-3 bg-background rounded-lg border border-primary/10">
                                    <p className="font-medium">Welcome to HamroGuru!</p>
                                    <p className="text-xs text-muted-foreground mt-1">Make sure your profile is up to date to get verified faster.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* For Students View (Inherited) */}
                {user.role === 'student' && (
                    <div className="mt-12 space-y-6">
                        <h2 className="text-2xl font-bold">Find New Tutors</h2>
                        <FindTeacherForm />
                    </div>
                )}
            </div>
        </div>
    );
}

function Loader2({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("animate-spin", className)}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}
