import Link from "next/link";
import { CheckCircle2, User, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function DashboardNav() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand/Logo Section */}
        <Link href="/projects" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white transition-transform group-hover:rotate-3">
            <CheckCircle2 className="h-5 w-5 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tighter text-white">
            Tapos<span className="text-zinc-500">.work</span>
          </span>
        </Link>

        {/* Right Section: Profile Placeholder */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-900">
            <Bell className="w-4 h-4" />
          </Button>
          
          <div className="h-8 w-[1px] bg-zinc-800 mx-2" /> {/* Vertical Divider */}

          <button className="flex items-center gap-3 group px-1 py-1 rounded-full hover:bg-zinc-900 transition-all">
            <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden group-hover:border-zinc-500 transition-colors">
              {/* Future Avatar Image goes here */}
              <User className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" />
            </div>
            <div className="hidden md:flex flex-col items-start pr-2">
              <span className="text-xs font-bold text-zinc-300">Bill J.</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Pro Plan</span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}