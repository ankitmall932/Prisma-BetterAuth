import { prisma } from "@/lib/prisma";


export default async function UserDetails ( { params }: { params: Promise<{ id: string; }>; } )
{
    const { id } = await params;
    const userId = Number( id );
    const user = await prisma.user.findUnique( {
        where: {
            id: userId
        }
    } );
    return (
        <div>
            <h1> Name : { user?.name }</h1>
            <h1> Email : { user?.email }</h1>
        </div>
    );
}