/*
  Warnings:

  - A unique constraint covering the columns `[numericId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `brand` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notes` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numericId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalPrice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviews` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "notes" JSONB NOT NULL,
ADD COLUMN     "numericId" INTEGER NOT NULL,
ADD COLUMN     "originalPrice" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "reviews" INTEGER NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_numericId_key" ON "public"."Product"("numericId");
