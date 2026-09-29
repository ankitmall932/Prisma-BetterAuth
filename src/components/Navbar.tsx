
import { getSession } from "@/lib/auth/get-session";
import Link from "next/link";


export default async function Navbar ()
{
    const session = await getSession();
    return (
        <div className="flex flex-row justify-between items-center px-10 py-3">
            <div className=" flex flex-row gap-5">
                <Link href={ `/` }>Home</Link>
                { session &&
                    <Link href={ `/dashboard` }>Dashboard</Link>
                }
            </div>
            <div>
                { !session &&
                    <Link href={ `/auth` }>Signup</Link>
                }
            </div>
        </div>
    );
}