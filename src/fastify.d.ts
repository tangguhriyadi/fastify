import "@fastify/jwt";

declare module "fastify" {
    export interface FastifyInstance {
        authenticate: any;
    }
}

declare module "@fastify/jwt" {
    interface FastifyJWT {
        user: {
            id: number;
            username: string;
        }; // user type is return type of `request.user` object
    }
}
