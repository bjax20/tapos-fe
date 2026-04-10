import { History } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ActivityFeed } from "@/features/projects/components/activity-feed"
import { KanbanBoard } from "@/features/projects/components/kanban-board"

interface ProjectPageProps {
  params: Promise<{ projectId: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params
  const id = parseInt(projectId)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-black text-white">
      {/* Header */}
      <header className="z-20 flex items-center justify-between border-b border-zinc-900 bg-black/50 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          {/* Mobile Activity Trigger */}
          <div className="2xl:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="rounded-md p-2 hover:bg-zinc-900">
                  <History size={20} className="text-zinc-400" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 border-zinc-800 bg-black p-0">
                <ActivityFeed projectId={id} />
              </SheetContent>
            </Sheet>
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight">Project Board</h1>
            <p className="font-mono text-[10px] text-zinc-500">ID: {id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="h-7 w-7 rounded-full border-2 border-black bg-zinc-800" />
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-zinc-700 text-[10px]">
              +2
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Left Sidebar: Activity Feed */}
        <aside className="hidden w-80 border-r border-zinc-900 bg-zinc-950/30 2xl:block">
          <ActivityFeed projectId={id} />
        </aside>

        {/* Main Board Area */}
        <main className="relative flex-1 overflow-x-auto overflow-y-hidden bg-[url('/grid.svg')] bg-center">
          <div className="h-full p-6">
            <KanbanBoard projectId={id} />
          </div>
        </main>
      </div>
    </div>
  )
}
