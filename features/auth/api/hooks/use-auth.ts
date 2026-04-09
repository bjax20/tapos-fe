import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/auth-api';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token);
      router.push('/dashboard'); // or home
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ['auth-user'],
    queryFn: authApi.getMe,
    retry: false,
  });
};