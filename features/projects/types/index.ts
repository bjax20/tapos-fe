export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  ownerId: number;
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  projectId: number;
  assigneeId?: number | null;
  createdAt: string;
  updatedAt: string;
  // Included relations from your service (findAllByProject)
  assignee?: Pick<User, "id" | "email"> | null;
}

export interface ChangeLog {
  id: number;
  action: string;
  details?: string | null;
  taskId?: number | null;
  projectId: number;
  userId: number;
  createdAt: string;
  // Included relations from your service (findProjectLogs)
  user?: Pick<User, "email">;
  task?: Pick<Task, "title">;
}

// DTO equivalents for frontend forms
export interface CreateTaskPayload {
  title: string;
  description?: string;
  assigneeId?: number;
}

export interface UpdateTaskStatusPayload {
  status: TaskStatus;
}