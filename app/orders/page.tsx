import Link from "next/link";
import { requireUser } from "@/lib/session";
import { getOrders } from "@/lib/orders";

export default async function OrdersPage() {
  const user = await requireUser();
  const orders = await getOrders(user.id);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">Your Orders</h1>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">
          Looks like you haven&apos;t placed an order yet.{" "}
          <Link href="/" className="text-az-link hover:underline">
            Continue shopping
          </Link>
          .
        </p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="rounded border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                <span>
                  Placed{" "}
                  {order.placedAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
                <span>Total: ${order.total.toNumber().toFixed(2)}</span>
                <span className="capitalize">{order.status}</span>
              </div>
              <p className="mt-2 line-clamp-1 text-sm">
                {order.items.map((item) => item.product.title).join(", ")}
              </p>
              <Link href={`/orders/${order.id}`} className="mt-2 inline-block text-sm text-az-link hover:underline">
                View order details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
