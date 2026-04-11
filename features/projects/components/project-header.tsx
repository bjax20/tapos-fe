"use client"

import { formatDistanceToNow } from "date-fns"
import { CheckCircle2, History, LayoutGrid, ShieldCheck, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
    <header className="z-20 flex flex-col border-b border-zinc-900 bg-black/50 backdrop-blur-md">
      {/* Top Row: Primary Navigation and Members */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="2xl:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="rounded-md p-2 transition-colors hover:bg-zinc-900">
                  <History size={18} className="text-zinc-400" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 border-zinc-800 bg-black p-0">
                <ActivityFeed projectId={id} />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-2 text-zinc-500">
            <LayoutGrid size={16} />
            <span className="text-[11px] font-medium tracking-widest uppercase">Projects</span>
            <span className="text-zinc-700">/</span>
            {isLoading ? (
              <Skeleton className="h-4 w-24 bg-zinc-800" />
            ) : (
              <span className="max-w-[150px] truncate text-[11px] font-medium text-zinc-300">{project?.title}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Metadata visible on desktop */}
          <div className="hidden items-center gap-4 md:flex">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Created</span>
              <span className="text-[11px] text-zinc-300">
                {project?.createdAt ? formatDistanceToNow(new Date(project.createdAt)) + " ago" : "---"}
              </span>
            </div>
            <Separator orientation="vertical" className="h-8 bg-zinc-800" />
          </div>

          <ProjectMembersPopover projectId={id} />
        </div>
      </div>

      {/* Bottom Row: Title and Stats Bar */}
      <div className="flex flex-wrap items-center justify-between px-6 pt-2 pb-4">
        <div className="flex items-baseline gap-3">
          {isLoading ? (
            <Skeleton className="h-8 w-64 bg-zinc-800" />
          ) : (
            <h1 className="text-2xl font-bold tracking-tight text-white italic">{project?.title}</h1>
          )}

          {/* UPDATED: Using isOwner from hook instead of project.role */}
          {!isLoading &&
            (isOwner ? (
              <Badge className="border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0 text-[9px] text-emerald-500 hover:bg-emerald-500/20">
                <ShieldCheck className="mr-1 h-3 w-3" /> OWNER
              </Badge>
            ) : (
              <Badge variant="outline" className="border-zinc-800 px-1.5 py-0 text-[9px] text-zinc-500">
                MEMBER
              </Badge>
            ))}
        </div>

        <div className="mt-2 flex items-center gap-6 sm:mt-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-zinc-500" />
            <span className="text-xs font-medium text-zinc-400">
              <b className="text-zinc-100">{project?.taskCount || 0}</b> Tasks
            </span>
          </div>

          <div className="flex items-center gap-2 border-l border-zinc-800 pl-6">
            <User size={14} className="text-zinc-500" />
            <div className="flex flex-col">
              <span className="text-[9px] leading-none font-bold text-zinc-600 uppercase">Owner</span>
              {/* Show skeleton or placeholder if email isn't loaded yet */}
              <span className="text-xs text-zinc-400">{isLoading ? "Loading..." : project?.owner?.email}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
