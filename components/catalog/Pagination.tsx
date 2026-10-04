import Link from "next/link";

function hrefFor(searchParams: Record<string, string | undefined>, page: number) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value && key !== "page") params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `?${qs}` : "?";
}

export function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <nav className="flex items-center justify-center gap-4 py-8" aria-label="Pagination">
      <Link
        href={hrefFor(searchParams, page - 1)}
        aria-disabled={prevDisabled}
        className={`rounded border px-4 py-2 text-sm ${prevDisabled ? "pointer-events-none opacity-40" : "hover:bg-muted"}`}
      >
        Previous
      </Link>
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <Link
        href={hrefFor(searchParams, page + 1)}
        aria-disabled={nextDisabled}
        className={`rounded border px-4 py-2 text-sm ${nextDisabled ? "pointer-events-none opacity-40" : "hover:bg-muted"}`}
      >
        Next
      </Link>
    </nav>
  );
}
