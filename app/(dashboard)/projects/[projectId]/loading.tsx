export default function Loading() {
  return (
    <div className="p-8 space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-zinc-900 rounded" />
      <div className="flex gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 h-[60vh] bg-zinc-900/50 rounded-xl" />
        ))}
      </div>
    </div>
  );
}