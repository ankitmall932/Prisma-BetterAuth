'use client';

import { createUserActon } from "@/app/actions/createAction";
import { useActionState } from "react";

export default function User ()
{
    const [ state, formAction, isPending ] = useActionState( createUserActon, { message: '', success: false } );

    return (
        <div>
            { state?.message && (
                <p className={ state.success ? 'text-green-400' : 'text-red-400' }>{ state.message }</p>
            ) }
            <form action={ formAction } className="flex flex-col gap-5 border border-white justify-center items-center w-max">
                <input type="text" name="name" placeholder="please enter your name" className="border border-white rounded-lg p-3 m-3 w-max" required />
                <input type="email" name="email" placeholder="please enter your email" className="border border-white rounded-lg p-3 m-3 w-max" required />
                <input type="tel" name="phone" placeholder="Please enter your mobile number" className="border border-white rounded-lg p-3 m-3 w-max" required />
                <button disabled={ isPending } className="p-3 rounded-2xl bg-blue-500 cursor-pointer disabled:opacity-60">
                    { isPending ? 'Submitting...' : 'Submit' }
                </button>
            </form>
        </div>
    );
}