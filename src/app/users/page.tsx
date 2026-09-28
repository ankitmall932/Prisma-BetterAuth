
import Link from "next/link";
import { getUserAction } from "../actions/createAction";


export default async function User ()
{
    const allUsers = await getUserAction();
    if ( allUsers.length === 0 )
    {
        return (
            <div>
                <h1>No user found</h1>
            </div>
        );
    }
    return (
        <div>
            <h1>All users</h1>
            { allUsers.map( ( user ) => (
                <Link href={ `/users/${ user.id }` } key={ user.id }>
                    <li>{ user.name }</li>
                </Link>
            ) ) }
        </div>
    );
}