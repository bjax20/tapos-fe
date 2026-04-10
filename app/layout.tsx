import "styles/tailwind.css"
import QueryProvider from "@/components/providers/query-provider"
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "@/components/ui/sonner"

// app/layout.tsx
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans', // Change this to match your CSS
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning is necessary because next-themes 
    // updates the class on the html tag immediately.
    <html lang="en" className={cn("antialiased", geist.variable)} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"  // Initial load is dark
  forcedTheme="dark"   // OVERRIDES system and manual settings
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster/>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
