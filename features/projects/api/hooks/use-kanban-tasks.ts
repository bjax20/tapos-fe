import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"
import { taskService } from "@/features/projects/api/services/tasks.service"
import { Task, TaskStatus } from "../../types/index"

export const useKanbanTasks = (projectId: number) => {
  const queryClient = useQueryClient()
  const queryKey = ["tasks", projectId]
  const logsQueryKey = ["project-logs", projectId]

  const [tempTasks, setTempTasks] = useState<Task[] | null>(null)

  const { data: serverTasks = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => taskService.getTasks(projectId),
  })

  // --- FIX 1: Stable Sorting ---
  const tasks = useMemo(() => {
    const baseTasks = tempTasks ?? serverTasks
    return [...baseTasks].sort((a, b) => {
      if (a.position !== b.position) {
        return (a.position ?? 0) - (b.position ?? 0)
      }
      return a.id - b.id // Tie-breaker for duplicate positions
    })
  }, [tempTasks, serverTasks])

  const moveTaskMutation = useMutation({
    mutationFn: ({ taskId, status, position }: { taskId: number; status?: TaskStatus; position?: number }) =>
      taskService.moveTask(projectId, taskId, { status, position }),
    onMutate: async ({ taskId, status, position }) => {
      await queryClient.cancelQueries({ queryKey })
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey) || []

      const optimistic = previousTasks.map((t) =>
        t.id === taskId ? { ...t, ...(status && { status }), ...(position !== undefined && { position }) } : t
      )

      queryClient.setQueryData<Task[]>(queryKey, optimistic)
      return { previousTasks }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousTasks)
      toast.error("Failed to move task")
      setTempTasks(null) // Clear on error too
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: logsQueryKey })
      // Clear tempTasks AFTER invalidation and refetch complete
      setTempTasks(null)
    },
  })

  // --- 2. Create Mutation ---
  const createTaskMutation = useMutation({
    mutationFn: (payload: { title: string; status: TaskStatus }) => taskService.createTask(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: logsQueryKey })
    },
    onError: () => toast.error("Failed to create task"),
  })

  // --- 3. Update Mutation (Title, Description, etc.) ---
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, updates }: { taskId: number; updates: Partial<Task> }) =>
      taskService.updateTask(projectId, taskId, updates),
    onMutate: async ({ taskId, updates }) => {
      await queryClient.cancelQueries({ queryKey })
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey) || []
      const optimistic = previousTasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
      queryClient.setQueryData<Task[]>(queryKey, optimistic)
      return { previousTasks }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousTasks)
      toast.error("Update failed")
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  // --- 4. Delete Mutation ---
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: number) => taskService.deleteTask(projectId, taskId),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey })
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey) || []
      queryClient.setQueryData<Task[]>(
        queryKey,
        previousTasks.filter((t) => t.id !== taskId)
      )
      return { previousTasks }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousTasks)
      toast.error("Failed to delete task")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: logsQueryKey })
    },
  })

  // --- Exposed Handlers ---

  const moveTask = useCallback(
    async (taskId: number, newStatus: TaskStatus, newPosition: number) => {

      // Set UI lock
      const optimistic = tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus, position: newPosition } : t))
      setTempTasks(optimistic)

      try {
        // Wait for server response
        await moveTaskMutation.mutateAsync({
          taskId,
          status: newStatus,
          position: newPosition,
        })

        // ✅ DO NOT clear tempTasks here
        // Let onSettled handle it after invalidation completes
      } catch (e) {
        // Error handled by mutation onError
      }
      // ✅ Remove the finally block entirely
    },
    [tasks, moveTaskMutation, queryClient, queryKey]
  )

  // Rest of your exports...
  return {
    tasks,
    isLoading,
    moveTask,
    createTask: (title: string, status: TaskStatus) => createTaskMutation.mutateAsync({ title, status }),
    updateTask: (taskId: number, updates: Partial<Task>) => updateTaskMutation.mutate({ taskId, updates }),
    deleteTask: (taskId: number) => deleteTaskMutation.mutate(taskId),
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending || moveTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  }
}
