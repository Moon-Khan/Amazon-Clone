import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6">
      <Skeleton className="h-40 w-full rounded-lg sm:h-32" />

      <section>
        <Skeleton className="mb-4 h-6 w-48" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </section>

      {Array.from({ length: 3 }).map((_, i) => (
        <section key={i}>
          <Skeleton className="mb-4 h-6 w-40" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-48 w-full" />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
