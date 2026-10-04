import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getRelatedProducts, toProductCardData } from "@/lib/catalog";
import { ImageGallery } from "@/components/pdp/ImageGallery";
import { BuyBox } from "@/components/pdp/BuyBox";
import { ReviewList } from "@/components/pdp/ReviewList";
import { ReviewForm } from "@/components/pdp/ReviewForm";
import { RatingStars } from "@/components/catalog/RatingStars";
import { ProductGrid } from "@/components/catalog/ProductGrid";

export const revalidate = 60;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id, 6);

  const basePrice = product.basePrice.toNumber();
  const listPrice = product.listPrice ? product.listPrice.toNumber() : null;
  const variants = product.variants.map((v) => ({
    id: v.id,
    value: v.value,
    priceDelta: v.priceDelta.toNumber(),
    stock: v.stock,
  }));

  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-6">
      <nav className="text-sm text-muted-foreground">
        <Link href={`/category/${product.category.slug}`} className="hover:underline">
          {product.category.name}
        </Link>
      </nav>

      <div className="flex flex-col gap-8 lg:flex-row">
        <ImageGallery images={product.images as string[]} title={product.title} />

        <div className="flex-1 space-y-3">
          <h1 className="text-2xl font-medium">{product.title}</h1>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
          <RatingStars rating={product.ratingAvg} count={product.ratingCount} />
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>

        <BuyBox
          productId={product.id}
          title={product.title}
          image={(product.images as string[])[0]}
          product={{ basePrice, listPrice, stock: product.stock, isPrimeEligible: product.isPrimeEligible }}
          variants={variants}
        />
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold">Related products</h2>
          <ProductGrid products={related.map(toProductCardData)} />
        </section>
      )}

      <section className="space-y-6">
        <h2 className="text-xl font-bold">Customer reviews</h2>
        <ReviewForm productId={product.id} />
        <ReviewList reviews={product.reviews} />
      </section>
    </div>
  );
}
