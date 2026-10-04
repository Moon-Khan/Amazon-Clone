import { prisma } from "./prisma";
import { getCart, computeTotals } from "./cart";

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 35;
const STANDARD_SHIPPING_FEE = 5.99;

export type OrderTotals = { subtotal: number; tax: number; shippingFee: number; total: number };

/** Pure: tax + shipping + total given a subtotal. */
export function calcOrderTotals(subtotal: number): OrderTotals {
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const total = Math.round((subtotal + tax + shippingFee) * 100) / 100;
  return { subtotal, tax, shippingFee, total };
}

export class EmptyCartError extends Error {
  constructor() {
    super("Your cart is empty.");
  }
}

export class InvalidAddressError extends Error {
  constructor() {
    super("That address could not be found.");
  }
}

export class OutOfStockError extends Error {
  constructor(public productTitle: string) {
    super(`"${productTitle}" no longer has enough stock for this order.`);
  }
}

export async function placeOrder(userId: string, addressId: string) {
  const [cart, address] = await Promise.all([
    getCart(userId),
    prisma.address.findUnique({ where: { id: addressId } }),
  ]);

  if (cart.items.length === 0) throw new EmptyCartError();
  if (!address || address.userId !== userId) throw new InvalidAddressError();

  const lines = cart.items.map((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    quantity: item.quantity,
    unitPrice: item.product.basePrice.toNumber() + (item.variant ? item.variant.priceDelta.toNumber() : 0),
    title: item.product.title,
    protectionPlan: item.protectionPlan,
    protectionPlanPrice: item.protectionPlanPrice ? item.protectionPlanPrice.toNumber() : null,
  }));

  const { subtotal, tax, shippingFee, total } = calcOrderTotals(computeTotals(lines).subtotal);

  const order = await prisma.$transaction(async (tx) => {
    for (const line of lines) {
      const result = line.variantId
        ? await tx.productVariant.updateMany({
            where: { id: line.variantId, stock: { gte: line.quantity } },
            data: { stock: { decrement: line.quantity } },
          })
        : await tx.product.updateMany({
            where: { id: line.productId, stock: { gte: line.quantity } },
            data: { stock: { decrement: line.quantity } },
          });

      if (result.count === 0) throw new OutOfStockError(line.title);
    }

    const created = await tx.order.create({
      data: {
        userId,
        addressId,
        subtotal,
        tax,
        shippingFee,
        total,
        status: "placed",
        items: {
          create: lines.map((line) => ({
            productId: line.productId,
            variantId: line.variantId,
            quantity: line.quantity,
            unitPriceAtPurchase: line.unitPrice,
            protectionPlan: line.protectionPlan,
            protectionPlanPrice: line.protectionPlanPrice,
          })),
        },
      },
      include: { items: { include: { product: true, variant: true } }, address: true },
    });

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return created;
  });

  return order;
}
