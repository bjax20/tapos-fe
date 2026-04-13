"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authApi } from "@/features/auth/api/services/auth.service"
import { ApiErrorResponse } from "@/types"

export const useLogin = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
      // Invalidate the user query
      queryClient.invalidateQueries({ queryKey: ["auth-user"] })

      // Redirect
      router.push("/projects")
    },
    onError: (error: ApiErrorResponse) => {
      const message = error.message || "Invalid credentials"
      toast.error("Login failed", {
        description: Array.isArray(message) ? message[0] : message,
      })
    },
  })
}

export const useRegister = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      // Registration successful, send them to login
      router.push("/login?registered=true")
    },
    onError: (error: ApiErrorResponse) => {
      //   console.error('Registration failed:', error?.response?.data || error.message);
      const message = error.message || "Invalid credentials"
      toast.error("Registration failed", {
        description: Array.isArray(message) ? message[0] : message,
      })
    },
  })
}

export const useUser = () => {
  return useQuery({
    queryKey: ["auth-user"],
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })
}

export const useLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      // SUCCESS OR FAILURE: We want to clear the local state

      // Clear all React Query cache (removes user data)
      queryClient.clear()

      // Clear old token if it exists
      localStorage.removeItem("token")

      // Send back to login and refresh to reset server components
      router.push("/login")
      router.refresh()

      toast.success("Logged out successfully")
    },
  })
}

export const useAuth = () => {
  const router = useRouter()
  // Get the mutate function from your custom useLogout hook
  const { mutate: performLogout } = useLogout()

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })

  // Update the internal logout to trigger the mutation
  const logout = () => {
    performLogout()
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !isError,
    logout,
    refetchUser: refetch,
  }
}
