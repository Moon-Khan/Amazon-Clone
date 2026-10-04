import Image from "next/image";
import Link from "next/link";
import { RatingStars } from "./RatingStars";
import { PriceBlock } from "./PriceBlock";

export type ProductCardData = {
  slug: string;
  title: string;
  brand: string;
  images: string[];
  basePrice: number;
  listPrice: number | null;
  ratingAvg: number;
  ratingCount: number;
  isPrimeEligible: boolean;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images[0];
  const titleStartsWithBrand = product.title.toLowerCase().startsWith(product.brand.toLowerCase());

  return (
    <Link
      href={`/product/${product.slug}`}
      className="flex flex-col gap-2 rounded-lg border border-transparent p-3 hover:border-neutral-200 hover:shadow-md"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded bg-neutral-100">
        {image && (
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 220px, (min-width: 640px) 33vw, 50vw"
            className="object-contain p-2"
          />
        )}
      </div>
      <p className="line-clamp-2 text-sm">
        {!titleStartsWithBrand && <span className="font-medium">{product.brand} </span>}
        {product.title}
      </p>
      <RatingStars rating={product.ratingAvg} count={product.ratingCount} />
      <PriceBlock basePrice={product.basePrice} listPrice={product.listPrice} />
      {product.isPrimeEligible && <span className="text-xs font-bold text-az-prime">✔ prime</span>}
    </Link>
  );
}
