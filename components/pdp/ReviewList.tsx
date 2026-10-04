import { RatingStars } from "@/components/catalog/RatingStars";

export type ReviewItem = {
  id: string;
  rating: number;
  body: string;
  createdAt: Date;
  user: { name: string };
};

export function ReviewList({ reviews }: { reviews: ReviewItem[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">No reviews yet for this product.</p>;
  }

  return (
    <ul className="space-y-6">
      {reviews.map((review) => (
        <li key={review.id} className="border-b pb-4 last:border-0">
          <div className="flex items-center gap-2">
            <RatingStars rating={review.rating} />
          </div>
          <p className="mt-1 text-sm font-medium">{review.user.name}</p>
          <p className="text-xs text-muted-foreground">
            Reviewed on {review.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
          <p className="mt-2 text-sm">{review.body}</p>
        </li>
      ))}
    </ul>
  );
}
