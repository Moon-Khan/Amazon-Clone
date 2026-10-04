import Link from "next/link";
import { getTopDeals, getCategoryRails, toProductCardData } from "@/lib/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";

export const revalidate = 60;

export default async function Home() {
  const [deals, rails] = await Promise.all([getTopDeals(8), getCategoryRails(6, 4)]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6">
      <section className="flex flex-col items-start gap-4 rounded-lg bg-gradient-to-r from-az-nav to-az-header p-8 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shop today&apos;s deals</h1>
          <p className="mt-1 text-neutral-300">Fast, free delivery on eligible orders.</p>
        </div>
        <Link
          href="/search?sort=relevance"
          className="rounded-full bg-az-cta-yellow px-6 py-3 font-bold text-black hover:bg-az-cta-yellow-hover"
        >
          Shop now
        </Link>
      </section>

      {deals.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold">Today&apos;s Deals</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {deals.map((product) => (
              <ProductCard key={product.id} product={toProductCardData(product)} />
            ))}
          </div>
        </section>
      )}

      {rails.map(({ category, products }) =>
        products.length === 0 ? null : (
          <section key={category.id}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">{category.name}</h2>
              <Link href={`/category/${category.slug}`} className="text-sm text-az-link hover:underline">
                Shop all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={toProductCardData(product)} />
              ))}
            </div>
          </section>
        ),
      )}
    </div>
  );
}
