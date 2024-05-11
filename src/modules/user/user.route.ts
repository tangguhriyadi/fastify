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
                    201: $ref("userAccountResponseSchema"),
                },
            },
        },
        paymentAccountsHandler
    );
}

export default UserRoutes;
