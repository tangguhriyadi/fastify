import { FastifyReply, FastifyRequest } from "fastify";
import {
    createPaymentAccount,
    createUser,
    findAccountByType,
    findUserAccountHistory,
    findUserByUsername,
} from "./user.service";
import { AccountInput, CreateUserInput, LoginInput } from "./user.schema";
import bcrypt from "bcrypt";
import { server } from "../../app";

export async function registerUserHandler(
    request: FastifyRequest<{
        Body: CreateUserInput;
    }>,
    reply: FastifyReply
) {
    try {
        const isAlreadyExist = await findUserByUsername(request.body.username);

        if (isAlreadyExist) {
            return reply.code(400).send({
                message: `Username ${request.body.username} is already exist`,
            });
        }

        const user = await createUser(request.body);

        return reply.code(201).send({
            message: "Success !",
            ...user,
        });
    } catch (err) {
        console.error(err);
        return reply.code(500).send(err);
    }
}
export async function loginHandler(
    request: FastifyRequest<{
        Body: LoginInput;
    }>,
    reply: FastifyReply
) {
    const { username, password } = request.body;

    try {
        // validate user
        const user = await findUserByUsername(username);

        if (!user) {
            return reply.code(401).send({
                message: "Invalid Username",
            });
        }

        // verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            // generate access token
            const JWTPayload = {
                id: user.id,
                username: user.username,
                created_at: user.created_at,
            };

            const expiresIn = 60 * 60 * 1; // 1 hour

            return {
                message: "Success !",
                access_token: server.jwt.sign(JWTPayload, { expiresIn }),
            };
        }

        return reply.code(401).send({
            message: "Invali Email or Password",
        });
    } catch (err) {
        return reply.code(500).send(err);
    }
}

export async function createPaymentAccountHandler(
    request: FastifyRequest<{
        Body: AccountInput;
    }>,
    reply: FastifyReply
) {
    const { type } = request.body;

    const { id: user_id } = request.user;

    try {
        const isAlreadyExist = await findAccountByType(user_id, type);

        if (isAlreadyExist) {
            return reply.code(400).send({
                message: "Account has already exist",
            });
        }

        const account = await createPaymentAccount(request.body, user_id);

        return {
            message: "Success !",
            ...account,
        };
    } catch (err) {
        return reply.code(500).send(err);
    }
}

export async function paymentAccountsHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const { id: user_id } = request.user;
    try {
        const paymentAccounts = await findUserAccountHistory(user_id);
        return reply.code(200).send({
            message: "Success !",
            data: paymentAccounts,
        });
    } catch (err) {
        console.error(err);
        reply.code(500).send(err);
    }
}
