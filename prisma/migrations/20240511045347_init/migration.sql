-- DropIndex
DROP INDEX "PaymentHistory_transaction_id_key";

-- AlterTable
ALTER TABLE "PaymentHistory" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY ("id");
