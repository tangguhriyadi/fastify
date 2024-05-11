import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const userCore = {
    username: z.string({
        required_error: "Username is Required",
        invalid_type_error: "Username must be a String",
    }),
};

const successResponse = {
    message: z.string(),
};

const createUserSchema = z.object({
    ...userCore,
    password: z.string({
        required_error: "Password is Required",
        invalid_type_error: "Password must be a String",
    }),
});

const createUserResponseSchema = z.object({
    ...successResponse,
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
    ...successResponse,
    access_token: z.string(),
});

const createPaymentAccountSchema = z.object({
    type: z.enum(["DEBIT", "CREDIT"], {
        required_error: "type is required",
        message: "should DEBIT or CREDIT",
        invalid_type_error: "type must be string DEBIT or CREDIT",
        description: "type must be string DEBIT or CREDIT",
    }),
});

const createPaymentAccountResponseSchema = z.object({
    ...successResponse,
    type: z.enum(["DEBIT", "CREDIT"], {
        required_error: "type is required",
        message: "should DEBIT or CREDIT",
        invalid_type_error: "type must be string DEBIT or CREDIT",
    }),
});

const userAccountResponseSchema = z.object({
    ...successResponse,
    data: z.array(
        z.object({
            account_id: z.number(),
            account_type: z.string(),
            balance: z.number(),
            transaction: z.array(
                z.object({
                    transaction_id: z.number(),
                    payment_type: z.string(),
                    amount: z.number(),
                    comment: z.number(),
                })
            ),
        })
    ),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AccountInput = z.infer<typeof createPaymentAccountSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
    {
        createUserSchema,
        createUserResponseSchema,
        loginSchema,
        loginResponseSchema,
        createPaymentAccountSchema,
        createPaymentAccountResponseSchema,
        userAccountResponseSchema,
    },
    { $id: "userSchemaId" }
);
