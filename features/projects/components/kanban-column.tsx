"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanCard } from "./kanban-card";
import { Task } from "../types";

export function KanbanColumn({ id, title, tasks }: { id: string; title: string; tasks: Task[] }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col w-80 shrink-0 bg-zinc-950/40 rounded-xl border border-zinc-900 shadow-sm overflow-hidden">
      <div className="p-4 flex items-center justify-between bg-zinc-950/80 border-b border-zinc-900">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{title}</h3>
        <span className="text-[10px] bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded-md border border-zinc-800">
          {tasks.length}
        </span>
      </div>

      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div 
          ref={setNodeRef} 
          className={`flex-1 p-3 flex flex-col gap-3 min-h-[200px] transition-colors duration-200 ${
            isOver ? "bg-white/[0.02]" : ""
          }`}
        >
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
          
          {tasks.length === 0 && (
            <div className="flex-1 border-2 border-dashed border-zinc-900/50 rounded-lg flex items-center justify-center text-zinc-700 text-xs">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}