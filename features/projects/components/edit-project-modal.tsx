"use client"

import { Pencil } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useProjects } from "../api/hooks/use-projects"
import { Project } from "../types"

export function EditProjectModal({ project }: { project: Project }) {
  const [open, setOpen] = useState(false)
  const { update, isUpdating } = useProjects()
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    update(
      { id: project.id, data: formData },
      { onSuccess: () => setOpen(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full bg-zinc-800/50 hover:bg-zinc-700 text-zinc-400 hover:text-white"
          onClick={(e) => e.stopPropagation()} // Crucial: prevents Link navigation
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-50 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Edit Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border-zinc-800 bg-zinc-900/50 focus:border-zinc-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[100px] border-zinc-800 bg-zinc-900/50 focus:border-zinc-500"
            />
          </div>
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isUpdating}
              className="bg-white font-bold text-black hover:bg-zinc-200"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}