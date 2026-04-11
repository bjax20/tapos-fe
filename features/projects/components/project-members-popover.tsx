"use client"

import { useState } from "react"
import { Check, Loader2, Mail, Plus, ShieldCheck, UserPlus } from "lucide-react"
import { useProjectMembers } from "@/features/projects/api/hooks/use-project-members"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// Update this interface based on your actual data structure
interface Member {
  id: number
  email: string
  fullName?: string 
  isOwner: boolean
}

interface Props {
  projectId: number
}

export function ProjectMembersPopover({ projectId }: Props) {
  const [email, setEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const { members, addMember, isAdding, isLoading } = useProjectMembers(projectId)

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    addMember(email, {
      onSuccess: () => {
        setEmail("")
        setIsInviting(false)
      }
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center -space-x-2 transition-transform hover:scale-105 active:scale-95 outline-none">
          {members.slice(0, 3).map((member: Member) => (
            <Avatar key={member.id} className="h-8 w-8 border-2 border-black">
              <AvatarFallback className="bg-zinc-800 text-[10px]">
                {member.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
          {members.length > 3 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-zinc-700 text-[10px] font-bold">
              +{members.length - 3}
            </div>
          )}
          {members.length === 0 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-zinc-700 bg-zinc-900 text-zinc-500">
               <UserPlus size={14} />
            </div>
          )}
        </button>
      </PopoverTrigger>
      
      <PopoverContent align="end" className="w-80 border-zinc-800 bg-zinc-950 p-0 shadow-2xl">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-zinc-100">Project Members</h4>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-zinc-400"
              onClick={() => setIsInviting(!isInviting)}
            >
              <Plus className={`h-4 w-4 transition-transform ${isInviting ? 'rotate-45' : ''}`} />
            </Button>
          </div>

          {isInviting && (
            <form onSubmit={handleInvite} className="space-y-2 mb-4 animate-in fade-in slide-in-from-top-1">
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                <Input
                  autoFocus
                  placeholder="Email address..."
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 pl-8 bg-zinc-900 border-zinc-800 text-xs focus-visible:ring-1 focus-visible:ring-zinc-700"
                />
              </div>
              <Button disabled={isAdding || !email} size="sm" className="w-full bg-zinc-100 text-black hover:bg-white h-8 text-xs font-bold">
                {isAdding ? <Loader2 className="h-3 w-3 animate-spin" /> : "Send Invite"}
              </Button>
            </form>
          )}

          <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="flex justify-center py-4"><Loader2 className="h-4 w-4 animate-spin text-zinc-600" /></div>
            ) : (
              members.map((member: Member) => (
                <div key={member.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-zinc-900 text-[10px] border border-zinc-800 text-zinc-400">
                        {member.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-xs font-medium text-zinc-200 truncate max-w-[140px]">
                        {/* Fallback to email prefix if fullName is missing */}
                        {member.fullName || member.email.split('@')[0]}
                      </p>
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">
                        {member.isOwner ? "Owner" : "Member"}
                      </p>
                    </div>
                  </div>
                  {member.isOwner && (
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500/50" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <Separator className="bg-zinc-900" />
        <div className="p-2">
           <Button variant="ghost" className="w-full justify-start text-[10px] text-zinc-500 h-8 hover:text-zinc-300">
             Manage Access
           </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}