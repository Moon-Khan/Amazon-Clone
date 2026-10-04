import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 lg:flex-row">
      <div className="flex-1 space-y-4">
        <Skeleton className="h-7 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b py-4">
            <Skeleton className="h-24 w-24 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </div>

      <aside className="w-full shrink-0 space-y-3 rounded-lg border p-5 lg:w-80">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-full" />
      </aside>
    </div>
  );
}
