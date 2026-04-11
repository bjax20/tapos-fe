import axios from "axios"

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
})

// REQUEST INTERCEPTOR: Attach the token to every call
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// RESPONSE INTERCEPTOR: Handle expired tokens
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isUnauthorized = error.response?.status === 401
    // CRITICAL: Don't redirect if we are ALREADY trying to login
    // otherwise you can get stuck in a loop
    const isLoginEndpoint = error.config?.url?.includes("/auth/login")

    if (isUnauthorized && !isLoginEndpoint) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        
        // Use window.location.replace to prevent back-button loops
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login"
        }
      }
    }
    return Promise.reject(error)
  }
)