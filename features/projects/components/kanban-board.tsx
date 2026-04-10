"use client"

import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd"
import { Loader2, MoreHorizontal } from "lucide-react"
import React, { useState } from "react"
import { TaskComposer } from "./task-composer"
import { TaskDetailModal } from "./task-detail-modal"
import { useKanbanTasks } from "../api/hooks/use-kanban-tasks"
import { TaskStatus } from "../types"

const COLUMNS = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" },
]

export function KanbanBoard({ projectId }: { projectId: number }) {
  const { tasks, isLoading, moveTask, createTask, updateTask, isCreating } = useKanbanTasks(projectId)

  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const activeTask = tasks?.find((t) => t.id === selectedTaskId) || null

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    // FIX: Cast destination.droppableId as TaskStatus
    moveTask(parseInt(draggableId), destination.droppableId as TaskStatus)
  }

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="animate-spin text-zinc-500" />
      </div>
    )
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        {/* The board container: 
        - items-start ensures columns don't stretch to match the tallest column's height.
        - flex-row allows horizontal overflow if columns get too many.
      */}
        <div className="flex flex-col items-start gap-4 pb-10 md:flex-row">
          {COLUMNS.map((column) => (
            <div
              key={column.id}
              className="flex h-auto w-full flex-col rounded-xl border border-zinc-900 bg-zinc-900/30 md:w-[320px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between p-4">
                <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">{column.title}</h2>
                <MoreHorizontal size={14} className="cursor-pointer text-zinc-600" />
              </div>

              {/* Droppable Area:
              - h-auto ensures it grows with content.
              - No internal overflow-y-auto here.
            */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`px-3 pt-1 pb-1 transition-colors duration-200 ${
                      snapshot.isDraggingOver ? "bg-zinc-800/10" : ""
                    }`}
                  >
                    {tasks
                      ?.filter((t) => t.status === column.id)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(dragProvided, dragSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className={`mb-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4 shadow-sm active:cursor-grabbing ${
                                dragSnapshot.isDragging ? "border-zinc-600 shadow-2xl ring-1 ring-zinc-700" : ""
                              }`}
                            >
                              <div
                                onClick={() => setSelectedTaskId(task.id)} // Opens modal
                                className="cursor-pointer bg-zinc-900 transition-all hover:border-zinc-500 ..."
                              >
                                <p className="text-sm font-medium text-zinc-200">{task.title}</p>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}

                    {/* Composer is the very last child of the vertical flow.
                    It sits right under the last card or the placeholder.
                  */}
                    <div className="mt-1 pb-2">
                      <TaskComposer status={column.id as TaskStatus} onAdd={createTask} isPending={isCreating} />
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <TaskDetailModal
        // Key now tracks the live activeTask's ID and title
        key={activeTask ? `${activeTask.id}-${activeTask.title}` : "empty"}
        projectId={projectId}
        task={activeTask} // Pass the fresh found task
        isOpen={!!selectedTaskId} // Open if we have an ID
        onClose={() => setSelectedTaskId(null)} // Clear the ID to close
        onUpdate={updateTask}
      />
    </>
  )
}
