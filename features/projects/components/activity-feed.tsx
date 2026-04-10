"use client";

import { useQuery } from "@tanstack/react-query";
import { taskService } from "@/features/projects/api/services/tasks.service";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, ArrowRight, PlusCircle, CheckCircle2, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityFeedProps {
  projectId: number;
}

export function ActivityFeed({ projectId }: ActivityFeedProps) {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["project-logs", projectId],
    queryFn: () => taskService.getProjectLogs(projectId),
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-10 bg-zinc-900/50 animate-pulse rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950/50">
      {/* Header */}
      <div className="p-4 border-b border-zinc-900 flex items-center justify-between bg-black/20">
        <div className="flex items-center gap-2">
          <History size={16} className="text-zinc-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Activity Log</h2>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6 relative">
          {/* Timeline Connector Path */}
          <div className="absolute left-[25px] top-8 bottom-8 w-[1px] bg-zinc-800/50" />

          {logs?.map((log) => (
            <div key={log.id} className="relative pl-8 group">
              {/* Status Indicator Icon */}
              <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center z-10 group-hover:border-zinc-600 transition-colors">
                {getLogIcon(log.action)}
              </div>

              <div className="flex flex-col gap-1">
                {/* Rendering the direct 'details' string from the backend */}
                <p className="text-xs text-zinc-400 leading-relaxed group-hover:text-zinc-200 transition-colors">
                  {log.details || `${log.user?.email.split('@')[0]} performed an action.`}
                </p>
                
                <div className="flex items-center gap-2">
                  <time className="text-[10px] text-zinc-600 font-medium">
                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                  </time>
                  {log.taskId && (
                    <>
                      <span className="text-[10px] text-zinc-800">•</span>
                      <span className="text-[10px] text-zinc-700 font-mono">TASK-{log.taskId}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {logs?.length === 0 && (
             <div className="text-center py-10">
               <p className="text-xs text-zinc-600 italic">No activity recorded yet.</p>
             </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

/**
 * Helper to determine which icon to show based on the action type
 */
function getLogIcon(action: string) {
  const act = action.toUpperCase();
  if (act.includes("CREATE")) return <PlusCircle size={10} className="text-blue-500/80" />;
  if (act.includes("STATUS")) return <ArrowRight size={10} className="text-amber-500/80" />;
  if (act.includes("DONE") || act.includes("COMPLETE")) return <CheckCircle2 size={10} className="text-emerald-500/80" />;
  if (act.includes("COMMENT")) return <MessageSquare size={10} className="text-zinc-400" />;
  return <History size={10} className="text-zinc-500" />;
}