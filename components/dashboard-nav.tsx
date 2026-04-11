import { Bell, CheckCircle2, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function DashboardNav() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
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

        {/* Right Section: Profile Placeholder */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:bg-zinc-900 hover:text-white">
            <Bell className="h-4 w-4" />
          </Button>
          <div className="mx-2 h-8 w-[1px] bg-zinc-800" /> {/* Vertical Divider */}
          <button className="group flex items-center gap-3 rounded-full px-1 py-1 transition-all hover:bg-zinc-900">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-800 transition-colors group-hover:border-zinc-500">
              {/* Future Avatar Image goes here */}
              <User className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300" />
            </div>
            <div className="hidden flex-col items-start pr-2 md:flex">
              <span className="text-xs font-bold text-zinc-300">Bill J.</span>
              <span className="text-[10px] tracking-tighter text-zinc-500 uppercase">Pro Plan</span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  )
}
