import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { taskService } from "@/features/projects/api/services/tasks.service";
import { Task, TaskStatus } from "../../types/index";

export const useKanbanTasks = (projectId: number) => {
  const queryClient = useQueryClient();
  const queryKey = ["tasks", projectId];
  const logsQueryKey = ["project-logs", projectId];
  
  const [tempTasks, setTempTasks] = useState<Task[] | null>(null);

  const { data: serverTasks = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => taskService.getTasks(projectId),
  });

  const tasks = useMemo(() => tempTasks ?? serverTasks, [tempTasks, serverTasks]);

  //  Generic Update Mutation (For Title, Description, Assignee) 
  // in useKanbanTasks.ts

const updateTaskMutation = useMutation({
  mutationFn: ({ taskId, updates }: { taskId: number; updates: Partial<Task> }) => 
    taskService.updateTask(projectId, taskId, updates),

  onMutate: async ({ taskId, updates }) => {
    await queryClient.cancelQueries({ queryKey });
    const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

    // --- FIX: Update the tempTasks shield here too! ---
    const optimistic = tasks.map((t) => 
      t.id === taskId ? { ...t, ...updates } : t
    );
    setTempTasks(optimistic); 

    // Still update the cache for background safety
    queryClient.setQueryData<Task[]>(queryKey, optimistic);

    return { previousTasks };
  },

  // onSuccess: (updatedData) => {
  //   // If server returns the list, keep it in sync
  //   queryClient.setQueryData(queryKey, updatedData);
  // },

  onError: (err, variables, context) => {
    queryClient.setQueryData(queryKey, context?.previousTasks);
    setTempTasks(null); // Clear the shield on error
    toast.error("Update failed");
  },

  onSettled: () => {
    setTempTasks(null); // --- FIX: Clear the shield so serverTasks takes over ---
    queryClient.invalidateQueries({ queryKey });
  },
});

  //  Existing Status/Move Mutation (Optimistic) ---
  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: number; status: TaskStatus }) =>
      taskService.updateTaskStatus(projectId, taskId, status),
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueryData<Task[]>(queryKey, (old) =>
        old?.map((task) => (task.id === taskId ? { ...task, status } : task))
      );

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousTasks);
      toast.error("Failed to move task");
    },
    onSettled: () => {
      setTempTasks(null); 
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: logsQueryKey });
    },
  });

  // Create Mutation ---
  const createTaskMutation = useMutation({
    mutationFn: (payload: { title: string; status: TaskStatus }) =>
      taskService.createTask(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: logsQueryKey });
    },
    onError: () => toast.error("Failed to create task"),
  });

  const moveTask = (taskId: number, newStatus: TaskStatus) => {
    const optimisticTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    setTempTasks(optimisticTasks);
    updateStatusMutation.mutate({ taskId, status: newStatus });
  };

  const createTask = (title: string, status: TaskStatus) => {
    return createTaskMutation.mutateAsync({ title, status });
  };

  // --- 4. Exposed Update Method ---
  const updateTask = (taskId: number, updates: Partial<Task>) => {
    updateTaskMutation.mutate({ taskId, updates });
  };

  return {
    tasks,
    isLoading,
    moveTask,
    createTask,
    updateTask, 
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
  };
};