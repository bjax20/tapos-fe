import { KanbanBoard } from "@/features/projects/components/kanban-board"
import { ActivityFeed } from "@/features/projects/components/activity-feed"
import { ProjectHeader } from "@/features/projects/components/project-header"

interface ProjectPageProps {
  params: Promise<{ projectId: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params
  const id = parseInt(projectId)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-black text-white">
      {/* Client-side Header handles fetching the title */}
      <ProjectHeader projectId={projectId} />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Left Sidebar */}
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