import axios from "axios"

export const apiClient = axios.create({
  // This automatically switches based on your environment
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
})

apiClient.interceptors.request.use((config) => {
  // Ensure we are in the browser before touching localStorage
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})
