import { FastifyReply, FastifyRequest } from "fastify";
import { TransactionSendInput } from "./transaction.schema";
import {
    findPaymentAccount,
    processTransaction,
    recordTransaction,
    updateTransactionFailed,
} from "./transaction.service";
import { findUserById } from "../user/user.service";

export async function transactionSendHandler(
    request: FastifyRequest<{
        Body: TransactionSendInput;
    }>,
    reply: FastifyReply
) {
    const { amount, recipient_id } = request.body;
    const { id: user_id } = request.user;
    try {
        // validate current balance
        const account = await findPaymentAccount(user_id, "DEBIT");
        if (!account) {
            return reply.code(404).send({
                message: "You don't have DEBIT Account",
            });
        }
        if (account && account?.balance < amount) {
            return reply.code(400).send({
                message: "Insufficient Fund",
            });
        }

        // validate recipient account
        const recipient = await findUserById(recipient_id);
        if (!recipient) {
            return reply.code(404).send({
                message: "Recipient not found",
            });
        }
        const recipientAccount = await findPaymentAccount(
            recipient_id,
            "DEBIT"
        );
        if (!recipientAccount) {
            return reply.code(404).send({
                message: "Recipient does not have DEBIT payment account",
            });
        }

        // record transaction with status PENDING
        const transaction = await recordTransaction(request.body, user_id);

        // start transaction
        await processTransaction({
            ...transaction,
            account_id: account.account_id,
            recipient_account_id: recipientAccount.account_id,
        })
            .then((transaction) => {
                transaction.status = "SUCCESS";
                console.log(
                    "transaction processing completed for:",
                    transaction
                );
                reply.code(200).send({
                    message: "Transaction Success",
                });
            })
            .catch((err) => {
                console.error(err);

                // update transaction status to FAILED
                updateTransactionFailed(transaction.id);
                return reply.code(500).send({
                    message: "Transaction Failed",
                });
            });
    } catch (err) {
        return reply.code(500).send(err);
    }
}
