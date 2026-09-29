import { getSession } from "@/lib/auth/get-session";
import AuthClientPage from "./auth-client";
import { redirect } from "next/navigation";

export default async function AuthPage ()
{
    const session = await getSession();
    if ( session )
    {
        redirect( '/dashboard' );
    }
    return <AuthClientPage />;
}