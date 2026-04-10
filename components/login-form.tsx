"use client"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation";
import { useEffect , useState } from "react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useLogin } from "@/features/auth/api/hooks/use-auth";
import { cn } from "@/lib/utils"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const { mutate, isPending} = useLogin();
  useEffect(() => {
  const isRegistered = searchParams.get("registered");
  
  if (isRegistered === "true") {
    // This ensures the <Toaster /> from layout.tsx is ready to receive events.
    const timer = setTimeout(() => {
      toast.success("Account created!", {
        description: "Welcome to Tapos.work. Please sign in to continue.",
        duration: 5000, // Keep it visible long enough to be seen
      });
    }, 100);

    // Clean up timer if component unmounts
    return () => clearTimeout(timer);
  }
}, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <div className={cn("flex flex-col gap-8 w-full max-w-sm mx-auto", className)} {...props}>
      {/* Brand Header */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
          <CheckCircle2 className="h-6 w-6 text-black" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold tracking-tighter">Tapos<span className="text-zinc-500">.work</span></h1>
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Get back to done</p>
        </div>
      </div>

      <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center tracking-tight">Welcome back</CardTitle>
          <CardDescription className="text-center text-zinc-400">
            Enter your credentials to access your workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel htmlFor="email" className="text-zinc-400">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="bg-zinc-900 border-zinc-800 focus:ring-1 focus:ring-zinc-400 transition-all"
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-zinc-400">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-xs text-zinc-500 underline-offset-4 hover:text-white hover:underline transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input 
                    id="password" 
                    type="password" 
                    value={password}
                  onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="bg-zinc-900 border-zinc-800 focus:ring-1 focus:ring-zinc-400 transition-all"
                />
              </Field>
              
              <div className="flex flex-col gap-3 pt-2">
                <Button type="submit" disabled={isPending}className="w-full bg-white text-black hover:bg-zinc-200 transition-all font-semibold">
                  {isPending ? "Signing in..." : "Sign in"}
                </Button>
                <Button variant="outline" type="button" className="w-full border-zinc-800 bg-transparent hover:bg-zinc-900 text-zinc-300">
                  Continue with Google
                </Button>
              </div>

              <p className="text-center text-sm text-zinc-500">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-zinc-300 underline-offset-4 hover:underline">
                  Sign up
                </Link>
              </p>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {/* Footer hint */}
      <footer className="text-center text-[10px] text-zinc-600 uppercase tracking-[0.1em]">
        &copy; {new Date().getFullYear()} Tapos Work Systems
      </footer>
    </div>
  )
}