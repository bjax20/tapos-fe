import { useAuth } from "@/features/auth/api/hooks/use-auth"
import { Project, UserBase } from "@/features/projects/types"

export function useProjectPermissions(project?: Project) {
  const { user } = useAuth()

  if (!project || !user) return { isOwner: false, isMember: false }

  const isOwner = project.ownerId === user.id
  
  const isMember = project.members.some((m: UserBase) => m.id === user.id)

  return { isOwner, isMember, user }
}