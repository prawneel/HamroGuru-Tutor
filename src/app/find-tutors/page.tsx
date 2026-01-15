"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, GraduationCap, Star, Clock, DollarSign, Filter, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Teacher {
  id: number;
  name: string;
  subjects: string[];
  rate: string;
  rating: number;
  reviews: number;
  location: string;
  experience: string;
  mode: string;
  image: string;
  verified: boolean;
}

const teachers: Teacher[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    subjects: ["Mathematics", "Physics"],
    rate: "NPR 500/hr",
    rating: 4.8,
    reviews: 156,
    location: "Kathmandu",
    experience: "5+ years",
    mode: "Online, Home",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    verified: true,
  },
  {
    id: 2,
    name: "Priya Sharma",
    subjects: ["English", "Literature"],
    rate: "NPR 450/hr",
    rating: 4.9,
    reviews: 203,
    location: "Lalitpur",
    experience: "8+ years",
    mode: "Online",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    verified: true,
  },
  {
    id: 3,
    name: "Bibek Thapa",
    subjects: ["Science", "Chemistry"],
    rate: "NPR 600/hr",
    rating: 4.7,
    reviews: 98,
    location: "Bhaktapur",
    experience: "6+ years",
    mode: "Home",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    verified: true,
  },
  {
    id: 4,
    name: "Anita Gurung",
    subjects: ["Computer", "IT"],
    rate: "NPR 550/hr",
    rating: 4.6,
    reviews: 87,
    location: "Pokhara",
    experience: "4+ years",
    mode: "Online, Home",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    verified: false,
  },
  {
    id: 5,
    name: "Sanjay Rai",
    subjects: ["Mathematics", "Economics"],
    rate: "NPR 480/hr",
    rating: 4.5,
    reviews: 72,
    location: "Kathmandu",
    experience: "7+ years",
    mode: "Online",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    verified: true,
  },
  {
    id: 6,
    name: "Suman Koirala",
    subjects: ["Nepali", "Social Studies"],
    rate: "NPR 400/hr",
    rating: 4.4,
    reviews: 65,
    location: "Biratnagar",
    experience: "3+ years",
    mode: "Online",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    verified: true,
  },
];

const subjects = [
  "Mathematics",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Nepali",
  "Computer",
  "Economics",
  "Accountancy",
];

const locations = [
  "Kathmandu",
  "Lalitpur",
  "Bhaktapur",
  "Pokhara",
  "Biratnagar",
  "Butwal",
  "Chitwan",
];

const modes = ["All", "Online", "Home Tuition", "Both"];

export default function FindTeachersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedMode, setSelectedMode] = useState("All");
  const [priceRange, setPriceRange] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      searchQuery === "" ||
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSubject = selectedSubject === "" || teacher.subjects.includes(selectedSubject);
    const matchesLocation = selectedLocation === "" || teacher.location === selectedLocation;
    const matchesMode = selectedMode === "All" || teacher.mode.includes(selectedMode.replace("Home Tuition", "Home"));

    return matchesSearch && matchesSubject && matchesLocation && matchesMode;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground">
              Find Your Perfect Tutor
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Browse verified teachers, compare rates, and start your learning journey today
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by subject, teacher name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="border-b bg-muted/30 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Filter Toggle for Mobile */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>

            {/* Filters */}
            <div className={cn(
              "flex flex-col md:flex-row items-center gap-3 w-full",
              !isFilterOpen && "md:flex hidden"
            )}>
              <div className="w-full md:w-48">
                <Label className="text-sm mb-1.5">Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Subjects</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-48">
                <Label className="text-sm mb-1.5">Location</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-48">
                <Label className="text-sm mb-1.5">Teaching Mode</Label>
                <Select value={selectedMode} onValueChange={setSelectedMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Modes" />
                  </SelectTrigger>
                  <SelectContent>
                    {modes.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-48">
                <Label className="text-sm mb-1.5">Price Range</Label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Price</SelectItem>
                    <SelectItem value="0-400">Under NPR 400/hr</SelectItem>
                    <SelectItem value="400-500">NPR 400-500/hr</SelectItem>
                    <SelectItem value="500-600">NPR 500-600/hr</SelectItem>
                    <SelectItem value="600+">NPR 600+/hr</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isFilterOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFilterOpen(false)}
                  className="md:hidden mt-2"
                >
                  Done
                </Button>
              )}
            </div>

            {/* Results Count */}
            <div className="md:ml-auto text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredTeachers.length}</span> teachers
            </div>
          </div>
        </div>
      </section>

      {/* Teacher Cards Grid */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredTeachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={teacher.image}
                        alt={teacher.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {teacher.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                          <Star className="w-3 h-3 fill-primary-foreground text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {teacher.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{teacher.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-foreground">{teacher.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({teacher.reviews} reviews)</span>
                    <div className="flex-1" />
                    <Badge variant="secondary" className="text-xs">
                      {teacher.experience}
                    </Badge>
                  </div>

                  {/* Subjects */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {teacher.subjects.map((subject) => (
                      <Badge key={subject} variant="outline">
                        {subject}
                      </Badge>
                    ))}
                  </div>

                  {/* Teaching Mode */}
                  <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                    <GraduationCap className="w-4 h-4" />
                    <span>{teacher.mode}</span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <span className="text-lg font-bold text-primary">{teacher.rate}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <Button size="sm" className="gap-2">
                        <User className="w-4 h-4" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredTeachers.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No teachers found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search terms
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedSubject("");
              setSelectedLocation("");
              setSelectedMode("All");
              setPriceRange("");
            }}>
              Clear All Filters
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
