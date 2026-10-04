import { prisma } from "./prisma";

const ORDER_INCLUDE = {
  items: { include: { product: true, variant: true } },
  address: true,
};

export async function getOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { placedAt: "desc" },
    include: ORDER_INCLUDE,
  });
}

export async function getOrderById(userId: string, orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: ORDER_INCLUDE });
  return order && order.userId === userId ? order : null;
}
