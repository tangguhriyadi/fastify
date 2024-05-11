import "dotenv/config";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import UserRoutes from "./modules/user/user.route";
import TransactionRoutes from "./modules/transaction/transaction.route";
import { userSchemas } from "./modules/user/user.schema";
import jwt from "@fastify/jwt";

export const server = Fastify();



server.register(jwt, {
    secret: process.env.JWT_SECRET as string,
});

server.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.jwtVerify();
        } catch (err) {
            return reply.send(err);
        }
    }
);

server.get("/healthcheck", async function (req, res) {
    return { status: "OK" };
});

async function main() {
    for (const schema of userSchemas) {
        server.addSchema(schema);
    }

    server.register(UserRoutes, { prefix: "api/users" });

    server.register(TransactionRoutes, { prefix: "api/transaction" });

    try {
        await server.listen(3000, "0.0.0.0");
        console.info("server running at port 3000");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main();
