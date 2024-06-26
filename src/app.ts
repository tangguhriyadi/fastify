import "dotenv/config";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import UserRoutes from "./modules/user/user.route";
import TransactionRoutes from "./modules/transaction/transaction.route";
import { userSchemas } from "./modules/user/user.schema";
import jwt from "@fastify/jwt";
import { transactionSchemas } from "./modules/transaction/transaction.schema";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

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
    for (const schema of [...userSchemas, ...transactionSchemas]) {
        server.addSchema(schema);
    }

    server.register(swagger, {
        openapi: {
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                    },
                },
            },
        },
    });

    server.register(swaggerUi, {
        routePrefix: "/docs",
        uiConfig: {
            deepLinking: false,
        },
        uiHooks: {
            onRequest: function (request, reply, next) {
                next();
            },
            preHandler: function (request, reply, next) {
                next();
            },
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject, request, reply) => {
            return swaggerObject;
        },
        transformSpecificationClone: true,
        
    });

    server.register(UserRoutes, { prefix: "api/users" });

    server.register(TransactionRoutes, { prefix: "api/transaction" });

    try {
        await server.listen(4000, "0.0.0.0");
        console.info("server running at port 4000");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main();
