# Build a REST API with Fastify & Prisma (User & Tansaction Service)

## What am I using?
* Fastify - Web server
* Prisma - Database ORM
* Zod - Request and response validation
* Swagger - API docs
* TypeScript - Types & other cool stuff

## DB Diagram
![Diagram](https://github.com/tangguhriyadi/fastify/image/diagram.png)

## Features
* Create a user at enpoint POST /api/users/register
    It will automatically create 1 payment account with DEBIT type and $100.000 free balance.
* Login at endpoint POST /api/users/login
    I Use JSON Web Token (JWT) for authentication and bcrypt for hashing.
* Get Payment Accounts in your Account at endpoint GET /api/users/payment_account
    You will see you have 1 generated DEBIT account with $100.000 balance and the transaction history.
* Create Payment Account at endpoint POST /api/users/payment_account
    You can create another payment account such as CREDIT Account.
* Transfer Balance to another account at endpoint POST /api/transaction/send
    You can transfer your balance to another account and your balance will deduct after.
* Withdraw your balance at your DEBIT account at endpoint POST /api/transaction/withdraw.
    You can withdraw your balance, it's more like withdrawing a cash money in the ATM, you take your money and your balance will be reduced. 
* Swagger docs

## Build and Deploy in Your Local Device Using Docker

Build Image and run the container with single command:
```bash
docker compose up -d
```

Get Into the API docs [http://localhost:4000/docs](http://localhost:4000/docs) with your browser to see the Swagger docs. And try the features !
