"use client"

import { useQuery } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { AlignLeft, Check, Edit2, Layout, MessageSquare, ShieldAlert, Tag, Trash2, User2, X } from "lucide-react"
import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { projectService } from "@/features/projects/api/services/projects.service"
import { taskService } from "@/features/projects/api/services/tasks.service"
import { Task, TaskStatus, User } from "../types"

interface TaskDetailModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (taskId: number, updates: Partial<Task>) => void
  onMove: (taskId: number, status: TaskStatus, position: number) => void
  onDelete: (taskId: number) => void 
  projectId: number
}

export function TaskDetailModal({ 
  task, 
  isOpen, 
  onClose, 
  onUpdate, 
  onMove, 
  onDelete, 
  projectId 
}: TaskDetailModalProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [tempTitle, setTempTitle] = useState("")
  const titleStyles = "text-xl sm:text-2xl font-extrabold leading-tight tracking-tight"

  // Fetching logs
  const { data: logs } = useQuery({
    queryKey: ["task-logs", task?.id],
    queryFn: () => taskService.getTaskLogs(projectId, task!.id),
    enabled: !!task && isOpen,
  })

  // Fetching project members for assignee dropdown
  const { data: members } = useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () => projectService.getMembers(projectId),
    enabled: isOpen,
  })

  if (!task) return null

  const handleStartEditing = () => {
    setTempTitle(task.title)
    setIsEditingTitle(true)
  }

  const handleSaveTitle = () => {
    if (tempTitle.trim() !== "" && tempTitle !== task.title) {
      onUpdate(task.id, { title: tempTitle })
    }
    setIsEditingTitle(false)
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete(task.id)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex h-[92vh] !w-[94vw] !max-w-[94vw] !translate-x-[-50%] !translate-y-[-50%] flex-col gap-0 overflow-hidden rounded-2xl border-zinc-800 bg-[#0b0b0c] p-0 text-white outline-none sm:h-[90vh] sm:!w-[90vw] sm:!max-w-[90vw]">
        <DialogHeader className="sr-only">
          <DialogTitle>{task.title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
          {/* LEFT SIDE */}
          <div className="custom-scrollbar w-full space-y-8 border-b border-zinc-900/50 p-6 sm:p-10 md:flex-[2.5] md:overflow-y-auto md:border-r md:border-b-0">
            
            {/* 1. Title Section */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Layout className="mt-1 shrink-0 text-blue-500" size={20} />
                {isEditingTitle ? (
                  <div className="flex w-full flex-col gap-2">
                    <input
                      autoFocus
                      className={`-ml-2 w-full rounded-md border border-blue-600/30 bg-zinc-900/50 px-2 ${titleStyles} outline-none`}
                      defaultValue={task.title}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const newTitle = e.currentTarget.value
                          if (newTitle.trim() !== "" && newTitle !== task.title) {
                            onUpdate(task.id, { title: newTitle })
                          }
                          setIsEditingTitle(false)
                        }
                        if (e.key === "Escape") setIsEditingTitle(false)
                      }}
                      onBlur={(e) => {
                        const newTitle = e.target.value
                        if (newTitle.trim() !== "" && newTitle !== task.title) {
                          onUpdate(task.id, { title: newTitle })
                        }
                        setIsEditingTitle(false)
                      }}
                    />
                  </div>
                ) : (
                  <div className="group flex w-full items-start justify-between">
                    <h2 className="text-xl leading-tight font-extrabold sm:text-2xl">{task.title}</h2>
                    <button onClick={handleStartEditing} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-800 rounded text-zinc-500">
                      <Edit2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Description Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-zinc-100">
                <AlignLeft size={18} className="text-zinc-500" />
                <h3 className="text-md font-bold tracking-tight uppercase">Description</h3>
              </div>
              <Textarea
                placeholder="Add a more detailed description..."
                defaultValue={task.description || ""}
                onBlur={(e) => {
                  if (e.target.value !== task.description) {
                    onUpdate(task.id, { description: e.target.value })
                  }
                }}
                className="min-h-[180px] w-full resize-none border-zinc-800 bg-zinc-900/20 p-4 text-base focus:ring-1 focus:ring-zinc-700"
              />
            </div>

            {/* 3. Management Controls */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-6 border-t border-zinc-900/50">
              {/* Assignee */}
              <div className="space-y-2 rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-3">
                <label className="flex items-center gap-2 text-[9px] font-bold text-zinc-500 uppercase"><User2 size={12} /> Assignee</label>
                <Select
                  defaultValue={task.assigneeId?.toString()}
                  onValueChange={(val) => onUpdate(task.id, { assigneeId: parseInt(val) })}
                >
                  <SelectTrigger className="h-8 border-zinc-800 bg-zinc-950 text-xs text-white">
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-800 bg-zinc-900 text-white">
                    {members?.map((m: User) => (
                      <SelectItem key={m.id} value={m.id.toString()}>{m.email}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status - CRITICAL UPDATE: Uses onMove */}
              <div className="space-y-2 rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-3">
                <label className="flex items-center gap-2 text-[9px] font-bold text-zinc-500 uppercase"><Tag size={12} /> Status</label>
                <Select
                  value={task.status} // Controlled value so it stays in sync
                  onValueChange={(val) => onMove(task.id, val as TaskStatus, task.position)}
                >
                  <SelectTrigger className="h-8 border-zinc-800 bg-zinc-950 text-xs text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-800 bg-zinc-900 text-white">
                    <SelectItem value="TODO">To Do</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="DONE">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Delete */}
              <div className="space-y-2 rounded-lg border border-red-900/10 bg-red-950/5 p-3">
                <label className="flex items-center gap-2 text-[9px] font-bold text-red-500/70 uppercase"><ShieldAlert size={12} /> Danger Zone</label>
                <button 
                  onClick={handleDelete}
                  className="flex h-8 w-full items-center justify-center gap-2 rounded bg-red-950/20 text-[10px] font-bold text-red-500 transition-all hover:bg-red-950/40"
                >
                  <Trash2 size={12} /> Delete Task
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Activity */}
          <div className="flex w-full flex-col bg-zinc-950/50 md:flex-1 md:overflow-hidden">
             <div className="flex shrink-0 items-center gap-3 border-b border-zinc-900 p-6">
               <MessageSquare size={18} className="text-zinc-500" />
               <h3 className="text-[11px] font-bold uppercase tracking-widest">Activity</h3>
             </div>
             <div className="custom-scrollbar min-h-[300px] flex-1 space-y-6 p-6 md:overflow-y-auto">
               {logs?.length === 0 ? (
                 <p className="py-10 text-center text-[10px] text-zinc-600 italic">No recent activity.</p>
               ) : (
                 logs?.map((log) => (
                   <div key={log.id} className="relative border-l border-zinc-800 pl-6">
                     <div className="absolute top-1 -left-[5px] h-2 w-2 rounded-full bg-zinc-800" />
                     <p className="text-sm leading-snug text-zinc-400">{log.details}</p>
                     <time className="mt-2 block font-mono text-[9px] text-zinc-600 uppercase">
                       {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                     </time>
                   </div>
                 ))
               )}
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}