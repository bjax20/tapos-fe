"use client"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRegister } from "@/features/auth/api/hooks/use-auth"
import { cn } from "@/lib/utils"

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const registerMutation = useRegister()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    const payload = {
      email: formData.email,
      password: formData.password,
      fullName: formData.name,
    }

    registerMutation.mutate(payload)
  }
  return (
    <div className={cn("mx-auto flex w-full max-w-md flex-col gap-8", className)}>
      {/* Brand Header - Consistent with Login */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-[0_0_20px_rgba(255,255,255,0.15)]">
          <CheckCircle2 className="h-6 w-6 text-black" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold tracking-tighter text-white">
            Tapos<span className="text-zinc-500">.work</span>
          </h1>
          <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Start your finish line</p>
        </div>
      </div>

      <Card className="border-zinc-800 bg-zinc-950/50 shadow-2xl backdrop-blur-md">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-center text-2xl font-bold tracking-tight">Create your workspace</CardTitle>
          <CardDescription className="text-center text-zinc-400">
            Join thousands of teams finishing faster.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="space-y-4">
              {/* Full Name Field */}
              <Field>
                <FieldLabel htmlFor="name" className="text-xs tracking-wider text-zinc-400 uppercase">
                  Full Name
                </FieldLabel>
                <Input
                  id="name"
                  onChange={handleChange}
                  placeholder="Juan Dela Cruz"
                  className="border-zinc-800 bg-zinc-900/50 transition-all focus:border-zinc-500"
                  required
                />
              </Field>

              {/* Email Field */}
              <Field>
                <FieldLabel htmlFor="email" className="text-xs tracking-wider text-zinc-400 uppercase">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="border-zinc-800 bg-zinc-900/50 transition-all focus:border-zinc-500"
                  required
                />
              </Field>

              {/* Password Section */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="password" className="text-xs tracking-wider text-zinc-400 uppercase">
                    Password
                  </FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border-zinc-800 bg-zinc-900/50 transition-all focus:border-zinc-500"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword" className="text-xs tracking-wider text-zinc-400 uppercase">
                    Confirm
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="border-zinc-800 bg-zinc-900/50 transition-all focus:border-zinc-500"
                    required
                  />
                </Field>
              </div>

              {registerMutation.isError && (
                <p className="text-center text-xs text-red-500">
                  Failed to create account. Email might already be taken.
                </p>
              )}

              <div className="space-y-4 pt-2">
                <Button
                  type="submit"
                  className="h-11 w-full bg-white font-bold text-black transition-all hover:bg-zinc-200"
                >
                  {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-800"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-zinc-950 px-2 text-zinc-500">Or continue with</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  type="button"
                  className="h-11 w-full border-zinc-800 bg-transparent text-zinc-300 transition-colors hover:bg-zinc-900"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
              </div>

              <p className="text-center text-xs leading-relaxed text-zinc-500">
                By clicking create, you agree to our{" "}
                <Link href="/terms" className="underline hover:text-zinc-300">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline hover:text-zinc-300">
                  Privacy Policy
                </Link>
                .
              </p>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-white underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
