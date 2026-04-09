'use client';
import { useState } from 'react';
import { useLogin } from '@/features/auth/api/hooks/use-auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 border rounded">
        <h2 className="text-2xl font-bold">Login</h2>
        <input 
          type="email" placeholder="Email" className="p-2 border"
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" placeholder="Password" className="p-2 border"
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button 
          disabled={loginMutation.isPending}
          className="bg-blue-600 text-white p-2 rounded disabled:bg-gray-400"
        >
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>
        {loginMutation.isError && <p className="text-red-500">Invalid credentials</p>}
      </form>
    </div>
  );
}