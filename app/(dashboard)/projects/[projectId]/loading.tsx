export default function Loading() {
  return (
    <div className="animate-pulse space-y-8 p-8">
      <div className="h-8 w-48 rounded bg-zinc-900" />
      <div className="flex gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[60vh] flex-1 rounded-xl bg-zinc-900/50" />
        ))}
      </div>
    </div>
  )
}
