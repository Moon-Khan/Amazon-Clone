import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-32 w-full" />
      <div className="flex flex-col gap-6 sm:flex-row">
        <Skeleton className="h-32 flex-1" />
        <Skeleton className="h-32 w-full sm:w-64" />
      </div>
    </div>
  );
}
