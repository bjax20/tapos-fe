import { ArrowRight } from "lucide-react" // Assuming you use lucide-react
import Link from "next/link"

export default function LandingPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      {/* Subtle Background Glow - Minimalism needs depth */}
      <div className="absolute top-0 left-1/2 -z-10 h-[400px] w-full max-w-4xl -translate-x-1/2 rounded-full bg-white/[0.03] blur-[120px]" />

      {/* Navbar Minimalist */}
      <nav className="absolute top-0 flex w-full max-w-7xl items-center justify-between p-8">
        <div className="text-xl font-bold tracking-tighter">
          Tapos<span className="text-zinc-500">.work</span>
        </div>
        <Link href="/login" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
          Sign In
        </Link>
      </nav>

      {/* Hero Content */}
      <div className="max-w-3xl space-y-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Ship faster, stress less.
        </div>

        <h1 className="bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-6xl font-bold tracking-tight text-transparent md:text-7xl">
          The art of <br /> getting it done.
        </h1>

        <p className="mx-auto max-w-xl text-lg leading-relaxed text-zinc-400 md:text-xl">
          Stop managing projects. Start finishing them. Tapos is the minimalist workspace designed for the final 10%.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
          <Link
            href="/signup"
            className="group flex items-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-black transition-all hover:bg-zinc-200 active:scale-95"
          >
            Tapos that work!
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/demo"
            className="rounded-full border border-zinc-800 px-8 py-3 font-medium text-zinc-300 transition-all hover:bg-zinc-900"
          >
            Watch Demo
          </Link>
        </div>

        {/* Social Proof / Trust Marks */}
        <div className="pt-20">
          <p className="mb-8 text-[10px] font-bold tracking-[0.2em] text-zinc-600 uppercase">Powering teams at</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-40 contrast-200 grayscale">
            {/* Replace with actual SVG logos later */}
            <div className="text-xl font-bold tracking-tighter">ACME</div>
            <div className="text-xl font-bold tracking-tighter">GLOBE</div>
            <div className="text-xl font-bold tracking-tighter">VERTEX</div>
            <div className="text-xl font-bold tracking-tighter">BOLT</div>
          </div>
        </div>
      </div>
    </main>
  )
}
