import axios from "axios"

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // This is the "magic" that sends the cookie
})

// REQUEST INTERCEPTOR: We no longer need to attach Bearer tokens from localStorage
apiClient.interceptors.request.use((config) => {
  return config
})

// RESPONSE INTERCEPTOR: Handle expired sessions
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isUnauthorized = error.response?.status === 401
    const isLoginEndpoint = error.config?.url?.includes("/auth/login")

    if (isUnauthorized && !isLoginEndpoint) {
      if (typeof window !== "undefined") {
        // We don't need to remove 'token' from localStorage because it's in a cookie now
        
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login"
        }
      }
    }
    return Promise.reject(error)
  }
)