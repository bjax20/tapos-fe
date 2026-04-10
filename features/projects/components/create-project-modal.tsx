"use client";

import { useState } from "react";
import { useProjects } from "@/features/projects/api/hooks/use-projects";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export function CreateProjectModal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // 1. New state
  const { create, isCreating } = useProjects();

  const handleCreate = () => {
    if (!title) return;
    
  
    create({ title, description }, {
      onSuccess: () => {
        setOpen(false); 
        setTitle("");   
        setDescription(""); 
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-black hover:bg-zinc-200 rounded-lg px-5 font-bold transition-all active:scale-95">
          <Plus className="w-4 h-4 mr-2" strokeWidth={3} />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Create Workspace</DialogTitle>
          <DialogDescription className="text-zinc-500">
            What are you working on? Give your project a name to get started.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-zinc-400 text-xs uppercase tracking-widest">Project Name</Label>
            <Input
              id="name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mobile App Redesign"
              className="bg-zinc-900 border-zinc-800 focus:ring-zinc-400"
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-zinc-400 text-xs uppercase tracking-widest">
              Description <span className="text-zinc-600">(Optional)</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe the project goals..."
              className="bg-zinc-900 border-zinc-800 focus:ring-zinc-400 resize-none min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleCreate} 
            disabled={isCreating || !title}
            className="w-full bg-white text-black hover:bg-zinc-200 font-bold"
          >
            {isCreating ? "Creating..." : "Initialize Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}