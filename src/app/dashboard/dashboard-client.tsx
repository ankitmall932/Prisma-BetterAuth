/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { signOut } from "../actions/auth/auth-actions";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";

type Session = typeof auth.$Infer.Session;

export default function DashboardClientPage ( { session }: { session: Session; } )
{
    const user = session.user;
    const image = user.image;
    console.log( image );
    if ( !image )
    {
        return null;
    }
    const handleSignOut = async () =>
    {
        await signOut();
        redirect( '/auth' );
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
            {/* Main Content */ }
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-20">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Welcome to Your Dashboard!
                                </h2>
                                <p className="text-gray-600">
                                    Manage your account and explore better-auth features
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-3">
                                    <img
                                        className="h-10 w-10 rounded-full"
                                        src={
                                            image
                                        }
                                        alt="image"
                                        referrerPolicy="no-referrer"
                                    />
                                    <div className="text-sm">
                                        <p className="text-gray-900 font-medium">{ user.name }</p>
                                        <p className="text-gray-500">{ user.email }</p>
                                    </div>
                                </div>
                                <button
                                    onClick={ handleSignOut }
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>

                        {/* Authentication Info */ }
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h3 className="text-lg font-medium text-blue-900 mb-2">
                                Authentication Status
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-blue-700">Status:</span>
                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Authenticated
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-blue-700">Provider:</span>
                                    <span className="ml-2 text-blue-600">Better-Auth</span>
                                </div>
                                <div>
                                    <span className="font-medium text-blue-700">User ID:</span>
                                    <span className="ml-2 text-blue-600">{ user.id }</span>
                                </div>
                                <div>
                                    <span className="font-medium text-blue-700">
                                        Email Verified:
                                    </span>
                                    <span className="ml-2 text-blue-600">{ user.emailVerified ? 'Yes' : 'No' }</span>
                                </div>
                            </div>
                        </div>

                        {/* Demo Features */ }
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                    <svg
                                        className="w-6 h-6 text-indigo-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={ 2 }
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Social Login
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Seamlessly authenticate with Google, GitHub, and other social
                                    providers.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <svg
                                        className="w-6 h-6 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={ 2 }
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    User Management
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Manage user accounts, profiles, and authentication settings.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <svg
                                        className="w-6 h-6 text-purple-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={ 2 }
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Secure Access
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Protected routes and secure authentication flow with
                                    better-auth.
                                </p>
                            </div>
                        </div>

                        {/* Demo Actions */ }
                        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Try These Actions
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={ () => alert( "Mock action: Profile updated!" ) }
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    Update Profile
                                </button>
                                <button
                                    onClick={ () => alert( "Mock action: Settings saved!" ) }
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    Save Settings
                                </button>
                                <button
                                    onClick={ () => alert( "Mock action: Data exported!" ) }
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    Export Data
                                </button>
                            </div>
                        </div>

                        {/* Navigation */ }
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                    href="/"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    ← Back to Home
                                </Link>
                                <Link
                                    href="/auth"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    Manage Account
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}