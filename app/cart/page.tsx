import Link from "next/link";
import { requireUser } from "@/lib/session";
import { getCart, computeTotals } from "@/lib/cart";
import { CartLineItem } from "@/components/cart/CartLineItem";

export default async function CartPage() {
  const user = await requireUser();
  const cart = await getCart(user.id);

  const items = cart.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    unitPrice: item.product.basePrice.toNumber() + (item.variant ? item.variant.priceDelta.toNumber() : 0),
    stock: item.variant ? item.variant.stock : item.product.stock,
    product: { slug: item.product.slug, title: item.product.title, images: item.product.images as string[] },
    variant: item.variant ? { value: item.variant.value } : null,
    protectionPlan: item.protectionPlan,
    protectionPlanPrice: item.protectionPlanPrice ? item.protectionPlanPrice.toNumber() : null,
  }));

  const { subtotal, itemCount } = computeTotals(
    items.map((i) => ({ unitPrice: i.unitPrice, quantity: i.quantity, protectionPlanPrice: i.protectionPlanPrice })),
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10 text-center">
        <h1 className="mb-2 text-2xl font-bold">Your Amazon Clone Cart is empty</h1>
        <p className="mb-4 text-muted-foreground">
          Continue shopping on the <Link href="/" className="text-az-link hover:underline">homepage</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 lg:flex-row">
      <div className="flex-1">
        <h1 className="mb-4 text-2xl font-bold">Shopping Cart</h1>
        <ul>
          {items.map((item) => (
            <CartLineItem key={item.id} item={item} />
          ))}
        </ul>
      </div>

      <aside className="w-full shrink-0 space-y-3 rounded-lg border p-5 lg:w-80">
        <p className="text-lg">
          Subtotal ({itemCount} item{itemCount === 1 ? "" : "s"}):{" "}
          <span className="font-bold">${subtotal.toFixed(2)}</span>
        </p>
        <Link
          href="/checkout"
          className="block rounded-full bg-az-cta-yellow px-4 py-2 text-center text-sm font-medium hover:bg-az-cta-yellow-hover"
        >
          Proceed to checkout
        </Link>
      </aside>
    </div>
  );
}
