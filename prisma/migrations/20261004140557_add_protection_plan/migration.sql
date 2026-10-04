-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "protectionPlan" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "protectionPlanPrice" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "protectionPlan" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "protectionPlanPrice" DECIMAL(10,2);
