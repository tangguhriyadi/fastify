import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

async function TransactionRoutes(server: FastifyInstance) {
    server.post(
        "/send",
        {
            preHandler: [server.authenticate],
        },
        (request: FastifyRequest, reply: FastifyReply) => {
            return reply.code(200).send({ message: "success" });
        }
    );
}

export default TransactionRoutes;
