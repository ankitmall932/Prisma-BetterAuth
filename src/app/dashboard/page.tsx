import { getSession } from "@/lib/auth/get-session";
import DashboardClientPage from "./dashboard-client";
import { redirect } from "next/navigation";

export default async function DashboardPage ()
{
    const session = await getSession();
    if ( !session )
    {
        redirect( '/auth' );
    }
    return <DashboardClientPage session={ session } />;
}