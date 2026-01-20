"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, GraduationCap, DollarSign, Calendar, Edit2, Save, Trash2, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { auth, db, doc, getDoc, updateDoc, deleteDoc, deleteUser, updatePassword } from "@/lib/firebase";

export default function ProfileDashboard() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            const user = auth.currentUser;
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                // Fetch Teacher Profile
                const teacherRef = doc(db, "teacherProfiles", user.uid);
                const teacherSnap = await getDoc(teacherRef);

                // Fetch User Data (for name)
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (teacherSnap.exists()) {
                    setProfile(teacherSnap.data());
                } else {
                    toast.error("Teacher details not found");
                }

                if (userSnap.exists()) {
                    setUserData(userSnap.data());
                }
            } catch (error: any) {
                toast.error("Failed to fetch profile: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchProfile();
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleUpdate = async () => {
        const user = auth.currentUser;
        if (!user || !profile || !userData) return;

        setSaving(true);
        try {
            // 1. Update Teacher Profile
            const teacherRef = doc(db, "teacherProfiles", user.uid);
            await updateDoc(teacherRef, {
                ...profile,
                updatedAt: new Date().toISOString(),
            });

            // 2. Update User Data (Name)
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                name: userData.name,
                updatedAt: new Date().toISOString(),
            });

            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (error: any) {
            toast.error("Update failed: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        const user = auth.currentUser;
        if (!user || !newPassword) return;

        try {
            await updatePassword(user, newPassword);
            toast.success("Password updated successfully!");
            setNewPassword("");
        } catch (error: any) {
            toast.error("Password update failed: " + error.message);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

        const user = auth.currentUser;
        if (!user) return;

        try {
            // 1. Delete from Firestore
            await deleteDoc(doc(db, "teacherProfiles", user.uid));
            await deleteDoc(doc(db, "users", user.uid));

            // 2. Delete from Auth
            await deleteUser(user);

            toast.success("Account deleted successfully");
            window.location.href = "/";
        } catch (error: any) {
            toast.error("Deletion failed: " + error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center p-10">
                <h2 className="text-2xl font-bold">No Teacher Profile Found</h2>
                <p className="text-muted-foreground mt-2">Create a profile to start teaching.</p>
                <Button className="mt-4 rounded-2xl" onClick={() => window.location.href = "/register-teacher"}>
                    Register as Teacher
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
                    <p className="text-muted-foreground">Manage your profile, visibility, and account settings.</p>
                </div>
                {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="rounded-2xl gap-2">
                        <Edit2 className="h-4 w-4" /> Edit Profile
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-2xl">
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate} disabled={saving} className="rounded-2xl gap-2">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Changes
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="rounded-3xl border-none shadow-sm bg-muted/30">
                        <CardHeader>
                            <CardTitle className="text-lg">Professional Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input
                                        value={userData?.name || ""}
                                        disabled={!isEditing}
                                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input
                                        value={profile.phone}
                                        disabled={!isEditing}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>City</Label>
                                    <Input
                                        value={profile.city}
                                        disabled={!isEditing}
                                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>District</Label>
                                    <Input
                                        value={profile.district}
                                        disabled={!isEditing}
                                        onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Bio / Additional Info</Label>
                                <Textarea
                                    value={profile.additionalInfo}
                                    rows={4}
                                    disabled={!isEditing}
                                    onChange={(e) => setProfile({ ...profile, additionalInfo: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Hourly Rate (NPR)</Label>
                                    <Input
                                        type="number"
                                        value={profile.rateAmount}
                                        disabled={!isEditing}
                                        onChange={(e) => setProfile({ ...profile, rateAmount: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Teaching Mode</Label>
                                    <Select
                                        value={profile.teachingMode}
                                        disabled={!isEditing}
                                        onValueChange={(v) => setProfile({ ...profile, teachingMode: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="online">Online</SelectItem>
                                            <SelectItem value="home">Home Tuition</SelectItem>
                                            <SelectItem value="both">Both</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Account Settings */}
                <div className="space-y-6">
                    <Card className="rounded-3xl border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" /> Security
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Update Password</Label>
                                <Input
                                    type="password"
                                    placeholder="New password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <Button
                                onClick={handleChangePassword}
                                disabled={!newPassword || newPassword.length < 6}
                                className="w-full rounded-2xl"
                            >
                                Change Password
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-none shadow-sm bg-red-50 dark:bg-red-900/10">
                        <CardHeader>
                            <CardTitle className="text-lg text-red-600 flex items-center gap-2">
                                <Trash2 className="h-5 w-5" /> Danger Zone
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-red-600/80 mb-4">
                                Once you delete your account, there is no going back. All your profile data, ratings, and visibility will be removed.
                            </p>
                            <Button
                                variant="destructive"
                                className="w-full rounded-2xl"
                                onClick={handleDeleteAccount}
                            >
                                Delete Account
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
