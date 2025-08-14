/*
  Warnings:

  - The primary key for the `Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uid` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `id` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_customerId_fkey";

-- AlterTable
ALTER TABLE "public"."Customer" DROP CONSTRAINT "Customer_pkey",
DROP COLUMN "uid",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Customer_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
