import { Skeleton } from "@/components/ui/skeleton";

export default function BestSellersLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <Skeleton className="mb-1 h-8 w-48" />
      <Skeleton className="mb-4 h-4 w-64" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-56 w-full" />
        ))}
      </div>
    </div>
  );
}
