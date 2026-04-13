"use client"

import { Bell, CheckCircle2, ChevronDown, LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/features/auth/api/hooks/use-auth"

export function DashboardNav() {
  const { user, logout } = useAuth()

  // Extract initials for the Avatar fallback (e.g., "Bill Jerson" -> "BJ")
  const initials =
    user?.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  return (
    <nav className="sticky top-0 z-50 w-full border border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Brand/Logo Section */}
        <Link href="/projects" className="group flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white transition-transform group-hover:rotate-3">
            <CheckCircle2 className="h-5 w-5 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tighter text-white">
            Tapos<span className="text-zinc-500">.work</span>
          </span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:bg-zinc-900 hover:text-white">
            <Bell className="h-4 w-4" />
          </Button>

          <div className="mx-2 h-6 w-[1px] bg-zinc-800" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="group flex items-center gap-3 rounded-full p-1 transition-all hover:bg-zinc-900 focus:outline-none">
                <Avatar className="h-8 w-8 border border-zinc-800 transition-colors group-hover:border-zinc-600">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName}`}
                    alt={user?.fullName}
                  />
                  <AvatarFallback className="bg-zinc-800 text-[10px] font-bold text-zinc-400">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden flex-col items-start md:flex">
                  <span className="text-xs font-bold text-zinc-300">{user?.fullName || "User"}</span>
                  <span className="text-[10px] tracking-tighter text-zinc-500 uppercase">
                    {user?.email?.split("@")[0]}
                  </span>
                </div>

                <ChevronDown className="h-3 w-3 text-zinc-500 transition-transform group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 border-zinc-800 bg-zinc-950 text-zinc-300" align="end" sideOffset={8}>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none font-medium text-white">{user?.fullName}</p>
                  <p className="text-xs leading-none text-zinc-500">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />

              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer focus:bg-zinc-900 focus:text-white">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer focus:bg-zinc-900 focus:text-white">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-zinc-800" />

              <DropdownMenuItem
                onClick={() => logout()}
                className="cursor-pointer text-red-400 focus:bg-red-950/30 focus:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
