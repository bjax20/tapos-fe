"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function KanbanCard({ task, isOverlay }: { task: any; isOverlay?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id,
    animateLayoutChanges: () => true // Forces cards to glide when others enter
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  // The Ghost: What stays in the column while you drag
  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-24 w-full rounded-lg bg-zinc-900/20 border border-dashed border-zinc-800/50"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative bg-zinc-900 border border-zinc-800 p-4 rounded-lg 
        cursor-grab active:cursor-grabbing group transition-all
        ${isOverlay ? "shadow-2xl border-zinc-500 bg-zinc-800 scale-[1.02] z-50" : "hover:border-zinc-700 shadow-sm"}
      `}
    >
      <h4 className="text-sm font-medium text-zinc-100">{task.title}</h4>
      {task.description && (
        <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{task.description}</p>
      )}
      <div className="mt-3 flex items-center text-[10px] text-zinc-600 font-mono">
        #{task.id}
      </div>
    </div>
  );
}