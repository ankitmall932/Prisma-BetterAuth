export default function VerifyEmailPage ()
{
    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-semibold">
                    Check your email
                </h1>

                <p className="mt-2 text-gray-500">
                    We’ve sent you a verification link.
                    <br />
                    Please check your inbox to verify your email.
                </p>
            </div>
        </main>
    );
}