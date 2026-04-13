import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { projectService } from "@/features/projects/api/services/projects.service"

// Accept filters as an argument to make the hook dynamic
export const useProjects = (filters: { role?: string; page?: number; limit?: number } = {}) => {
  const queryClient = useQueryClient()

  const projectsQuery = useQuery({
    // Include filters in the key so React Query caches "owner" and "member" separately
    queryKey: ["projects", filters],
    queryFn: () => projectService.getAll(filters),
    // Keeps the old data on screen while fetching new filtered data (prevents flickering)
    placeholderData: (previousData) => previousData,
  })

  // Create Project Mutation
  const createProject = useMutation({
    mutationFn: projectService.create,
    onSuccess: () => {
      // Invalidate all "projects" queries to refresh the list regardless of current filter
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      toast.success("Project initialized.")
    },
    onError: () => toast.error("Failed to create project."),
  })

  const updateProject = useMutation({
    // Assumes your projectService has an update method: (id, data) => ...
    mutationFn: ({ id, data }: { id: number; data: { title?: string; description?: string } }) =>
      projectService.update(id, data),
    onSuccess: () => {
      // Refresh the list
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      // Also refresh the specific detail view if it's open
      queryClient.invalidateQueries({ queryKey: ["projects", "detail"] })

      toast.success("Project updated successfully.")
    },
    onError: () => toast.error("Failed to update project."),
  })

  // Delete Project Mutation
  const deleteProject = useMutation({
    mutationFn: projectService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      toast.info("Project removed.")
    },
    onError: () => toast.error("Failed to remove project."),
  })

  return {
    // Access the 'data' property inside the API response
    projects: projectsQuery.data?.data ?? [],
    pagination: projectsQuery.data?.pagination,
    isLoading: projectsQuery.isLoading,
    isFetching: projectsQuery.isFetching,
    create: createProject.mutate,
    isCreating: createProject.isPending,
    remove: deleteProject.mutate,
    isDeleting: deleteProject.isPending,
    update: updateProject.mutate,
    isUpdating: updateProject.isPending,
  }
}

export const useProjectDetail = (id: string) => {
  return useQuery({
    queryKey: ["projects", "detail", id],
    queryFn: () => projectService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}
