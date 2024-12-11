import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

const Navbar = () => {
    const { data: session } = useSession();

    return (
        <nav className="fixed top-0 w-full bg-background border-b border-gray-200 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <span className="text-xl font-bold text-foreground">Echo</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {session ? (
                            <>
                                <Link 
                                    href="/create" 
                                    className="px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                >
                                    Post
                                </Link>
                                <button 
                                    onClick={() => signOut()} 
                                    className="px-4 py-2 text-foreground hover:text-gray-900 transition-colors"
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => signIn()} 
                                className="px-4 py-2 text-blue-500 hover:text-blue-600 transition-colors"
                            >
                                Sign in
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;