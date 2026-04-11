import { useAuth } from "@/features/auth/api/hooks/use-auth"
import { Project, UserBase } from "@/features/projects/types"

export function useProjectPermissions(project?: Project) {
  const { user } = useAuth()

  if (!project || !user) return { isOwner: false, isMember: false }

  const isOwner = project.ownerId === user.id
  
  // Explicitly type 'm' as UserBase (or the specific shape of your member object)
  const isMember = project.members.some((m: UserBase) => m.id === user.id)

  return { isOwner, isMember, user }
}