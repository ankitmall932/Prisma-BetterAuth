import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "../db/prisma";
import { sendEmail } from '@/lib/auth/email';


export const auth = betterAuth( {
    database: prismaAdapter( prisma, {
        provider: "postgresql",
    } ),
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        autoSignIn: false
    },
    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ( { user, url } ) =>
        {
            await sendEmail( {
                to: user.email,
                subject: 'Verify your email',
                text: `Click this link to verify your email: \n\n${ url }`
            } );
        },
        autoSignInAfterVerification: true
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
    plugins: [ nextCookies() ],
} );