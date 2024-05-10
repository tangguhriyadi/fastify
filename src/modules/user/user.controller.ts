import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, findUserByUsername } from "./user.service";
import { CreateUserInput, LoginInput } from "./user.schema";
import bcrypt from "bcrypt";
import { server } from "../../app";

export async function registerUserHandler(
    request: FastifyRequest<{
        Body: CreateUserInput;
    }>,
    reply: FastifyReply
) {
    try {
        const user = await createUser(request.body);

        return reply.code(201).send(user);
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
                balance: user.balance,
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
