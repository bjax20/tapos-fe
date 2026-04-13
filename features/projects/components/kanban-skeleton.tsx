import { Skeleton } from "@/components/ui/skeleton"

export default function KanbanSkeleton() {
  return (
    <div className="flex flex-col items-start gap-4 pb-10 md:flex-row">
      {/* Map through 3 columns to match your COLUMNS constant */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex h-auto w-full flex-col rounded-xl border border-zinc-900 bg-zinc-900/30 md:flex-1"
        >
          <div className="flex items-center justify-between p-4">
            <Skeleton className="h-4 w-20 bg-zinc-800" />
            <Skeleton className="h-4 w-4 rounded-full bg-zinc-800" />
          </div>

          <div className="px-3 pb-4">
            {/* Mock 2-3 tasks per column */}
            {[1, 2, 3].map((j) => (
              <Skeleton 
                key={j} 
                className="mb-3 h-16 w-full rounded-lg bg-zinc-800/50" 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}