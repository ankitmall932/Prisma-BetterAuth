# Prisma v7 Installation Guide

> This setup is for Prisma v7 because most APIs still do not fully support v8 yet.

## 1. Install Prisma

```bash
npm install prisma@prev
npm install @prisma/client@7 @prisma/adapter-pg dotenv
```

## 2. Initialize Prisma

```bash
npx prisma init
```

This will generate:

- `prisma7.config.ts`
- `prisma/schema.prisma`
- `.env`

### Example generated config

`prisma7.config.ts`

```ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

## 3. Define your schema

`prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

Here you define all your models and connect them to the database.

## 4. Connect the database

Add your database URL in the `.env` file created by Prisma.

### For Neon

1. Create a Neon project
2. Click on Connect
3. Copy the generated connection string
4. Paste it into `.env`

Example:

```env
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"
```

## 5. Create the database tables

```bash
npx prisma migrate dev --name init
```

Wait for the command to finish successfully and return a migration message.

## 6. Generate Prisma client

```bash
npx prisma generate
```

This generates the Prisma client under the configured output folder.

## 7. Create Prisma instance

Create `lib/prisma.ts`:

```ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
```

## 8. Use Prisma in your app

```ts
import { prisma } from "./lib/prisma";

await prisma.user.create({
  data: {
    name: "Ankit Mall",
    email: "ankitmall@gmail.com",
  },
});

const allUsers = await prisma.user.findMany();
console.log(allUsers);
```

## 9. Update an existing model

When you change an existing model, run:

```bash
npx prisma migrate dev --name _phone_add
```

You can replace `_phone_add` with any migration name you want.

This same command also works for creating a new model.

---

## Quick summary

1. Install Prisma v7
2. Run `npx prisma init`
3. Add `DATABASE_URL` in `.env`
4. Define models in `schema.prisma`
5. Run `npx prisma migrate dev --name init`
6. Run `npx prisma generate`
7. Use the generated Prisma client
8. Update models with new migration commands as needed