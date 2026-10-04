import { prisma } from "./prisma";
import { calcProtectionPlanPrice } from "./protectionPlan";

export type CartLineInput = { unitPrice: number; quantity: number; protectionPlanPrice?: number | null };

/**
 * Pure: sums line totals and item count for a cart. A line's protection-plan
 * price is a flat add-on for that line (not multiplied by quantity) - it
 * covers "this item", the same simplification real add-on SKUs use.
 */
export function computeTotals(lines: CartLineInput[]): { subtotal: number; itemCount: number } {
  const subtotal = lines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity + (line.protectionPlanPrice ?? 0),
    0,
  );
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  return { subtotal: Math.round(subtotal * 100) / 100, itemCount };
}

async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

const CART_ITEM_INCLUDE = {
  items: {
    include: { product: true, variant: true },
    orderBy: { addedAt: "asc" as const },
  },
};

export async function getCart(userId: string) {
  const cart = await getOrCreateCart(userId);
  return prisma.cart.findUniqueOrThrow({ where: { id: cart.id }, include: CART_ITEM_INCLUDE });
}

export async function addItem(
  userId: string,
  productId: string,
  variantId: string | null,
  quantity: number,
  protectionPlan = false,
) {
  const cart = await getOrCreateCart(userId);

  const product = await prisma.product.findUniqueOrThrow({ where: { id: productId } });
  const variant = variantId ? await prisma.productVariant.findUniqueOrThrow({ where: { id: variantId } }) : null;
  const stockLimit = variant ? variant.stock : product.stock;
  const unitPrice = product.basePrice.toNumber() + (variant?.priceDelta.toNumber() ?? 0);

  // Not using the cartId_productId_variantId compound-unique shortcut here:
  // Postgres treats NULL as distinct in unique indexes, so it wouldn't
  // actually stop duplicate no-variant rows - uniqueness for that case is
  // enforced here at the application level instead via findFirst.
  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, variantId },
  });

  const desiredQuantity = Math.min((existing?.quantity ?? 0) + quantity, stockLimit);
  if (desiredQuantity <= 0) return getCart(userId);

  // Sticky-on: once a line has the protection plan, re-adding the same
  // product/variant keeps it, even if this particular call didn't ask for it.
  const wantsPlan = Boolean(existing?.protectionPlan) || protectionPlan;
  const planData = wantsPlan
    ? { protectionPlan: true, protectionPlanPrice: calcProtectionPlanPrice(unitPrice) }
    : { protectionPlan: false, protectionPlanPrice: null };

  if (existing) {
    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: desiredQuantity, ...planData } });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, variantId, quantity: desiredQuantity, ...planData },
    });
  }

  return getCart(userId);
}

async function assertItemOwnership(itemId: string, userId: string) {
  const item = await prisma.cartItem.findUnique({ where: { id: itemId }, include: { cart: true } });
  return item && item.cart.userId === userId ? item : null;
}

export async function updateItemQuantity(userId: string, itemId: string, quantity: number) {
  const item = await assertItemOwnership(itemId, userId);
  if (!item) return null;

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
    return getCart(userId);
  }

  const stockLimit = item.variantId
    ? (await prisma.productVariant.findUniqueOrThrow({ where: { id: item.variantId } })).stock
    : (await prisma.product.findUniqueOrThrow({ where: { id: item.productId } })).stock;

  await prisma.cartItem.update({ where: { id: itemId }, data: { quantity: Math.min(quantity, stockLimit) } });
  return getCart(userId);
}

export async function removeItem(userId: string, itemId: string) {
  const item = await assertItemOwnership(itemId, userId);
  if (!item) return null;

  await prisma.cartItem.delete({ where: { id: itemId } });
  return getCart(userId);
}
