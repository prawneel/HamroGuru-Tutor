"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, onSnapshot } from "firebase/firestore";
import { toast } from "sonner";

export default function AdminPage() {
  const [email, setEmail] = useState("admin@pranil.com");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loggedIn) return;
    setLoading(true);
    const ref = collection(db, "teacherProfiles");
    const unsub = onSnapshot(ref, (snap) => {
      const out: any[] = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTeachers(out);
      setLoading(false);
    }, (err) => {
      console.error("admin snapshot error", err);
      toast.error("Failed to load teacher profiles");
      setLoading(false);
    });
    return () => unsub();
  }, [loggedIn]);

  const doLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side check - password default
    if (email === "admin@pranil.com" && (password === "pranil@admin123" || password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "pranil@admin123"))) {
      setLoggedIn(true);
      toast.success("Admin logged in");
    } else {
      toast.error("Invalid admin credentials");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete teacher ${id}? This action cannot be undone.`)) return;
    try {
      // Call server API to delete
      const res = await fetch(`/api/admin/delete-teacher`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, password: password || (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "pranil@admin123") }),
      });
      const json = await res.json();
      if (json.ok) {
        toast.success("Deleted");
      } else {
        toast.error("Delete failed: " + (json.error || "unknown"));
      }
    } catch (e: any) {
      console.error(e);
      toast.error("Delete failed: " + (e.message || e));
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={doLogin} className="w-full max-w-md p-6 bg-background rounded-lg border">
          <h2 className="text-xl font-bold mb-4">Admin Login</h2>
          <label className="block mb-2">Email</label>
          <input className="w-full mb-4 p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} />
          <label className="block mb-2">Password</label>
          <input type="password" className="w-full mb-4 p-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="w-full p-2 bg-primary text-white rounded">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin — Teacher Insights</h1>
        <div>
          <button onClick={() => { setLoggedIn(false); setPassword(""); }} className="px-3 py-2 bg-muted rounded">Logout</button>
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Total teachers: {teachers.length}</p>
      </div>

      <div className="mt-4 space-y-3">
        {loading ? <div>Loading...</div> : (
          teachers.map((t) => (
            <div key={t.id} className="p-3 border rounded flex items-center justify-between">
              <div>
                <div className="font-semibold">{t.name || t.displayName || t.id}</div>
                <div className="text-sm text-muted-foreground">{t.city || t.district || t.location}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleDelete(t.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
