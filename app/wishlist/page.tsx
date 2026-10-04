import Link from "next/link";
import { requireUser } from "@/lib/session";
import { getWishlist } from "@/lib/wishlist";
import { toProductCardData } from "@/lib/catalog";
import { ProductGrid } from "@/components/catalog/ProductGrid";

export default async function WishlistPage() {
  const user = await requireUser();
  const products = await getWishlist(user.id);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <h1 className="mb-1 text-2xl font-bold">Your Wishlist</h1>

      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nothing saved yet. Tap &quot;Add to List&quot; on any product page to save it here.{" "}
          <Link href="/" className="text-az-link hover:underline">
            Continue shopping
          </Link>
          .
        </p>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">{products.length} saved item{products.length === 1 ? "" : "s"}.</p>
          <ProductGrid products={products.map(toProductCardData)} />
        </>
      )}
    </div>
  );
}
