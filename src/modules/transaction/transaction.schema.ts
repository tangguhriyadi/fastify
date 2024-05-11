import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const successResponse = {
    message: z.string(),
};

const transactionSendSchema = z.object({
    recipient_id: z.number({
        required_error: "recipient_id is required",
        invalid_type_error: "recipient_id must be a string",
    }),
    amount: z.number({
        required_error: "amount is required",
        invalid_type_error: "amount must be a number",
    }),
    comment: z
        .string({
            invalid_type_error: "comment must be a string",
        })
        .optional(),
});
const transactionWithdrawSchema = z.object({
    amount: z.number({
        required_error: "amount is required",
        invalid_type_error: "amount must be a number",
    }),
    comment: z
        .string({
            invalid_type_error: "comment must be a string",
        })
        .optional(),
});

const transactionSendResponseSchema = z.object({
    ...successResponse,
    transaction_id: z.number({
        required_error: "recipient_id is required",
        invalid_type_error: "recipient_id must be a number",
    }),
});

export type TransactionSendInput = z.infer<typeof transactionSendSchema>;
export type TransactionWithdrawInput = z.infer<
    typeof transactionWithdrawSchema
>;

export const { schemas: transactionSchemas, $ref } = buildJsonSchemas(
    {
        transactionSendSchema,
        transactionSendResponseSchema,
        transactionWithdrawSchema,
    },
    { $id: "transactionSchemaId" }
);
