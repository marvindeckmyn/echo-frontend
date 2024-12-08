import { useSession } from 'next-auth/react';
import Head from 'next/head';

const Home = () => {
    const { data: session } = useSession();

    return (
        <>
            <Head>
                <title>Echo - Share Your Voice</title>
                <meta name="description" content="Echo - A modern social platform" />
            </Head>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Left Sidebar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="hidden md:block md:col-span-1">
                        <div className="bg-white rounded-lg shadow p-4">
                            <nav className="space-y-2">
                                <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bgg-gray-100 rounded-md">
                                    Home
                                </a>
                                <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                                    Profile
                                </a>
                                <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                                    Bookmarks
                                </a>
                            </nav>
                        </div>
                    </div>

                    {/*Main Content */}
                    <div className="col-span-1 md:col-span-2">
                        {/* Create Post */}
                        <div className="bg-white rounded-lg shadow mb-6 p-4">
                            {session ? (
                                <div className="space-y-4">
                                    <textarea
                                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="What's happening?"
                                        rows={3}
                                    />
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 float-right">
                                        Echo
                                    </button>
                                </div>
                            ) : (
                                <p className="text-center text-gray-600">Sign in to post</p>
                            )}
                        </div>

                        {/* Feed */}
                        <div className="space-y-6">
                            {/* Sample Post */}
                            <div className="bg-white rounded-lg shadow p-4">
                                <div className="flex space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <h4 className="font-bold">User Name</h4>
                                            <span className="text-gray-500">@username</span>
                                            <span className="text-gray-500">· 1h</span>
                                        </div>
                                        <p className="mt-1">This is a sample post to show how the feed will look. We'll populate this with real data soon!</p>
                                        <div className="mt-3 flex items-center space-x-8">
                                            <button className="text-gray-500 hover:text-blue-500">
                                                <span>💬 0</span>
                                            </button>
                                            <button className="text-gray-500 hover:text-red-500">
                                                <span>❤️ 0</span>
                                            </button>
                                            <button className="text-gray-500 hover:text-green-500">
                                                <span>🔄 0</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="hidden md:block md:col-span-1">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-bold text-lg mb-4">Trending</h3>
                        <div className="space-y-3">
                            <div className="text-sm">
                                <p className="text-gray-500">Trending in Technology</p>
                                <p className="font-bold">#NextJS</p>
                                <p className="text-gray-500">1,234 echoes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;