"use client"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/services/auth.service';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Persist the token
      localStorage.setItem('token', data.access_token);

      // Immediately invalidate or set the 'auth-user' query 
      // This prevents the app from showing "logged out" state briefly
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });

      //  Redirect to your specific projects route
      router.push('/projects');
    },
    onError: (error: any) => {
      // Logic for failed login (e.g., clearing old tokens)
      localStorage.removeItem('token');
    //   console.error('Login Error:', error);
      const message = error.response?.data?.message || "Invalid credentials";
      toast.error("Login failed", {
        description: Array.isArray(message) ? message[0] : message,
      });
    }
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      // Registration successful, send them to login
      router.push('/login?registered=true'); 
    },
    onError: (error: any) => {
    //   console.error('Registration failed:', error?.response?.data || error.message);
        const message = error.response?.data?.message || "Invalid credentials";
        toast.error("Registration failed", {
            description: Array.isArray(message) ? message[0] : message,
        });
    }
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ['auth-user'],
    queryFn: authApi.getMe,
    // Professional settings for auth:
    retry: false, 
    staleTime: 1000 * 60 * 5, // Consider user data fresh for 5 mins
    // Only run the query if we actually have a token in storage
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'),
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem('token');
    queryClient.clear(); // Wipe the cache
    router.push('/login');
  };

  return logout;
};