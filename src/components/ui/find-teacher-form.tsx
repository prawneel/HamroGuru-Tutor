"use client";

import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, ExternalLink, Star, Filter, X } from "lucide-react";

type RawProfile = { [key: string]: any };

type TeacherJoined = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  subjects?: string[] | string;
  rate?: number;
  hours?: string | number;
  location?: string;
  teachingMode?: string;
  image?: string;
  rating?: number;
  reviews?: number;
  qualifications?: string;
  educationLevel?: string;
  experienceYears?: number;
};

const normalizePhoneForWa = (raw?: string) => {
  if (!raw) return null;
  const digits = String(raw).replace(/[^0-9+]/g, "");
  if (!digits) return null;
  const cleaned = digits.replace(/^\+/, "");
  if (cleaned.length <= 9) return `977${cleaned.replace(/^0+/, "")}`;
  return cleaned;
};

export default function FindTeacherForm() {
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<TeacherJoined[]>([]);
  const [selected, setSelected] = useState<TeacherJoined | null>(null);
  const [filters, setFilters] = useState({
    location: "",
    subject: "",
    minRate: "",
    maxRate: "",
    teachingMode: "all",
    educationLevel: "all",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const col = collection(db, "teacherProfiles");
    const unsub = onSnapshot(
      col,
      async (snap) => {
        setLoading(true);
        try {
          const profiles = snap.docs.map((d) => ({ id: d.id, data: d.data() as RawProfile }));
          const joined = await Promise.all(
            profiles.map(async (p) => {
              let user: RawProfile | null = null;
              try {
                const uref = doc(db, "users", p.id);
                const udoc = await getDoc(uref);
                if (udoc.exists()) user = udoc.data() as RawProfile;
              } catch (e) {
                user = null;
              }

              const pr = p.data || {};
              return {
                id: p.id,
                name: (user?.name || pr?.name || pr?.displayName || "Unknown") as string,
                email: (user?.email || pr?.email || pr?.contactEmail) as string | undefined,
                phone: (user?.phone || pr?.phone || pr?.contactPhone) as string | undefined,
                whatsapp: (pr?.whatsapp || pr?.whatsappNumber || user?.phone || pr?.phone || pr?.contactPhone) as string | undefined,
                subjects: pr?.subjects || pr?.subjectList || user?.subjects || [],
                rate: pr?.rate || pr?.fees || pr?.hourlyRate || pr?.price || user?.rate,
                hours: pr?.hours || pr?.hoursPerWeek || pr?.availability || pr?.workingHours,
                location: pr?.location || pr?.city || pr?.address || user?.location || user?.city,
                teachingMode: pr?.teachingMode,
                image: pr?.image || user?.photoURL,
                rating: pr?.rating ?? pr?.avgRating ?? user?.rating,
                reviews: pr?.reviews ?? user?.reviews ?? 0,
                qualifications: pr?.qualifications || pr?.qualification || "",
                educationLevel: pr?.educationLevel || pr?.education || pr?.degree || user?.education,
                experienceYears: pr?.experienceYears || pr?.experience || pr?.experienceRange || user?.experience || undefined,
              } as TeacherJoined;
            })
          );
          setTeachers(joined);
        } catch (err) {
          console.error(err);
          toast.error("Failed to load teachers");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        toast.error("Realtime listener failed");
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const filteredTeachers = teachers.filter((t) => {
    if (filters.location && !t.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.subject) {
      const subjectStr = Array.isArray(t.subjects) 
        ? t.subjects.join(" ").toLowerCase()
        : String(t.subjects || "").toLowerCase();
      if (!subjectStr.includes(filters.subject.toLowerCase())) return false;
    }
    if (filters.minRate && (!t.rate || t.rate < parseInt(filters.minRate))) return false;
    if (filters.maxRate && (!t.rate || t.rate > parseInt(filters.maxRate))) return false;
    if (filters.teachingMode && filters.teachingMode !== "all" && t.teachingMode !== filters.teachingMode) return false;
    if (filters.educationLevel && filters.educationLevel !== "all" && t.educationLevel !== filters.educationLevel) return false;
    return true;
  });

  const clearFilters = () => {
    setFilters({
      location: "",
      subject: "",
      minRate: "",
      maxRate: "",
      teachingMode: "all",
      educationLevel: "all",
    });
  };

  const contactMail = (email?: string, name?: string) => {
    if (!email) {
      toast.error("No email available for this teacher");
      return;
    }
    const subject = encodeURIComponent(`Inquiry about tuition from student`);
    const body = encodeURIComponent(`Hello ${name || ""},%0D%0A%0D%0AI am interested in your tutoring. Please let me know your availability and rates.%0D%0A%0D%0ARegards.`);
    // Use direct navigation to avoid opening an about:blank tab in some browsers
    const link = `mailto:${email}?subject=${subject}&body=${body}`;
    window.location.href = link;
  };

  const contactWhatsApp = (raw?: string, name?: string) => {
    const normalized = normalizePhoneForWa(raw);
    if (!normalized) {
      toast.error("No WhatsApp number available");
      return;
    }
    const text = encodeURIComponent(`Hi ${name || ""}, I'm interested in your tutoring.`);
    // Navigate directly so the link opens reliably without creating an empty tab
    const link = `https://wa.me/${normalized}?text=${text}`;
    window.location.href = link;
  };

  const viewProfile = (t: TeacherJoined) => setSelected(t);

  return (
    <div className="p-4">
      <div className="mb-4">
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="mb-2"
        >
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>

        {showFilters && (
          <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input
                  placeholder="Enter location"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <Input
                  placeholder="Enter subject"
                  value={filters.subject}
                  onChange={(e) => setFilters({...filters, subject: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Teaching Mode</label>
                <Select value={filters.teachingMode} onValueChange={(value) => setFilters({...filters, teachingMode: value === "all" ? "" : value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Min Rate (NPR)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minRate}
                  onChange={(e) => setFilters({...filters, minRate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Rate (NPR)</label>
                <Input
                  type="number"
                  placeholder="10000"
                  value={filters.maxRate}
                  onChange={(e) => setFilters({...filters, maxRate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Education Level</label>
                <Select value={filters.educationLevel} onValueChange={(value) => setFilters({...filters, educationLevel: value === "all" ? "" : value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Bachelor">Bachelor</SelectItem>
                    <SelectItem value="Master">Master</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                    <SelectItem value="High School">High School</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8 text-sm text-muted-foreground">Loading teachers…</div>
      ) : filteredTeachers.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          {teachers.length === 0 ? "No teachers found." : "No teachers match your filters."}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTeachers.map((t) => (
            <div key={t.id} className="p-4 border rounded-lg shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-14 h-14 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                  {t.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center font-semibold text-lg">
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{t.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {Array.isArray(t.subjects) ? (t.subjects as string[]).join(", ") : String(t.subjects || "")}
                  </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <span className="mr-2">{t.location || "—"}</span>
                      <span className="mr-2">• {t.rate ? `NPR ${t.rate}` : "—"}</span>
                      {t.teachingMode ? <span className="mr-2">• {t.teachingMode}</span> : null}
                      {t.hours ? <span className="mr-2">• {t.hours} hrs</span> : null}
                      <span className="mr-2">• {t.educationLevel || "—"}</span>
                      {t.experienceYears ? <span className="mr-2">• {t.experienceYears} yrs exp</span> : null}
                    </div>
                </div>
              </div>

              <div className="flex-shrink-0 flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => viewProfile(t)}>
                  View Profile
                </Button>
                <Button asChild>
                  <a
                    href={t.email ? `mailto:${t.email}?subject=${encodeURIComponent("Inquiry about tuition from student")}&body=${encodeURIComponent("Hello " + (t.name || "") + ",%0D%0A%0D%0AI am interested in your tutoring. Please let me know your availability and rates.%0D%0A%0D%0ARegards.")}` : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-disabled={!t.email}
                  >
                    <Mail className="w-4 h-4 mr-2" />Inquiry
                  </a>
                </Button>
                <Button asChild>
                  <a
                    href={normalizePhoneForWa(t.whatsapp || t.phone) ? `https://wa.me/${normalizePhoneForWa(t.whatsapp || t.phone)}?text=${encodeURIComponent("Hi " + (t.name || "") + ", I'm interested in your tutoring.")}` : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-disabled={!(t.whatsapp || t.phone)}
                    className="hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors"
                  >
                    <Phone className="w-4 h-4 mr-2" />WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl mx-4 rounded-lg shadow-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                {selected.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center font-bold text-2xl">
                    {selected.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{selected.name}</h3>
                  <div className="flex items-center gap-3">
                    {selected.reviews && selected.reviews > 0 ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="font-medium">{(selected.rating || 0).toFixed(1)}</span>
                        <span className="text-muted-foreground">({selected.reviews})</span>
                      </div>
                    ) : null}
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>Close</Button>
                      <Button asChild>
                        <a
                          href={selected?.email ? `mailto:${selected.email}?subject=${encodeURIComponent("Inquiry about tuition from student")}&body=${encodeURIComponent("Hello " + (selected.name || "") + ",%0D%0A%0D%0AI am interested in your tutoring. Please let me know your availability and rates.%0D%0A%0D%0ARegards.")}` : "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-disabled={!selected?.email}
                        >
                          <Mail className="w-4 h-4 mr-2" />Contact
                        </a>
                      </Button>
                      <Button asChild>
                        <a
                          href={normalizePhoneForWa(selected?.whatsapp || selected?.phone) ? `https://wa.me/${normalizePhoneForWa(selected?.whatsapp || selected?.phone)}?text=${encodeURIComponent("Hi " + (selected?.name || "") + ", I'm interested in your tutoring.")}` : "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-disabled={!(selected?.whatsapp || selected?.phone)}
                          className="hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors"
                        >
                          <Phone className="w-4 h-4 mr-2" />WhatsApp
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{selected.qualifications}</div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Location</div>
                    <div>{selected.location || "—"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Rate</div>
                    <div>{selected.rate ? `NPR ${selected.rate}` : "—"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Hours</div>
                    <div>{selected.hours ? `${selected.hours} hrs` : "—"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Teaching Mode</div>
                    <div>{selected.teachingMode || "—"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Education Level</div>
                    <div>{selected.educationLevel || "—"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Experience</div>
                    <div>{selected.experienceYears ? `${selected.experienceYears} years` : "—"}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-muted-foreground text-sm">Subjects</div>
                  <div className="mt-1">{Array.isArray(selected.subjects) ? (selected.subjects as string[]).join(", ") : String(selected.subjects || "—")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
