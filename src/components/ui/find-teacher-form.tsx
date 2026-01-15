"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  DollarSign,
  GraduationCap,
  Star,
  Filter,
  Phone,
  MessageSquare,
  X,
  LayoutGrid,
  List,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const subjects = [
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
  "History",
  "Geography",
  "Other",
];

const districts = [
  "Kathmandu",
  "Lalitpur",
  "Bhaktapur",
  "Pokhara",
  "Biratnagar",
  "Butwal",
  "Chitwan",
  "Nepalgunj",
  "Bhairahawa",
  "Hetauda",
  "Dhangadhi",
  "Other",
];

interface Teacher {
  id: number;
  name: string;
  subjects: string[];
  rate: number;
  rateType: "hourly" | "monthly";
  rating: number;
  reviews: number;
  location: string;
  teachingMode: string;
  experience: string;
  qualifications: string;
  image: string;
  whatsappEnabled: boolean;
  email: string;
  phone: string;
  bio: string;
}

// Mock teacher data
const mockTeachers: Teacher[] = [
  {
    id: 1,
    name: "Rajesh Sharma",
    subjects: ["Mathematics", "Physics"],
    rate: 800,
    rateType: "hourly",
    rating: 4.8,
    reviews: 24,
    location: "Kathmandu",
    teachingMode: "Both",
    experience: "5+ years",
    qualifications: "M.Sc. Physics",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    whatsappEnabled: true,
    email: "rajesh.maths@example.com",
    phone: "9779800000001",
    bio: "Dedicated Physics and Mathematics teacher with over 5 years of experience in helping students excel in competitive exams and board finals. I believe in conceptual learning and practical problem-solving.",
  },
  {
    id: 2,
    name: "Priya Thapa",
    subjects: ["English", "Social Studies"],
    rate: 600,
    rateType: "hourly",
    rating: 4.9,
    reviews: 31,
    location: "Lalitpur",
    teachingMode: "Online",
    experience: "3+ years",
    qualifications: "M.A. English",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
    whatsappEnabled: true,
    email: "priya.thapa@example.com",
    phone: "9779800000002",
    bio: "Passionate English literature graduate offering interactive online classes. I specialize in improving communication skills, creative writing, and academic English for high school students.",
  },
  {
    id: 3,
    name: "Bikash Maharjan",
    subjects: ["Computer Science", "Mathematics"],
    rate: 1000,
    rateType: "hourly",
    rating: 4.7,
    reviews: 18,
    location: "Bhaktapur",
    teachingMode: "Home Tuition",
    experience: "8+ years",
    qualifications: "B.Tech Computer Science",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    whatsappEnabled: false,
    email: "bikash.cs@example.com",
    phone: "9779800000003",
    bio: "Experienced software developer turned educator. I provide hands-on training in C++, Java, and Python alongside core Mathematics for SLC and Plus 2 students.",
  },
  {
    id: 4,
    name: "Anita Koirala",
    subjects: ["Chemistry", "Biology"],
    rate: 700,
    rateType: "hourly",
    rating: 4.6,
    reviews: 15,
    location: "Pokhara",
    teachingMode: "Both",
    experience: "4+ years",
    qualifications: "M.Sc. Chemistry",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
    whatsappEnabled: true,
    email: "anita.science@example.com",
    phone: "9779800000004",
    bio: "Science enthusiast with a focus on Biology and Chemistry. I help students visualize complex biological processes and chemical reactions through interactive sessions and experiments.",
  },
];

export default function FindTeacherForm({ onViewChange }: { onViewChange?: (view: string) => void }) {
  const [showFilters, setShowFilters] = useState(false);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>(mockTeachers);

  // Filter states
  const [filters, setFilters] = useState({
    subject: "",
    location: "",
    teachingMode: "",
    priceRange: [0, 5000],
    experience: "",
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const applyFilters = () => {
    let filtered = [...mockTeachers];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(query) ||
          teacher.subjects.some((s) => s.toLowerCase().includes(query)) ||
          teacher.location.toLowerCase().includes(query)
      );
    }

    // Apply subject filter
    if (filters.subject) {
      filtered = filtered.filter((teacher) =>
        teacher.subjects.includes(filters.subject)
      );
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter((teacher) =>
        teacher.location === filters.location
      );
    }

    // Apply teaching mode filter
    if (filters.teachingMode) {
      filtered = filtered.filter((teacher) => {
        if (filters.teachingMode === "Both") {
          return teacher.teachingMode === "Both" || teacher.teachingMode === "Online" || teacher.teachingMode === "Home Tuition";
        }
        return teacher.teachingMode === filters.teachingMode || teacher.teachingMode === "Both";
      });
    }

    // Apply experience filter
    if (filters.experience) {
      filtered = filtered.filter((teacher) =>
        teacher.experience === filters.experience
      );
    }

    // Apply price range filter
    filtered = filtered.filter(
      (teacher) =>
        teacher.rate >= filters.priceRange[0] &&
        teacher.rate <= filters.priceRange[1]
    );

    setFilteredTeachers(filtered);
    toast.success(`Found ${filtered.length} teacher${filtered.length !== 1 ? 's' : ''}`);
  };

  const clearFilters = () => {
    setFilters({
      subject: "",
      location: "",
      teachingMode: "",
      priceRange: [0, 5000],
      experience: "",
    });
    setSearchQuery("");
    setFilteredTeachers(mockTeachers);
  };

  const checkAuth = () => {
    const user = localStorage.getItem("hamroguru_user");
    if (!user) {
      toast.error("Sign in required to contact teachers");
      if (onViewChange) {
        onViewChange("sign-in");
      } else {
        window.location.href = '/?view=sign-in';
      }
      return false;
    }
    return true;
  };

  // --- Interaction Tracking ---
  const trackInteraction = (teacherId: number) => {
    const interactions = JSON.parse(localStorage.getItem("hamroguru_interactions") || "{}");
    interactions[teacherId] = true;
    localStorage.setItem("hamroguru_interactions", JSON.stringify(interactions));
  };

  const hasInteracted = (teacherId: number) => {
    const interactions = JSON.parse(localStorage.getItem("hamroguru_interactions") || "{}");
    return !!interactions[teacherId];
  };

  const handleContactTeacher = (teacher: Teacher, type: "whatsapp" | "inquiry" | "profile") => {
    if (!checkAuth()) return;

    if (type === "whatsapp") {
      if (!teacher.whatsappEnabled) {
        toast.error("This teacher has not enabled WhatsApp contact");
        return;
      }
      trackInteraction(teacher.id);
      const waUrl = `https://wa.me/${teacher.phone}?text=${encodeURIComponent(`Hi ${teacher.name}, I found your profile on HamroGuru and I'm interested in your ${teacher.subjects[0]} classes.`)}`;
      window.open(waUrl, '_blank');
      toast.success(`Opening WhatsApp for ${teacher.name}`);
    } else if (type === "inquiry") {
      trackInteraction(teacher.id);
      const subject = encodeURIComponent(`Inquiry for ${teacher.subjects.join(", ")} - HamroGuru`);
      const body = encodeURIComponent(`Hi ${teacher.name},\n\nI found your profile on HamroGuru and would like to inquire about your classes for ${teacher.subjects.join(", ")}.\n\nPlease let me know your availability.\n\nThank you!`);
      window.location.href = `mailto:${teacher.email}?subject=${subject}&body=${body}`;
      toast.success(`Opening email client for ${teacher.name}`);
    } else {
      setSelectedTeacher(teacher);
    }
  };

  // --- Star Rating Component ---
  const StarRating = ({ initialRating = 0, onRate }: { initialRating?: number; onRate: (rating: number) => void }) => {
    const [hover, setHover] = useState(0);
    const [rating, setRating] = useState(initialRating);

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none transition-transform hover:scale-125"
            onClick={() => {
              setRating(star);
              onRate(star);
            }}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              className={cn(
                "w-6 h-6 transition-colors",
                (hover || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  // --- Teacher Detail Modal ---
  const TeacherDetailModal = ({ teacher, onClose }: { teacher: Teacher; onClose: () => void }) => {
    const interacted = hasInteracted(teacher.id);
    const [isRating, setIsRating] = useState(false);
    const [submittedRating, setSubmittedRating] = useState<number | null>(null);

    const handleRateSubmit = (r: number) => {
      setIsRating(true);
      // Simulate API call to save rating
      setTimeout(() => {
        setSubmittedRating(r);
        setIsRating(false);
        toast.success(`You rated ${teacher.name} ${r} stars!`);

        // Optimistically update the mock data/UI
        setFilteredTeachers(prev => prev.map(t => {
          if (t.id === teacher.id) {
            const newReviews = t.reviews + 1;
            const newRating = Number(((t.rating * t.reviews + r) / newReviews).toFixed(1));
            return { ...t, rating: newRating, reviews: newReviews };
          }
          return t;
        }));
      }, 1000);
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-background w-full max-w-2xl rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] md:max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Scrollable Content Container */}
          <div className="overflow-y-auto custom-scrollbar">
            <div className="relative h-32 md:h-48 bg-gradient-to-r from-primary/20 to-secondary/20">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 md:top-4 md:right-4 rounded-full bg-background/50 backdrop-blur-md hover:bg-background z-10"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
              <div className="absolute -bottom-10 md:-bottom-12 left-6 md:left-8">
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-4 border-background shadow-lg"
                />
              </div>
            </div>

            <div className="pt-12 md:pt-16 pb-6 md:pb-8 px-5 md:px-8 space-y-5 md:space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">{teacher.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{teacher.rating}</span>
                    <span className="text-muted-foreground text-sm md:text-base">({teacher.reviews} reviews)</span>
                  </div>
                </div>
                <div className="text-left md:text-right w-full md:w-auto p-3 rounded-xl bg-primary/5 md:bg-transparent">
                  <div className="text-xl md:text-2xl font-bold text-primary">NPR {teacher.rate}</div>
                  <div className="text-xs md:text-sm text-muted-foreground uppercase font-bold tracking-wider">per {teacher.rateType === 'hourly' ? 'hour' : 'month'}</div>
                </div>
              </div>

              {/* Rating Section */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-primary/10">
                {interacted ? (
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-xs md:text-sm font-medium text-foreground/80">Rate your experience</p>
                    {submittedRating ? (
                      <div className="flex items-center gap-2 text-green-600 font-semibold text-sm animate-in fade-in zoom-in duration-300">
                        <Check className="w-4 h-4" /> Thanks for your rating!
                      </div>
                    ) : (
                      <StarRating onRate={handleRateSubmit} />
                    )}
                    {isRating && <div className="text-[10px] md:text-xs text-muted-foreground animate-pulse">Submitting...</div>}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-xs md:text-sm font-medium text-muted-foreground italic">
                      Inquire or WhatsApp to unlock ratings
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 rounded-xl bg-muted/50 border flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Experience</span>
                  <span className="font-medium">{teacher.experience}</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 border flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Location</span>
                  <span className="font-medium text-sm">{teacher.location}</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 border flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Mode</span>
                  <span className="font-medium">{teacher.teachingMode}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                  <GraduationCap className="w-4 h-4" /> Subjects
                </h4>
                <div className="flex flex-wrap gap-2">
                  {teacher.subjects.map((s) => (
                    <Badge key={s} variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-none text-sm">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">About Me</h4>
                <p className="text-muted-foreground leading-relaxed">{teacher.bio}</p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Button
                  className="flex-1 h-12 rounded-xl text-lg gap-2 shadow-lg"
                  onClick={() => handleContactTeacher(teacher, "inquiry")}
                >
                  <MessageSquare className="w-5 h-5" />
                  Send Email Inquiry
                </Button>
                {teacher.whatsappEnabled && (
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-xl text-lg gap-2 border-green-200 hover:bg-green-50 hover:text-green-700"
                    onClick={() => handleContactTeacher(teacher, "whatsapp")}
                  >
                    <Phone className="w-5 h-5" />
                    Contact on WhatsApp
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">HamroGuru</h1>
              <p className="text-sm text-muted-foreground">Find Your Perfect Tutor</p>
            </div>
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/')}
              className="gap-2"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={cn(
            "lg:w-80 flex-shrink-0 transition-all duration-300",
            !showFilters && "hidden lg:block"
          )}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Filters</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="hidden lg:flex"
                  >
                    Clear All
                  </Button>
                </div>
                <CardDescription>Refine your search</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <Label htmlFor="search" className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Search
                  </Label>
                  <Input
                    id="search"
                    placeholder="Search by name, subject, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject" className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Subject
                  </Label>
                  <Select
                    value={filters.subject}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, subject: value }))
                    }
                  >
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </Label>
                  <Select
                    value={filters.location}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, location: value }))
                    }
                  >
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location" />
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

                {/* Teaching Mode */}
                <div className="space-y-2">
                  <Label>Teaching Mode</Label>
                  <Select
                    value={filters.teachingMode}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, teachingMode: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Home Tuition">Home Tuition</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <Label>Experience</Label>
                  <Select
                    value={filters.experience}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, experience: value }))
                    }
                  >
                    <SelectTrigger>
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

                {/* Price Range */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Hourly Rate: NPR {filters.priceRange[0]} - {filters.priceRange[1]}
                  </Label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))
                    }
                    min={0}
                    max={5000}
                    step={100}
                  />
                </div>

                {/* Apply Button */}
                <Button
                  onClick={applyFilters}
                  className="w-full"
                  size="lg"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>

                {/* Clear Button - Mobile Only */}
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full lg:hidden"
                >
                  Clear All
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full gap-2"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredTeachers.length}</span> teacher{filteredTeachers.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Teacher Cards */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredTeachers.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Teachers Found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search terms
                    </p>
                    <Button onClick={clearFilters}>Clear All Filters</Button>
                  </motion.div>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <motion.div
                      key={teacher.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            {/* Teacher Image & Basic Info */}
                            <div className="flex-shrink-0">
                              <img
                                src={teacher.image}
                                alt={teacher.name}
                                className="w-24 h-24 rounded-xl object-cover"
                              />
                            </div>

                            {/* Teacher Details */}
                            <div className="flex-1 space-y-3">
                              <div>
                                <h3 className="text-xl font-semibold text-foreground">
                                  {teacher.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={cn(
                                          "w-4 h-4",
                                          i < Math.floor(teacher.rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                        )}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm font-medium">{teacher.rating}</span>
                                  <span className="text-sm text-muted-foreground">
                                    ({teacher.reviews} reviews)
                                  </span>
                                </div>
                              </div>

                              {/* Subjects */}
                              <div className="flex flex-wrap gap-2">
                                {teacher.subjects.map((subject) => (
                                  <Badge key={subject} variant="secondary">
                                    {subject}
                                  </Badge>
                                ))}
                              </div>

                              {/* Info Grid */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-foreground">{teacher.qualifications}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-foreground">{teacher.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-foreground font-medium">
                                    NPR {teacher.rate}/{teacher.rateType === 'hourly' ? 'hr' : 'mo'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-foreground">{teacher.experience}</span>
                                </div>
                              </div>

                              {/* Teaching Mode */}
                              <div>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    teacher.teachingMode === "Online" && "bg-blue-50 text-blue-700 border-blue-200",
                                    teacher.teachingMode === "Home Tuition" && "bg-green-50 text-green-700 border-green-200",
                                    teacher.teachingMode === "Both" && "bg-purple-50 text-purple-700 border-purple-200"
                                  )}
                                >
                                  {teacher.teachingMode}
                                </Badge>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2 md:w-auto">
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => handleContactTeacher(teacher, "profile")}
                              >
                                View Profile
                              </Button>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="flex-1 gap-2"
                                  onClick={() => handleContactTeacher(teacher, "inquiry")}
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  Inquiry
                                </Button>
                                {teacher.whatsappEnabled && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 gap-2"
                                    onClick={() => handleContactTeacher(teacher, "whatsapp")}
                                  >
                                    <Phone className="w-3 h-3" />
                                    WhatsApp
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedTeacher && (
          <TeacherDetailModal
            teacher={selectedTeacher}
            onClose={() => setSelectedTeacher(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
