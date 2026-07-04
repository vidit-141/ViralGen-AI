export default function ImageSkeleton() {
  return (
    <div className="space-y-3">
      <div className="w-full aspect-square rounded-xl bg-zinc-800 animate-pulse" />
      <div className="h-4 w-2/3 rounded bg-zinc-800 animate-pulse" />
    </div>
  );
}