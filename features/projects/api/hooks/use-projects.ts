import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "@/features/projects/api/services/projects.service";
import { toast } from "sonner";

// Accept filters as an argument to make the hook dynamic
export const useProjects = (filters: { role?: string; page?: number; limit?: number } = {}) => {
  const queryClient = useQueryClient();


  const projectsQuery = useQuery({
    // Include filters in the key so React Query caches "owner" and "member" separately
    queryKey: ["projects", filters],
    queryFn: () => projectService.getAll(filters),
    // Keeps the old data on screen while fetching new filtered data (prevents flickering)
    placeholderData: (previousData) => previousData,
  });

  // Create Project Mutation
  const createProject = useMutation({
    mutationFn: projectService.create,
    onSuccess: () => {
      // Invalidate all "projects" queries to refresh the list regardless of current filter
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project initialized.");
    },
    onError: () => toast.error("Failed to create project."),
  });

  // Delete Project Mutation
  const deleteProject = useMutation({
    mutationFn: projectService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.info("Project removed.");
    },
    onError: () => toast.error("Failed to remove project."),
  });

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
  };
};

export const useProjectDetail = (id: string) => {
  return useQuery({
    queryKey: ["projects", "detail", id], 
    queryFn: () => projectService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // Detail view can stay fresh longer
  });
};