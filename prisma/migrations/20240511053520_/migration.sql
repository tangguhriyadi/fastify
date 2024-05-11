/*
  Warnings:

  - Added the required column `payment_type` to the `PaymentHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentHistory" ADD COLUMN     "payment_type" TEXT NOT NULL;
