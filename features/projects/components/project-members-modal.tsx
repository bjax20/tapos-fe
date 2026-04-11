"use client"

import { Loader2, Mail, Plus, Users } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useProjectMembers } from "@/features/projects/api/hooks/use-project-members"
import { User } from "../types"

interface ProjectMembersModalProps {
  projectId: number
  projectTitle: string
}

export function ProjectMembersModal({ projectId, projectTitle }: ProjectMembersModalProps) {
  const [email, setEmail] = useState("")
  const { members, addMember, isAdding, isLoading } = useProjectMembers(projectId)

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    addMember(email, {
      onSuccess: () => setEmail(""), // Clear input on success
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2 text-zinc-400 hover:text-white">
          <Users className="h-4 w-4" />
          <span>Members</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Project Members</DialogTitle>
          <p className="text-sm text-zinc-500">Manage who has access to {projectTitle}</p>
        </DialogHeader>

        {/* Invite Form */}
        <form onSubmit={handleAddMember} className="flex flex-col gap-3 py-4">
          <div className="group relative">
            <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="colleague@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-zinc-800 bg-zinc-900 pl-10 focus:border-zinc-500"
            />
          </div>
          <Button disabled={isAdding || !email} className="bg-white text-black hover:bg-zinc-200">
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Add Member
          </Button>
        </form>

        {/* Members List */}
        <div className="max-h-[300px] space-y-4 overflow-y-auto pr-2">
          <h4 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
            Current Members ({members.length})
          </h4>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-zinc-500" />
            </div>
          ) : (
            members.map((member: User) => (
              <div key={member.id} className="group flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-zinc-800">
                    {/* TODO: Add avatar image */}
                    {/* <AvatarImage src={member.avatarUrl} /> */}
                    <AvatarFallback className="bg-zinc-800 text-[10px]">
                      {member.fullName?.charAt(0) || member.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{member.fullName || "Pending..."}</span>
                    <span className="text-[11px] text-zinc-500">{member.email}</span>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-zinc-600 uppercase transition-colors group-hover:text-zinc-400">
                    {/* TODO: Add role badge */}
                  {/* {member.role} */}
                  User
                </span>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
