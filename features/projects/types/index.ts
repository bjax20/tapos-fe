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

// Matches UserBaseDto from NestJS
export interface UserBase {
  id: number;
  email: string;
  fullName: string;
}

// Matches ProjectDetailResponseDto exactly
export interface Project {
  id: number;
  title: string;
  description: string | null;
  ownerId: number;
  owner: UserBase;
  members: UserBase[];
  taskCount: number;
  createdAt: string; // ISO string from JSON
  role?: "owner" | "member"; // UI-only helper
  memberCount?: number;      // Summary helper
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
  assignee?: UserBase | null;
}

export interface ChangeLog {
  id: number;
  action: string;
  details?: string | null;
  taskId?: number | null;
  projectId: number;
  userId: number;
  createdAt: string;
  user?: Pick<User, "email">;
  task?: Pick<Task, "title">;
}

export interface ApiResponse<T> {
  data: T;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Payloads
export interface CreateTaskPayload {
  title: string;
  description?: string;
  assigneeId?: number;
}

export interface UpdateTaskStatusPayload {
  status: TaskStatus;
}