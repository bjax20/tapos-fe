import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react'; // Assuming you use lucide-react

export default function LandingPage() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden px-6">
      
      {/* Subtle Background Glow - Minimalism needs depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-white/[0.03] blur-[120px] rounded-full -z-10" />

      {/* Navbar Minimalist */}
      <nav className="absolute top-0 w-full max-w-7xl flex justify-between items-center p-8">
        <div className="text-xl font-bold tracking-tighter">Tapos<span className="text-zinc-500">.work</span></div>
        <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          Sign In
        </Link>
      </nav>

      {/* Hero Content */}
      <div className="max-w-3xl text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Ship faster, stress less.
        </div>

        <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          The art of <br /> getting it done.
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Stop managing projects. Start finishing them. Tapos is the minimalist workspace designed for the final 10%.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="/register" 
            className="group flex items-center gap-2 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-all active:scale-95"
          >
            Start finishing
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <Link 
            href="/demo" 
            className="px-8 py-3 border border-zinc-800 text-zinc-300 font-medium rounded-full hover:bg-zinc-900 transition-all"
          >
            Watch Demo
          </Link>
        </div>

        {/* Social Proof / Trust Marks */}
        <div className="pt-20">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold mb-8">Powering teams at</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-40 grayscale contrast-200">
             {/* Replace with actual SVG logos later */}
             <div className="text-xl font-bold tracking-tighter">ACME</div>
             <div className="text-xl font-bold tracking-tighter">GLOBE</div>
             <div className="text-xl font-bold tracking-tighter">VERTEX</div>
             <div className="text-xl font-bold tracking-tighter">BOLT</div>
          </div>
        </div>
      </div>
    </main>
  );
}