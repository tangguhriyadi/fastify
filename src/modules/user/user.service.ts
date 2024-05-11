import prisma from "../../utils/prisma";
import { AccountInput, CreateUserInput } from "./user.schema";
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

export async function findUserById(id: number) {
    return prisma.user.findUnique({
        where: {
            id: id,
        },
    });
}

export async function createPaymentAccount(
    input: AccountInput,
    user_id: number
) {
    const account = await prisma.paymentAccount.create({
        data: {
            account_type: input.type,
            user_id: user_id,
            currency: "USD",
            balance: 0,
        },
    });

    return account;
}

export async function findAccountByType(user_id: number, type: string) {
    return await prisma.paymentAccount.findFirst({
        where: {
            account_type: type,
            user_id: user_id,
        },
    });
}

export async function findUserAccountHistory(user_id: number) {
    const response = await prisma.paymentAccount.findMany({
        where: {
            user_id: user_id,
        },
        select: {
            account_id: true,
            account_type: true,
            balance: true,
            payment_history: {
                select: {
                    payment_type: true,
                    transaction_id: true,
                    transaction: {
                        select: {
                            amount: true,
                            comment: true,
                        },
                    },
                },
            },
        },
    });

    const flattenedResponse = response.map((account) => ({
        ...account,
        payment_history: account.payment_history.map((payment) => ({
            transaction_id: payment.transaction_id,
            payment_type: payment.payment_type,
            amount: payment.transaction.amount,
            comment: payment.transaction.comment,
        })),
    }));

    return flattenedResponse;
}
