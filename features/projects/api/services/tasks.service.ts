import { apiClient } from "@/lib/api-client"
import { ChangeLog, Task, TaskStatus } from "../../types/index" // Import your types/interfaces

export const taskService = {
  /**
   * GET /api/v1/projects/{projectId}/tasks
   * List all tasks for a specific project
   */
  async getTasks(projectId: number): Promise<Task[]> {
    const { data } = await apiClient.get<Task[]>(`/projects/${projectId}/tasks`)
    return data
  },

  /**
   * POST /api/v1/projects/{projectId}/tasks
   * Create a task and trigger audit log
   */
  async createTask(
    projectId: number,
    payload: { title: string; description?: string; assigneeId?: number }
  ): Promise<Task> {
    const { data } = await apiClient.post<Task>(`/projects/${projectId}/tasks`, payload)
    return data
  },

  async updateTask(projectId: number, taskId: number, updates: Partial<Task>): Promise<Task> {
    const { data } = await apiClient.patch<Task>(`/projects/${projectId}/tasks/${taskId}`, updates)
    return data
  },

  /** BACKUP
   * PATCH /api/v1/projects/{projectId}/tasks/{taskId}/status
   * Update task status (for Kanban drag-and-drop)
   */
  async updateTaskStatus(projectId: number, taskId: number, status: TaskStatus): Promise<Task> {
    const { data } = await apiClient.patch<Task>(`/projects/${projectId}/tasks/${taskId}/status`, { status })
    return data
  },

  /**
   * PATCH /api/v1/projects/{projectId}/tasks/{taskId}/move
   * Unified move for both Status and Position
   */
  async moveTask(
    projectId: number,
    taskId: number,
    payload: { status?: TaskStatus; position?: number }
  ): Promise<Task> {
    const { data } = await apiClient.patch<Task>(`/projects/${projectId}/tasks/${taskId}/move`, payload)
    return data
  },

  /**
   * DELETE /api/v1/projects/{projectId}/tasks/{taskId}
   */
  async deleteTask(projectId: number, taskId: number): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/tasks/${taskId}`)
  },

  /**
   * GET /api/v1/projects/{projectId}/tasks/logs
   * Get activity feed for the entire project
   */
  async getProjectLogs(projectId: number): Promise<ChangeLog[]> {
    const { data } = await apiClient.get<ChangeLog[]>(`/projects/${projectId}/tasks/logs`)
    return data
  },

  /**
   * GET /api/v1/projects/{projectId}/tasks/{taskId}/logs
   * Get activity feed for a specific task
   */
  async getTaskLogs(projectId: number, taskId: number): Promise<ChangeLog[]> {
    const { data } = await apiClient.get<ChangeLog[]>(`/projects/${projectId}/tasks/${taskId}/logs`)
    return data
  },
}
