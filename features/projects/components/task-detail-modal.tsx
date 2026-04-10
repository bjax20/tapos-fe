"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { taskService } from "@/features/projects/api/services/tasks.service";
import { projectService } from "@/features/projects/api/services/projects.service";
import { Task } from "../types";
import { formatDistanceToNow } from "date-fns";
import { AlignLeft, Layout, User2, MessageSquare, Tag, Trash2, ShieldAlert, Edit2, Check, X } from "lucide-react";

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (taskId: number, updates: Partial<Task>) => void;
  projectId: number;
}

export function TaskDetailModal({ task, isOpen, onClose, onUpdate, projectId }: TaskDetailModalProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const titleStyles = "text-xl sm:text-2xl font-extrabold leading-tight tracking-tight";
  const { data: logs } = useQuery({
    queryKey: ["task-logs", task?.id],
    queryFn: () => taskService.getTaskLogs(projectId, task!.id),
    enabled: !!task && isOpen,
  });

  const { data: members } = useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () => projectService.getMembers(projectId),
    enabled: isOpen,
  });

  if (!task) return null;

  const handleStartEditing = () => {
    setTempTitle(task.title);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (tempTitle.trim() !== "" && tempTitle !== task.title) {
      onUpdate(task.id, { title: tempTitle });
    }
    setIsEditingTitle(false);
  };

  const handleCancelEdit = () => {
    setIsEditingTitle(false);
  };
 
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[94vw] !max-w-[94vw] h-[92vh] sm:!w-[90vw] sm:!max-w-[90vw] sm:h-[90vh] flex flex-col bg-[#0b0b0c] border-zinc-800 text-white p-0 gap-0 overflow-hidden outline-none rounded-2xl !translate-x-[-50%] !translate-y-[-50%]">
        <DialogHeader className="sr-only"> 
          <DialogTitle>{task.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">
          
          {/* LEFT SIDE: Title -> Description -> Management */}
          <div className="w-full md:flex-[2.5] p-6 sm:p-10 space-y-8 border-b md:border-b-0 md:border-r border-zinc-900/50 md:overflow-y-auto custom-scrollbar">
            
            {/* 1. Header/Title Section */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Layout className="text-blue-500 shrink-0 mt-1" size={20} />
                
                {isEditingTitle ? (
                  <div className="flex flex-col gap-2 w-full">
                    <input
                    autoFocus
                    className={`bg-zinc-900/50 border border-blue-600/30 rounded-md px-2 -ml-2 w-full ${titleStyles}`}
                    defaultValue={task.title} // Use defaultValue instead of value
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const newTitle = e.currentTarget.value;
                        if (newTitle.trim() !== "" && newTitle !== task.title) {
                          onUpdate(task.id, { title: newTitle });
                        }
                        setIsEditingTitle(false);
                      }
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                    // Use onBlur to save if they click away
                    onBlur={(e) => {
                      const newTitle = e.target.value;
                      if (newTitle.trim() !== "" && newTitle !== task.title) {
                        onUpdate(task.id, { title: newTitle });
                      }
                      setIsEditingTitle(false);
                    }}/>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handleSaveTitle}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
                      >
                        <Check size={14} /> Save
                      </button>
                      <button 
                        onClick={handleCancelEdit}
                        className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1 rounded text-xs font-bold transition-colors"
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between w-full group">
                    <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">
                      {task.title}
                    </h2>
                    <button 
                      onClick={handleStartEditing}
                      className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded uppercase font-bold text-zinc-400 hover:text-white"
                    >
                      <Edit2 size={12} /> Rename
                    </button>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-zinc-500 ml-8 uppercase tracking-widest font-bold">
                Project Task Detail
              </p>
            </div>

            {/* 2. Description Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-zinc-100">
                <AlignLeft size={18} className="text-zinc-500" />
                <h3 className="text-md font-bold uppercase tracking-tight">Description</h3>
              </div>
              <div className="ml-0 sm:ml-7">
                <Textarea
                  placeholder="Add a more detailed description..."
                  defaultValue={task.description || ""}
                  onBlur={(e) => {
                    if (e.target.value !== task.description) {
                      onUpdate(task.id, { description: e.target.value });
                    }
                  }}
                  className="min-h-[180px] w-full bg-zinc-900/20 border-zinc-800 focus:ring-1 focus:ring-zinc-700 text-base leading-relaxed p-4 rounded-xl resize-none placeholder:text-zinc-800"
                />
              </div>
            </div>

            {/* 3. Management Controls */}
            <div className="space-y-4 pt-4 border-t border-zinc-900/50">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Properties & Actions</h3>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Assignee */}
                  <div className="space-y-2 bg-zinc-900/30 p-3 rounded-lg border border-zinc-800/50">
                    <label className="text-[9px] font-bold uppercase text-zinc-500 flex items-center gap-2">
                      <User2 size={12} /> Assignee
                    </label>
                    <Select 
                      defaultValue={task.assigneeId?.toString()} 
                      onValueChange={(val) => onUpdate(task.id, { assigneeId: parseInt(val) })}
                    >
                      <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs">
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        {members?.map((m) => (
                          <SelectItem key={m.id} value={m.id.toString()}>{m.email}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status */}
                  <div className="space-y-2 bg-zinc-900/30 p-3 rounded-lg border border-zinc-800/50">
                    <label className="text-[9px] font-bold uppercase text-zinc-500 flex items-center gap-2">
                      <Tag size={12} /> Status
                    </label>
                    <Select 
                      defaultValue={task.status} 
                      onValueChange={(val) => onUpdate(task.id, { status: val })}
                    >
                      <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                         <SelectItem value="TODO">To Do</SelectItem>
                         <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                         <SelectItem value="DONE">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Delete */}
                  <div className="space-y-2 bg-red-950/5 p-3 rounded-lg border border-red-900/10">
                    <label className="text-[9px] font-bold uppercase text-red-500/70 flex items-center gap-2">
                      <ShieldAlert size={12} /> Danger Zone
                    </label>
                    <button className="flex items-center justify-center gap-2 w-full h-8 bg-red-950/20 hover:bg-red-950/40 text-red-500 text-[10px] font-bold rounded transition-all">
                      <Trash2 size={12} /> Delete Task
                    </button>
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT SIDE: Activity Stream */}
          <div className="w-full md:flex-1 bg-zinc-950/50 flex flex-col md:overflow-hidden">
            <div className="p-6 border-b border-zinc-900 flex items-center gap-3 shrink-0">
              <MessageSquare size={18} className="text-zinc-500" />
              <h3 className="font-bold text-sm tracking-tight uppercase tracking-widest text-[11px]">Activity</h3>
            </div>
            
            <div className="flex-1 md:overflow-y-auto p-6 space-y-6 custom-scrollbar min-h-[300px]">
              {logs?.length === 0 ? (
                <p className="text-zinc-600 text-[10px] italic text-center py-10">No recent activity.</p>
              ) : (
                logs?.map((log) => (
                  <div key={log.id} className="relative pl-6 border-l border-zinc-800">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-zinc-800" />
                    <p className="text-sm text-zinc-400 leading-snug">{log.details}</p>
                    <time className="text-[9px] text-zinc-600 mt-2 block font-mono uppercase tracking-tighter">
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
  );
}