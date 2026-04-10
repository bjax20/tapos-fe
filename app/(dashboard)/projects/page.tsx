"use client";

import { useState } from "react";
import { Folder, Users, CheckCircle2, Search } from "lucide-react";
import { useProjects } from "@/features/projects/api/hooks/use-projects";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function ProjectsPage() {
  // 1. Fetch real data from your hook
  const { projects, isLoading } = useProjects();
  
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 2. Filter logic based on both Tabs and Search Input
  const filteredProjects = projects.filter((p) => {
    const matchesFilter = filter === "all" || p.role === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 md:pt-5">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tighter italic">Projects</h1>
            <p className="text-zinc-500 text-sm font-medium">Manage your finish lines.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             {/* Swapped static button for the functional Modal */}
             <CreateProjectModal />
          </div>
        </header>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 pb-6 border-b border-zinc-900">
          <Tabs defaultValue="all" onValueChange={setFilter} className="w-full md:w-auto">
            <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1">
              <TabsTrigger value="all" className="px-6 data-[state=active]:bg-zinc-800 data-[state=active]:text-white uppercase text-[10px] tracking-widest font-bold">All</TabsTrigger>
              <TabsTrigger value="owner" className="px-6 data-[state=active]:bg-zinc-800 data-[state=active]:text-white uppercase text-[10px] tracking-widest font-bold">Owned</TabsTrigger>
              <TabsTrigger value="member" className="px-6 data-[state=active]:bg-zinc-800 data-[state=active]:text-white uppercase text-[10px] tracking-widest font-bold">Shared</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-zinc-300 transition-colors" />
            <Input 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-transparent border-zinc-800 focus:border-zinc-500 transition-all rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading State: Skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl bg-zinc-900/50 border border-zinc-800" />
            ))
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="group">
                <Card className="relative h-full overflow-hidden rounded-xl border-zinc-800 bg-zinc-900/20 p-6 hover:bg-zinc-900/50 hover:border-zinc-600 transition-all duration-300">
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="h-8 w-8 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                          <Folder className="w-4 h-4" />
                        </div>
                        {project.role === "owner" && (
                          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-zinc-100 text-black">Owner</span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold tracking-tight mb-2 group-hover:translate-x-1 transition-transform duration-300 text-white">
                        {project.title}
                      </h3>
                      <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                    </div>

                    <div className="mt-10 flex items-center justify-between text-zinc-500 font-bold uppercase text-[10px] tracking-tighter">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          {project.taskCount} Tasks
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {project.memberCount}
                        </span>
                      </div>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity underline decoration-zinc-700 underline-offset-4">Open →</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            // Empty State
            <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-900 rounded-3xl">
              <p className="text-zinc-600 font-medium tracking-tight">
                {searchQuery ? "No results matching your search." : "No projects found in this category."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}