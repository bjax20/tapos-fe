import { History} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ActivityFeed } from "@/features/projects/components/activity-feed";
import { KanbanBoard } from "@/features/projects/components/kanban-board";

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const id = parseInt(projectId);

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-black/50 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          {/* Mobile Activity Trigger */}
          <div className="2xl:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 hover:bg-zinc-900 rounded-md">
                  <History size={20} className="text-zinc-400" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80 bg-black border-zinc-800">
                <ActivityFeed projectId={id} />
              </SheetContent>
            </Sheet>
          </div>
          
          <div>
            <h1 className="text-lg font-bold tracking-tight">Project Board</h1>
            <p className="text-[10px] text-zinc-500 font-mono">ID: {id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
             <div className="w-7 h-7 rounded-full border-2 border-black bg-zinc-800" />
             <div className="w-7 h-7 rounded-full border-2 border-black bg-zinc-700 flex items-center justify-center text-[10px]">
               +2
             </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Left Sidebar: Activity Feed */}
        <aside className="hidden 2xl:block w-80 border-r border-zinc-900 bg-zinc-950/30">
           <ActivityFeed projectId={id} />
        </aside>

        {/* Main Board Area */}
        <main className="flex-1 overflow-x-auto overflow-y-hidden relative bg-[url('/grid.svg')] bg-center">
          <div className="h-full p-6">
            <KanbanBoard projectId={id} />
          </div>
        </main>
      </div>
    </div>
  );
}