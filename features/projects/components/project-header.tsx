"use client"

import { formatDistanceToNow } from "date-fns"
import {
  Activity,
  CheckCircle2,
  ChevronRight,
  FolderRoot,
  History, 
  ShieldCheck,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { ActivityFeed } from "@/features/projects/components/activity-feed"
import { ProjectMembersPopover } from "./project-members-popover"
import { useProjectPermissions } from "../api/hooks/use-project-permissions"
import { useProjectDetail } from "../api/hooks/use-projects"

export function ProjectHeader({ projectId }: { projectId: string }) {
  const { data: project, isLoading } = useProjectDetail(projectId)
  const id = parseInt(projectId)
  const { isOwner } = useProjectPermissions(project)

  return (
    <header className="z-40 flex h-16 w-full items-center justify-between border-b border-zinc-900 bg-black/80 px-6 backdrop-blur-xl">
      {/* Left Section: Breadcrumb Wayfinding */}
      <div className="flex items-center gap-3">
        <nav className="flex items-center gap-2">
          <Link
            href="/projects"
            className="group flex items-center gap-2 rounded-md px-2 py-1.5 transition-all hover:bg-zinc-900"
          >
            <FolderRoot size={14} className="text-zinc-500 group-hover:text-zinc-300" />
            <span className="text-xs font-semibold text-zinc-500 group-hover:text-zinc-200">All Projects</span>
          </Link>

          <ChevronRight size={14} className="text-zinc-800" />

          {isLoading ? (
            <Skeleton className="h-5 w-32 bg-zinc-900" />
          ) : (
            <div className="flex items-center gap-3 pl-1">
              <h1 className="text-sm font-bold tracking-tight text-white">{project?.title}</h1>
              {isOwner ? (
                <Badge className="h-5 border-emerald-500/20 bg-emerald-500/10 px-1.5 text-[9px] font-black tracking-wider text-emerald-500 uppercase">
                  <ShieldCheck className="mr-1 h-3 w-3" /> Owner
                </Badge>
              ) : (
                <Badge className="h-5 border-zinc-800 bg-zinc-900 px-1.5 text-[9px] font-bold text-zinc-500 uppercase">
                  Member
                </Badge>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* Right Section: Stats & Utility */}
      <div className="flex items-center gap-6">
        {!isLoading && (
          <div className="hidden items-center gap-6 lg:flex">
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[10px] font-bold tracking-tighter text-zinc-600 uppercase">Tasks</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span className="text-xs font-medium text-zinc-300">{project?.taskCount || 0}</span>
              </div>
            </div>

            <Separator orientation="vertical" className="h-8 bg-zinc-900" />

            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[10px] font-bold tracking-tighter text-zinc-600 uppercase">Timeline</span>
              <span className="text-xs text-zinc-400">
                {project?.createdAt ? formatDistanceToNow(new Date(project.createdAt)) + " ago" : "--"}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <ProjectMembersPopover projectId={id} />

          <Separator orientation="vertical" className="mx-1 h-6 bg-zinc-800" />
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 gap-2 border border-zinc-800 bg-zinc-900/40 px-3 text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  <Activity size={14} />
                  <span className="hidden sm:inline">Activity</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-96 border-zinc-900 bg-zinc-950 p-0 shadow-2xl">
                <div className="flex h-full flex-col">
                  <SheetHeader className="flex flex-row items-center gap-2 space-y-0 border-b border-zinc-900 p-6">
                    <History size={18} className="text-zinc-500" />
                    <div className="text-left">
                      <SheetTitle className="text-sm font-bold tracking-widest text-white uppercase">
                        History
                      </SheetTitle>
                      <SheetDescription className="text-[11px] text-zinc-500">
                        Recent updates for this project
                      </SheetDescription>
                    </div>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto">
                    <ActivityFeed projectId={id} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
