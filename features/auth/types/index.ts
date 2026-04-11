export interface AuthCredentials {
  email: string
  password?: string
}

export interface AuthResponse {
  access_token: string
}

export interface UserProfile {
  id: number
  email: string
  fullName: string
}
