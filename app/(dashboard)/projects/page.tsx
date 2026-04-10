"use client"

import { CheckCircle2, Folder, Search, Users } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProjects } from "@/features/projects/api/hooks/use-projects"
import { CreateProjectModal } from "@/features/projects/components/create-project-modal"

export default function ProjectsPage() {
  // 1. Fetch real data from your hook
  const { projects, isLoading } = useProjects()

  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // 2. Filter logic based on both Tabs and Search Input
  const filteredProjects = projects.filter((p) => {
    const matchesFilter = filter === "all" || p.role === filter
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-50 selection:bg-white/10">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-20 md:pt-5">
        {/* Header Section */}
        <header className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tighter italic">Projects</h1>
            <p className="text-sm font-medium text-zinc-500">Manage your finish lines.</p>
          </div>

          <div className="flex w-full items-center gap-3 md:w-auto">
            {/* Swapped static button for the functional Modal */}
            <CreateProjectModal />
          </div>
        </header>

        {/* Filter & Search Bar */}
        <div className="mb-10 flex flex-col items-center justify-between gap-4 border-b border-zinc-900 pb-6 md:flex-row">
          <Tabs defaultValue="all" onValueChange={setFilter} className="w-full md:w-auto">
            <TabsList className="border border-zinc-800 bg-zinc-900/50 p-1">
              <TabsTrigger
                value="all"
                className="px-6 text-[10px] font-bold tracking-widest uppercase data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="owner"
                className="px-6 text-[10px] font-bold tracking-widest uppercase data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
              >
                Owned
              </TabsTrigger>
              <TabsTrigger
                value="member"
                className="px-6 text-[10px] font-bold tracking-widest uppercase data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
              >
                Shared
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="group relative w-full md:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-zinc-300" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border-zinc-800 bg-transparent pl-10 text-sm transition-all focus:border-zinc-500"
            />
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Loading State: Skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl border border-zinc-800 bg-zinc-900/50" />
            ))
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="group">
                <Card className="relative h-full overflow-hidden rounded-xl border-zinc-800 bg-zinc-900/20 p-6 transition-all duration-300 hover:border-zinc-600 hover:bg-zinc-900/50">
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <div className="mb-6 flex items-start justify-between">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-800 text-zinc-400 transition-colors group-hover:text-white">
                          <Folder className="h-4 w-4" />
                        </div>
                        {project.role === "owner" && (
                          <span className="rounded bg-zinc-100 px-2 py-1 text-[9px] font-black tracking-widest text-black uppercase">
                            Owner
                          </span>
                        )}
                      </div>

                      <h3 className="mb-2 text-xl font-bold tracking-tight text-white transition-transform duration-300 group-hover:translate-x-1">
                        {project.title}
                      </h3>
                      <p className="line-clamp-2 text-sm leading-relaxed text-zinc-500">{project.description}</p>
                    </div>

                    <div className="mt-10 flex items-center justify-between text-[10px] font-bold tracking-tighter text-zinc-500 uppercase">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          {project.taskCount} Tasks
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {project.memberCount}
                        </span>
                      </div>
                      <span className="underline decoration-zinc-700 underline-offset-4 opacity-0 transition-opacity group-hover:opacity-100">
                        Open →
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            // Empty State
            <div className="col-span-full rounded-3xl border-2 border-dashed border-zinc-900 py-20 text-center">
              <p className="font-medium tracking-tight text-zinc-600">
                {searchQuery ? "No results matching your search." : "No projects found in this category."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
