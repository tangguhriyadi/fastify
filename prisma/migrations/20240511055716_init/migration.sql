-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_recipient_id_fkey";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "recipient_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
