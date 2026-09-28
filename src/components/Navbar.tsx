import Link from "next/link";


export default function Navbar ()
{
    return (
        <div className="flex flex-row justify-between items-center px-10 py-3">
            <div className=" flex flex-row gap-5">
                <Link href={ `/` }>Home</Link>
                <Link href={ `/create-user` }>Create</Link>
                <Link href={ `/users` }> Users</Link>
            </div>
            <div>
                <h1>Login</h1>
            </div>
        </div>
    );
}