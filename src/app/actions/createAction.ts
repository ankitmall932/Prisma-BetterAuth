'use server';

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const createUserActon = async ( prevState: unknown, formData: FormData ) =>
{
    try
    {
        const name = formData.get( 'name' ) as string;
        const email = formData.get( 'email' ) as string;
        const phone = formData.get( 'phone' ) as string;
        if ( !name || !email || !phone )
        {
            return { message: 'All fields are required.', success: false };
        }
        const existingUser = await prisma.user.findUnique( {
            where: { email },
        } );
        if ( existingUser )
        {
            return { message: 'This email already exists.', success: false };
        }
        await prisma.user.create( {
            data: {
                name,
                email,
                phone,
            },
        } );
    } catch ( error )
    {
        console.log( error );
        return {
            success: false,
            message: 'User not created'
        };
    }
    redirect( "/users" );
};

export const getUserAction = async () =>
{
    try
    {
        const users = await prisma.user.findMany();
        return users;
    } catch ( error )
    {
        console.log( error );
        throw new Error( 'Failed to fetch user' );
    }
};