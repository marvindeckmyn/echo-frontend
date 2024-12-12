'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [formValues, setFormValues] = useState({
        email: "",
        password: "",
        username: "",
        name: "", // Optional display name
    });
    const [error, setError] = useState("");

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");

            if (isRegistering) {
                // First register user
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'applicaton/json',
                    },
                    body: JSON.stringify({
                        email: formValues.email,
                        password: formValues.password,
                        username: formValues.username,
                        name: formValues.name,
                    }),
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || 'Registration failed');
                }
            }

            // Then sign in
            const signInRes = await signIn("credentials", {
                redirect: false,
                email: formValues.email,
                password: formValues.password,
            });

            if (!signInRes?.error) {
                router.push("/");
            } else {
                setError("Invalid email or password");
            }
        } catch (error: any) {
            setError(error?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-background px-4 py-8 shadow sm:rounded-lg sm:px-10">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold text-foreground">
                            {isRegistering ? "Create your account": "Sign in to Echo"}
                        </h2>
                    </div>

                    <form className="space-y-6" onSubmit={onSubmit}>
                        {isRegistering && (
                            <>
                                <div>
                                    <label
                                        htmlFor="username"
                                        className="block text-sm font-medium text-foreground"
                                    >
                                        Username
                                    </label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required={isRegistering}
                                        value={formValues.username}
                                        onChange={(e) =>
                                            setFormValues({ ...formValues, username: e.target.value })
                                        }
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-background text-foreground shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                        placeholder="@username"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-foreground"
                                    >
                                        Display Name (optional)
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formValues.name}
                                        onChange={(e) =>
                                            setFormValues({ ...formValues, name: e.target.value })
                                        }
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-background text-foreground shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-foreground"
                            >
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formValues.email}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, email: e.target.value })
                                }
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-background text-foreground shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-foreground"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete={isRegistering ? 'new-password' : 'current-password'}
                                required
                                value={formValues.password}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, password: e.target.value })
                                }
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-background text-foreground shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            />
                        </div>


                        {error && (
                            <div className="text-red-500 text-sm mt-2">{error}</div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Loading..." : (isRegistering ? "Create account" : "Sign in")}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <button
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="w-full text-center text-sm text-blue-500 hover:text-blue-600"
                        >
                            {isRegistering ? "Already have an account? Sign in" : "Need an account? Register"}
                        </button>

                        <div className="relative mt-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-background text-gray-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => signIn("github")}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                GitHub
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}