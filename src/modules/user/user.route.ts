import { FastifyInstance } from "fastify";
import {
    createPaymentAccountHandler,
    loginHandler,
    paymentAccountsHandler,
    registerUserHandler,
} from "./user.controller";
import { $ref } from "./user.schema";

async function UserRoutes(server: FastifyInstance) {
    server.post(
        "/register",
        {
            schema: {
                body: $ref("createUserSchema"),
                response: {
                    201: $ref("createUserResponseSchema"),
                },
                tags: ["user"],
                summary: "Register Your Account Here!",
                description: "Register you account and get free 100k balance on your DEBIT account"
            },
        },
        registerUserHandler
    );

    server.post(
        "/login",
        {
            schema: {
                body: $ref("loginSchema"),
                response: {
                    200: $ref("loginResponseSchema"),
                },
                tags: ["user"],
                summary: "Login To Your Account !"
            },
        },
        loginHandler
    );

    server.post(
        "/payment_account",
        {
            onRequest: [server.authenticate],
            schema: {
                body: $ref("createPaymentAccountSchema"),
                response: {
                    201: $ref("createPaymentAccountResponseSchema"),
                },
                tags: ["user"],
                summary: "API To Create Payment Account"
            },
        },
        createPaymentAccountHandler
    );

    server.get(
        "/payment_account",
        {
            onRequest: [server.authenticate],
            schema: {
                response: {
                    200: $ref("userAccountResponseSchema"),
                },
                tags: ["user"],
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                description: "API to get all payment account data of user",
                summary: "API to get all payment account data of user"
            },
        },
        paymentAccountsHandler
    );
}

export default UserRoutes;
