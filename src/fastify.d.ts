import "@fastify/jwt";

declare module "fastify" {
    export interface FastifyInstance {
        authenticate: any;
    }
}

declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: { id: number }; // payload type is used for signing and verifying
        user: {
            id: number;
            name: string;
            age: number;
        }; // user type is return type of `request.user` object
    }
}
