import { Star, StarHalf } from "lucide-react";

export function RatingStars({ rating, count }: { rating: number; count?: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  return (
    <span className="flex items-center gap-1">
      <span className="flex text-az-prime">
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < full) return <Star key={i} className="h-4 w-4 fill-current" />;
          if (i === full && hasHalf) return <StarHalf key={i} className="h-4 w-4 fill-current" />;
          return <Star key={i} className="h-4 w-4 text-neutral-300" />;
        })}
      </span>
      {count !== undefined && <span className="text-sm text-az-link">{count.toLocaleString()}</span>}
    </span>
  );
}
