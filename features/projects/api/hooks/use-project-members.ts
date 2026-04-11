import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiErrorResponse } from "@/types"
import { projectService } from "../services/projects.service";

export const useProjectMembers = (projectId: number) => {
  const queryClient = useQueryClient();

  const membersQuery = useQuery({
    queryKey: ["projects", projectId, "members"],
    queryFn: () => projectService.getMembers(projectId),
    enabled: !!projectId,
  });

  const addMemberMutation = useMutation({
    mutationFn: (email: string) => projectService.addMember(projectId, email),
    onSuccess: () => {
      // Refresh the member list and the project count on the dashboard
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "members"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Member added successfully");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(error?.message || "Failed to add member");
    },
  });

  return {
    members: membersQuery.data ?? [],
    isLoading: membersQuery.isLoading,
    addMember: addMemberMutation.mutate,
    isAdding: addMemberMutation.isPending,
  };
};