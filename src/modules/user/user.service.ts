import prisma from "../../utils/prisma";
import { CreateUserInput } from "./user.schema";
import bcrypt from "bcrypt";

const SALT_ROUND = 12;

export async function createUser(input: CreateUserInput) {
    const { password, username } = input;

    const hasedPassword = await bcrypt.hash(password, SALT_ROUND);

    const user = await prisma.user.create({
        data: {
            username,
            password: hasedPassword,
            accounts: {
                create: {
                    balance: 100000, // free $100K balance for new member
                    currency: "USD",
                    account_type: "DEBIT",
                },
            },
        },
    });

    return user;
}

export async function findUserByUsername(username: string) {
    return prisma.user.findUnique({
        where: {
            username: username,
        },
    });
}
