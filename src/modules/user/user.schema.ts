import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const userCore = {
    username: z.string({
        required_error: "Username is Required",
        invalid_type_error: "Username must be a String",
    }),
};

const createUserSchema = z.object({
    ...userCore,
    password: z.string({
        required_error: "Password is Required",
        invalid_type_error: "Password must be a String",
    }),
});

const createUserResponseSchema = z.object({
    ...userCore,
});

const loginSchema = z.object({
    username: z.string({
        required_error: "Username is Required",
        invalid_type_error: "Username must be a String",
    }),
    password: z.string({
        required_error: "Password is Required",
        invalid_type_error: "Password must be a String",
    }),
});

const loginResponseSchema = z.object({
    message: z.string(),
    access_token: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema,
});
