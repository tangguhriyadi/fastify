import { Transaction } from "@prisma/client";
import prisma from "../../utils/prisma";
import { TransactionSendInput } from "./transaction.schema";

export async function findPaymentAccount(
    user_id: number,
    account_type: string
) {
    const account = await prisma.paymentAccount.findFirst({
        where: {
            user_id: user_id,
            account_type: account_type,
        },
    });

    return account;
}

export async function updateBalance(account_id: number, amount: number) {
    await prisma.paymentAccount.update({
        where: {
            account_id: account_id,
        },
        data: {
            balance: amount,
        },
    });
}

export async function recordTransaction(
    input: TransactionSendInput,
    user_id: number
) {
    return await prisma.transaction.create({
        data: {
            amount: input.amount,
            comment: input.comment ?? "",
            currency: "USD",
            status: "PENDING",
            recipient_id: input.recipient_id,
            user_id: user_id,
        },
    });
}
export async function updateTransactionFailed(id: number) {
    return await prisma.transaction.update({
        where: {
            id,
        },

        data: {
            status: "FAILED",
        },
    });
}

export async function processTransaction(
    transaction: Transaction & {
        account_id: number;
        recipient_account_id: number;
    }
): Promise<Transaction> {
    return new Promise((resolve, reject) => {
        try {
            console.log("Transaction processing started for:", transaction);

            // deduct sender balance
            const updateSenderBalance = prisma.paymentAccount.update({
                where: {
                    account_id: transaction.account_id,
                },
                data: {
                    balance: {
                        decrement: transaction.amount,
                    },
                },
            });

            // update recipient balance
            const updateRecipientBalance = prisma.paymentAccount.update({
                where: {
                    account_id: transaction.recipient_account_id,
                },
                data: {
                    balance: { increment: transaction.amount },
                },
            });

            // update transaction status
            const updateStatusTransaction = prisma.transaction.update({
                where: {
                    id: transaction.id,
                },
                data: {
                    status: "SUCCESS",
                },
            });

            // record sender payment history
            const createPaymentHistory = prisma.paymentHistory.createMany({
                data: [
                    {
                        account_id: transaction.account_id,
                        transaction_id: transaction.id,
                        payment_type: "CASH OUT",
                    },
                    {
                        account_id: transaction.recipient_account_id,
                        transaction_id: transaction.id,
                        payment_type: "CASH IN",
                    },
                ],
            });

            prisma.$transaction([
                updateSenderBalance,
                updateRecipientBalance,
                updateStatusTransaction,
                createPaymentHistory,
            ]);

            resolve(transaction);
        } catch (err) {
            reject(err);
        } finally {
            prisma.$disconnect();
        }
    });
}
