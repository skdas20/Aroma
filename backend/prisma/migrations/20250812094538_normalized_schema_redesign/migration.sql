/*
  Warnings:

  - The primary key for the `Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Customer` table. All the data in the column will be lost.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedDelivery` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `orderDate` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `orderNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingCity` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingCountry` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingEmail` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingPhone` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingState` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingStreet` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingZip` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `trackingNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Order` table. All the data in the column will be lost.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stockQty` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `unitPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cid` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - The required column `orderId` was added to the `Order` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `pid` was added to the `Product` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- DropIndex
DROP INDEX "public"."Order_orderDate_idx";

-- DropIndex
DROP INDEX "public"."Order_orderNumber_key";

-- DropIndex
DROP INDEX "public"."Order_status_idx";

-- DropIndex
DROP INDEX "public"."Product_sku_key";

-- AlterTable
ALTER TABLE "public"."Customer" DROP CONSTRAINT "Customer_pkey",
DROP COLUMN "id",
DROP COLUMN "phone",
ADD COLUMN     "cid" TEXT NOT NULL,
ADD COLUMN     "phoneNo" TEXT,
ADD CONSTRAINT "Customer_pkey" PRIMARY KEY ("cid");

-- AlterTable
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "currency",
DROP COLUMN "discount",
DROP COLUMN "estimatedDelivery",
DROP COLUMN "id",
DROP COLUMN "notes",
DROP COLUMN "orderDate",
DROP COLUMN "orderNumber",
DROP COLUMN "paymentStatus",
DROP COLUMN "shippingCity",
DROP COLUMN "shippingCountry",
DROP COLUMN "shippingEmail",
DROP COLUMN "shippingName",
DROP COLUMN "shippingPhone",
DROP COLUMN "shippingState",
DROP COLUMN "shippingStreet",
DROP COLUMN "shippingZip",
DROP COLUMN "status",
DROP COLUMN "subtotal",
DROP COLUMN "tax",
DROP COLUMN "trackingNumber",
DROP COLUMN "updatedAt",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("orderId");

-- AlterTable
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "currency",
DROP COLUMN "id",
DROP COLUMN "isActive",
DROP COLUMN "name",
DROP COLUMN "sku",
DROP COLUMN "stockQty",
DROP COLUMN "unitPrice",
DROP COLUMN "updatedAt",
ADD COLUMN     "pid" TEXT NOT NULL,
ADD COLUMN     "price" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("pid");

-- DropTable
DROP TABLE "public"."OrderItem";

-- DropEnum
DROP TYPE "public"."OrderStatus";

-- DropEnum
DROP TYPE "public"."PaymentStatus";

-- CreateTable
CREATE TABLE "public"."OrderProduct" (
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "priceAtPurchase" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "OrderProduct_pkey" PRIMARY KEY ("orderId","productId")
);

-- CreateIndex
CREATE INDEX "OrderProduct_orderId_idx" ON "public"."OrderProduct"("orderId");

-- CreateIndex
CREATE INDEX "OrderProduct_productId_idx" ON "public"."OrderProduct"("productId");

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("cid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderProduct" ADD CONSTRAINT "OrderProduct_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderProduct" ADD CONSTRAINT "OrderProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("pid") ON DELETE RESTRICT ON UPDATE CASCADE;
