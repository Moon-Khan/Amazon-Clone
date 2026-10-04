import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { getOrderById } from "@/lib/orders";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const order = await getOrderById(user.id, id);
  if (!order) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6">
      <div>
        <h1 className="text-2xl font-bold text-green-700">✔ Order placed</h1>
        <p className="text-sm text-muted-foreground">
          Order #{order.id} &middot; Placed{" "}
          {order.placedAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <section className="rounded border p-5">
        <h2 className="mb-3 font-bold">Items</h2>
        <ul className="space-y-3">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span>
                <Link href={`/product/${item.product.slug}`} className="hover:text-az-link hover:underline">
                  {item.product.title}
                </Link>
                {item.variant ? ` (${item.variant.value})` : ""} &times; {item.quantity}
              </span>
              <span>${(item.unitPriceAtPurchase.toNumber() * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-col gap-6 sm:flex-row">
        <section className="flex-1 rounded border p-5">
          <h2 className="mb-2 font-bold">Shipping address</h2>
          <p className="text-sm">
            {order.address.line1}
            {order.address.line2 ? `, ${order.address.line2}` : ""}
            <br />
            {order.address.city}, {order.address.state} {order.address.zip}
            <br />
            {order.address.country}
          </p>
        </section>

        <section className="w-full space-y-1 rounded border p-5 text-sm sm:w-64">
          <h2 className="mb-2 font-bold">Order summary</h2>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${order.subtotal.toNumber().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.shippingFee.toNumber() === 0 ? "FREE" : `$${order.shippingFee.toNumber().toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${order.tax.toNumber().toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-1 font-bold">
            <span>Total</span>
            <span>${order.total.toNumber().toFixed(2)}</span>
          </div>
        </section>
      </div>

      <Link href="/orders" className="inline-block text-sm text-az-link hover:underline">
        Back to Your Orders
      </Link>
    </div>
  );
}
