"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { useAuth } from "@/features/auth/api/hooks/use-auth"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth()

  // DEBUG LOGS

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">Loading...</div>
  }

  if (!isAuthenticated) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-red-900/10 text-red-500">Not Authenticated</div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-zinc-950">
      <DashboardNav />
      <main className="flex-1">{children}</main>
    </div>
  )
}
