## Better Auth Setup Guide

This guide covers Better Auth setup in a Next.js App Router project with Prisma, email/password authentication, email verification, and Google/GitHub sign-in. Update example import paths to match your project structure.

## Contents

1. [Install and configure](#1-install-and-configure)
2. [Connect Prisma](#2-connect-prisma)
3. [Configure Better Auth](#3-configure-better-auth)
4. [Add the auth route handler](#4-add-the-auth-route-handler)
5. [Add server actions](#5-add-server-actions)
6. [Configure verification email](#6-configure-verification-email)
7. [Read and protect sessions](#7-read-and-protect-sessions)
8. [Configure social providers](#8-configure-social-providers)
9. [Call auth from the frontend](#9-call-auth-from-the-frontend)

## 1. Install and configure

Install Better Auth:

```bash
npm install better-auth
```

Add the Better Auth secret and base URL to `.env`:

```env
BETTER_AUTH_SECRET=your-secret-value
BETTER_AUTH_URL=http://localhost:3000
```

Use your production URL for `BETTER_AUTH_URL` in production. Keep secrets out of source control.

## 2. Connect Prisma

Complete the Prisma setup first if the project does not already use Prisma. Generate the Better Auth schema and create a migration:

```bash
npx auth@latest generate
npx prisma migrate dev --name better_auth
```

The auth schema generator adds the models Better Auth needs. Review the generated schema before migrating.

## 3. Configure Better Auth

Create `lib/auth.ts` (or the equivalent location in your project):

```ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "../db/prisma";
import { sendEmail } from "@/lib/email";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        autoSignIn: false,
    },
    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url }) => {
            await sendEmail({
                to: user.email,
                subject: "Verify your email",
                text: `Click this link to verify your email:\n\n${url}`,
            });
        },
        autoSignInAfterVerification: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
    },
    plugins: [nextCookies()],
});
```

## 4. Add the auth route handler

Create `app/api/auth/[...all]/route.ts`:

```ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

This route connects Better Auth endpoints to the Next.js App Router. Keep the handler consistent with Better Auth's Next.js integration.

## 5. Add server actions

Create a server action module, for example `app/actions/auth-actions.ts`:

```ts
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function signUp(email: string, password: string, name: string) {
    return auth.api.signUpEmail({
        body: { email, password, name, callbackURL: "/dashboard" },
    });
}

export async function signIn(email: string, password: string) {
    return auth.api.signInEmail({
        body: { email, password, callbackURL: "/dashboard" },
    });
}

export async function signOut() {
    return auth.api.signOut({
        headers: await headers(),
    });
}
```

Use server actions for operations that need to call Better Auth on the server. Keep reusable session-reading logic in a separate server-only helper.

## 6. Configure verification email

This example uses Brevo SMTP with Nodemailer. Install Nodemailer if needed:

```bash
npm install nodemailer
```

Add these values to `.env`:

```env
BREVO_SMTP_HOST=
BREVO_SMTP_PORT=
BREVO_MAIL_FROM=
BREVO_SMTP_USERNAME=
BREVO_SMTP_PASSWORD=
```

Create `lib/email.ts`:

```ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST!,
    port: Number(process.env.BREVO_SMTP_PORT!),
    secure: false,
    auth: {
        user: process.env.BREVO_SMTP_USERNAME!,
        pass: process.env.BREVO_SMTP_PASSWORD!,
    },
});

export async function sendEmail({
    to,
    subject,
    text,
}: {
    to: string;
    subject: string;
    text: string;
}) {
    await transporter.sendMail({
        from: process.env.BREVO_MAIL_FROM!,
        to,
        subject,
        text,
    });
}
```

Create an `/verify-email` page to give users clear feedback after sign-up and email verification.

## 7. Read and protect sessions

Create a reusable session helper, for example `lib/get-session.ts`:

```ts
import { headers } from "next/headers";
import { auth } from "./auth";

export async function getSession() {
    return auth.api.getSession({
        headers: await headers(),
    });
}
```

Use this helper in Server Components or other server-side code to read the current user and protect pages/actions. For example, a protected dashboard page can redirect unauthenticated visitors:

```tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import DashboardClientPage from "./dashboard-client";

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) {
        redirect("/auth");
    }

    return <DashboardClientPage session={session} />;
}
```

**Server/client boundary:** `getSession()` imports `next/headers`, so use it only in server-side code. Do not import it, or a component that imports it, into a file marked with `"use client"`. Fetch the session in a Server Component and pass the required data to a Client Component as props, or render a Server Component as a child of the client component.

## 8. Configure social providers

Add provider credentials to `.env`:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### GitHub OAuth app

1. In GitHub, open **Settings > Developer settings > OAuth Apps** and create a new OAuth app.
2. Set the application name and homepage URL. For local development, use `http://localhost:3000`.
3. Set the callback URL to `http://localhost:3000/api/auth/callback/github`.
4. Register the app, copy its client ID, and generate a client secret.
5. Add the client ID and secret to `.env`. Use the production domain in the production callback URL.

### Google OAuth client

1. In Google Cloud Console, select or create a project.
2. Configure the OAuth consent screen as required by the project.
3. Create an OAuth client with application type **Web application**.
4. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI.
5. Copy the client ID and secret into `.env`. Add the production callback URI to the OAuth client before deploying.

### Client-side social sign-in helper

Social sign-in starts from the browser, so use the Better Auth client rather than a server action. For example, create `lib/social-login.ts`:

```ts
import { createAuthClient } from "better-auth/react";

export async function socialLogin(provider: "google" | "github") {
    const authClient = createAuthClient();

    await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
    });
}
```

## 9. Call auth from the frontend

Import the server actions and social helper into the client-side auth form. The following handlers assume the component already defines `setIsLoading`, `setError`, `isSignIn`, `email`, `password`, `name`, and `router`:

```tsx
const handleSocialAuth = async (provider: "google" | "github") => {
    setIsLoading(true);
    setError("");

    try {
        await socialLogin(provider);
    } catch (err) {
        setError(
            `Error authenticating with ${provider}: ${
                err instanceof Error ? err.message : "Unknown error"
            }`
        );
    } finally {
        setIsLoading(false);
    }
};

const handleEmailAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
        if (isSignIn) {
            const result = await signIn(email, password);

            if (!result.user) {
                setError("Invalid email or password");
                return;
            }

            router.push("/dashboard");
            return;
        }

        const result = await signUp(email, password, name);

        if (result?.user) {
            router.push("/verify-email");
        }
    } catch (err) {
        setError(
            `Authentication error: ${
                err instanceof Error ? err.message : "Unknown error"
            }`
        );
    } finally {
        setIsLoading(false);
    }
};
```

For sign-out, call the `signOut` server action and then navigate with the client router. Do not call `redirect()` from a client event handler; `redirect()` is for server-side flows (or client rendering), not click handlers.