import { apiClient } from "@/lib/api-client"

export interface Project {
  id: number
  title: string
  description: string
  ownerId: number
  memberCount: number
  taskCount: number
  createdAt: string
  role?: "owner" | "member"
}

export interface ApiResponse<T> {
  data: T
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const projectService = {
  // GET /api/v1/projects
  getAll: async (params?: { page?: number; limit?: number; role?: string }) => {
    const { data } = await apiClient.get<ApiResponse<Project[]>>("/projects", {
      params,
    })
    return data // Returns the full object including pagination
  },

  // GET /api/v1/projects/{id}
  getById: async (id: string) => {
    const { data } = await apiClient.get<Project>(`/projects/${id}`)
    return data
  },

  // POST /api/v1/projects
  create: async (payload: Pick<Project, "title" | "description">) => {
    const { data } = await apiClient.post<Project>("/projects", payload)
    return data
  },

  // PATCH /api/v1/projects/{id}
  update: async (id: string, payload: Partial<Project>) => {
    const { data } = await apiClient.patch<Project>(`/projects/${id}`, payload)
    return data
  },

  // DELETE /api/v1/projects/{id}
  delete: async (id: string) => {
    await apiClient.delete(`/projects/${id}`)
  },

  // GET /api/v1/projects/{id}/members
  getMembers: async (id: number) => {
    const { data } = await apiClient.get(`/projects/${id}/members`)
    return data
  },
}
