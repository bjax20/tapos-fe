import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Welcome to Our Platform</h1>
      <div className="flex gap-4">
        <Link href="/login" className="px-6 py-2 bg-blue-600 text-white rounded">
          Log In
        </Link>
        <Link href="/register" className="px-6 py-2 border border-blue-600 rounded">
          Sign Up
        </Link>
      </div>
    </main>
  );
}