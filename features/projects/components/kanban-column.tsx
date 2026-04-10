"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { KanbanCard } from "./kanban-card"
import { Task } from "../types"

export function KanbanColumn({ id, title, tasks }: { id: string; title: string; tasks: Task[] }) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div className="flex w-80 shrink-0 flex-col overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950/40 shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-900 bg-zinc-950/80 p-4">
        <h3 className="text-xs font-bold tracking-widest text-zinc-400 uppercase">{title}</h3>
        <span className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-500">
          {tasks.length}
        </span>
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`flex min-h-[200px] flex-1 flex-col gap-3 p-3 transition-colors duration-200 ${
            isOver ? "bg-white/[0.02]" : ""
          }`}
        >
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}

          {tasks.length === 0 && (
            <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-zinc-900/50 text-xs text-zinc-700">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}
