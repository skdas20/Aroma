/*
  Warnings:

  - The primary key for the `Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Customer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_customerId_fkey";

-- DropIndex
DROP INDEX "public"."Customer_uid_key";

-- AlterTable
ALTER TABLE "public"."Customer" DROP CONSTRAINT "Customer_pkey",
DROP COLUMN "id",
DROP COLUMN "updatedAt",
ADD COLUMN     "totalExpenditure" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD CONSTRAINT "Customer_pkey" PRIMARY KEY ("uid");

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
