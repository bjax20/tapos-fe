"use client"

import { useQuery } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { ArrowRight, CheckCircle2, History, MessageSquare, PlusCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { taskService } from "@/features/projects/api/services/tasks.service"

interface ActivityFeedProps {
  projectId: number
}

export function ActivityFeed({ projectId }: ActivityFeedProps) {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["project-logs", projectId],
    queryFn: () => taskService.getProjectLogs(projectId),
    refetchInterval: 10000,
  })

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-md bg-zinc-900/50" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-zinc-950/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 bg-black/20 p-4">
        <div className="flex items-center gap-2">
          <History size={16} className="text-zinc-500" />
          <h2 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Activity Log</h2>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="relative space-y-6 p-4">
          {/* Timeline Connector Path */}
          <div className="absolute top-8 bottom-8 left-[25px] w-[1px] bg-zinc-800/50" />

          {logs?.map((log) => (
            <div key={log.id} className="group relative pl-8">
              {/* Status Indicator Icon */}
              <div className="absolute top-1 left-0 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 transition-colors group-hover:border-zinc-600">
                {getLogIcon(log.action)}
              </div>

              <div className="flex flex-col gap-1">
                {/* Rendering the direct 'details' string from the backend */}
                <p className="text-xs leading-relaxed text-zinc-400 transition-colors group-hover:text-zinc-200">
                  {log.details || `${log.user?.email.split("@")[0]} performed an action.`}
                </p>

                <div className="flex items-center gap-2">
                  <time className="text-[10px] font-medium text-zinc-600">
                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                  </time>
                  {log.taskId && (
                    <>
                      <span className="text-[10px] text-zinc-800">•</span>
                      <span className="font-mono text-[10px] text-zinc-700">TASK-{log.taskId}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {logs?.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-xs text-zinc-600 italic">No activity recorded yet.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

/**
 * Helper to determine which icon to show based on the action type
 */
function getLogIcon(action: string) {
  const act = action.toUpperCase()
  if (act.includes("CREATE")) return <PlusCircle size={10} className="text-blue-500/80" />
  if (act.includes("STATUS")) return <ArrowRight size={10} className="text-amber-500/80" />
  if (act.includes("DONE") || act.includes("COMPLETE"))
    return <CheckCircle2 size={10} className="text-emerald-500/80" />
  if (act.includes("COMMENT")) return <MessageSquare size={10} className="text-zinc-400" />
  return <History size={10} className="text-zinc-500" />
}
