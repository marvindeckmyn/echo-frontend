import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

const Navbar = () => {
    const { data: session } = useSession();

    return (
        <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex items-center">
                            <span className="text-xl font-bold">Echo</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex items-center">
                {session ? (
                    <div className="flex items-center space-x-4">
                        <Link href="/create" className="px-4 py-2 rounded-full bg-blue-500 text-white">
                            Post
                        </Link>
                        <button onClick={() => signOut()} className="text-gray-700">
                            Sign out
                        </button>
                    </div>
                ) : (
                    <button onClick={() => signIn()} className="text-blue-500">
                        Sign in
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar