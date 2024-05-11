import { FastifyInstance } from "fastify";
import { $ref } from "./transaction.schema";
import {
    transactionSendHandler,
    transactionWithdrawHandler,
} from "./transaction.controller";

async function TransactionRoutes(server: FastifyInstance) {
    server.post(
        "/send",
        {
            preHandler: [server.authenticate],
            schema: {
                body: $ref("transactionSendSchema"),
                response: {
                    201: $ref("transactionSendResponseSchema"),
                },
                tags: ["transaction"],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: "API To Transfer Balance To Your Friend"
            },
        },
        transactionSendHandler
    );
    server.post(
        "/withdraw",
        {
            preHandler: [server.authenticate],
            schema: {
                body: $ref("transactionWithdrawSchema"),
                response: {
                    201: $ref("transactionSendResponseSchema"),
                },
                tags: ["transaction"],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                summary: "Withdraw Your balance"
            },
        },
        transactionWithdrawHandler
    );
}

export default TransactionRoutes;
