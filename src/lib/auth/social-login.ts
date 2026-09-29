import { createAuthClient } from "better-auth/react";

export const socialLogin = async ( provider: 'google' | 'github' ) =>
{
    const authClient = createAuthClient();
    await authClient.signIn.social( {
        provider,
        callbackURL: '/dashboard'
    } );
};