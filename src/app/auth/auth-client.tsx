"use client";

import { useState } from "react";
import { signIn, signUp } from "../actions/auth/auth-actions";
import { useRouter } from "next/navigation";
import { socialLogin } from "@/lib/auth/social-login";


export default function AuthClientPage ()
{
    const router = useRouter();
    const [ isSignIn, setIsSignIn ] = useState( true );
    const [ email, setEmail ] = useState( "" );
    const [ password, setPassword ] = useState( "" );
    const [ name, setName ] = useState( "" );
    const [ isLoading, setIsLoading ] = useState( false );
    const [ error, setError ] = useState( "" );


    const handleSocialAuth = async ( provider: "google" | "github" ) =>
    {
        setIsLoading( true );
        setError( "" );
        try
        {
            await socialLogin( provider );
        } catch ( err )
        {
            setError(
                `Error authenticating with ${ provider }: ${ err instanceof Error ? err.message : "Unknown error"
                }`
            );
        } finally
        {
            setIsLoading( false );
        }
    };

    const handleEmailAuth = async ( e: React.FormEvent ) =>
    {
        e.preventDefault();
        setIsLoading( true );
        setError( "" );

        try
        {
            if ( isSignIn )
            {
                const result = await signIn( email, password );
                if ( !result.user )
                {
                    setError( 'Invalid email or password' );
                    return;
                }
                console.log( "Signed in" );
            } else
            {
                const result = await signUp( email, password, name );
                if ( result?.user )
                {
                    if ( result?.user )
                    {
                        router.push( "/verify-email" );
                    }
                }
            }
        } catch ( err )
        {
            setError(
                `Authentication error: ${ err instanceof Error ? err.message : "Unknown error"
                }`
            );
        } finally
        {
            setIsLoading( false );
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
            <div className="flex items-center justify-center p-4 pt-20">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            { isSignIn ? "Welcome Back" : "Create Account" }
                        </h1>
                        <p className="text-gray-600">
                            { isSignIn
                                ? "Sign in to your account to continue"
                                : "Sign up to get started with better-auth" }
                        </p>
                    </div>

                    {/* Error Display */ }
                    { error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex">
                                <div className="shrink-0">
                                    <svg
                                        className="h-5 w-5 text-red-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-800">{ error }</p>
                                </div>
                            </div>
                        </div>
                    ) }

                    {/* Social Authentication */ }
                    <div className="space-y-3">
                        <button
                            onClick={ () => handleSocialAuth( "google" ) }
                            disabled={ isLoading }
                            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </button>

                        <button
                            onClick={ () => handleSocialAuth( "github" ) }
                            disabled={ isLoading }
                            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-900 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg
                                className="w-5 h-5 mr-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Continue with GitHub
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-linear-to-br from-blue-50 to-indigo-100 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* Email/Password Form */ }
                    <form onSubmit={ handleEmailAuth } className="space-y-4">
                        { !isSignIn && (
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required={ !isSignIn }
                                    value={ name }
                                    onChange={ ( e ) => setName( e.target.value ) }
                                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        ) }

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={ email }
                                onChange={ ( e ) => setEmail( e.target.value ) }
                                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete={ isSignIn ? "current-password" : "new-password" }
                                required
                                value={ password }
                                onChange={ ( e ) => setPassword( e.target.value ) }
                                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={ isLoading }
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            { isLoading ? (
                                <div className="flex items-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    { isSignIn ? "Signing in..." : "Creating account..." }
                                </div>
                            ) : isSignIn ? (
                                "Sign In"
                            ) : (
                                "Create Account"
                            ) }
                        </button>
                    </form>

                    {/* Toggle between Sign In and Sign Up */ }
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={ () =>
                            {
                                setIsSignIn( !isSignIn );
                                setError( "" ); // Clear any previous errors
                                setName( "" ); // Clear name when switching modes
                            } }
                            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium transition-colors"
                        >
                            { isSignIn
                                ? "Don't have an account? Sign up"
                                : "Already have an account? Sign in" }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}