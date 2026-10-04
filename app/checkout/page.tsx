import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getCart, computeTotals } from "@/lib/cart";
import { calcOrderTotals } from "@/lib/checkout";
import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export default async function CheckoutPage() {
  const user = await requireUser();
  const cart = await getCart(user.id);
  if (cart.items.length === 0) redirect("/cart");

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: { isDefault: "desc" },
  });

  const lines = cart.items.map((item) => ({
    id: item.id,
    title: item.product.title,
    variant: item.variant?.value ?? null,
    quantity: item.quantity,
    unitPrice: item.product.basePrice.toNumber() + (item.variant ? item.variant.priceDelta.toNumber() : 0),
    protectionPlanPrice: item.protectionPlanPrice ? item.protectionPlanPrice.toNumber() : null,
  }));

  const { subtotal } = computeTotals(lines);
  const totals = calcOrderTotals(subtotal);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
      <CheckoutForm
        addresses={addresses.map((a) => ({
          id: a.id,
          line1: a.line1,
          line2: a.line2,
          city: a.city,
          state: a.state,
          zip: a.zip,
          country: a.country,
          isDefault: a.isDefault,
        }))}
        items={lines}
        totals={totals}
      />
    </div>
  );
}
