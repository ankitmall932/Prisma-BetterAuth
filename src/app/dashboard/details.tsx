import { getSession } from "@/lib/auth/get-session";
import Image from "next/image";


export default async function Details ()
{
    const session = await getSession();
    const user = session?.user;
    const image = user?.image;
    if ( !image )
    {
        return null;
    }
    return (
        <>
            <Image
                className="h-10 w-10 rounded-full"
                src={ image }
                alt="image"
            />
            <div className="text-sm">
                <p className="text-gray-900 font-medium">{ user?.name }</p>
                <p className="text-gray-500">{ user?.email }</p>
            </div>
        </>
    );
}