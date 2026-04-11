"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Task } from "../types"

export function KanbanCard({ task, isOverlay }: { task: Task; isOverlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    animateLayoutChanges: () => true, // Forces cards to glide when others enter
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  // The Ghost: What stays in the column while you drag
  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-24 w-full rounded-lg border border-dashed border-zinc-800/50 bg-zinc-900/20"
      />
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative cursor-grab rounded-lg border border-zinc-800 bg-zinc-900 p-4 transition-all active:cursor-grabbing ${isOverlay ? "z-50 scale-[1.02] border-zinc-500 bg-zinc-800 shadow-2xl" : "shadow-sm hover:border-zinc-700"} `}
    >
      <h4 className="text-sm font-medium text-zinc-100">{task.title}</h4>
      {task.description && <p className="mt-1 line-clamp-1 text-xs text-zinc-500">{task.description}</p>}
      <div className="mt-3 flex items-center font-mono text-[10px] text-zinc-600">#{task.id}</div>
    </div>
  )
}
