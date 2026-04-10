import { apiClient } from '@/lib/api-client';
import { AuthCredentials, AuthResponse, UserProfile } from '../../types/index';

export const authApi = {
  register: (data: AuthCredentials) => 
    apiClient.post('/auth/register', data).then(res => res.data),
    
  login: (data: AuthCredentials): Promise<AuthResponse> => 
    apiClient.post('/auth/login', data).then(res => res.data),
    
  getMe: (): Promise<UserProfile> => 
    apiClient.get('/auth/me').then(res => res.data),
};