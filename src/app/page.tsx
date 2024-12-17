import { Suspense } from 'react';
import CreatePost from "@/components/post/CreatePost";
import PostFeed from "@/components/post/PostFeed";

export default function Home() {
    return (
        <div className="min-h-screen bg-background pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Left Sidebar */}
                    <div className="hidden md:block md:col-span-1">
                        <div className="bg-background rounded-lg shadow p-4 sticky top-20">
                            <nav className="space-y-2">
                                <a href="#" className="flex items-center px-4 py-2 text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                                    Home
                                </a>
                                <a href="#" className="flex items-center px-4 py-2 text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                                    Profile
                                </a>
                                <a href="#" className="flex items-center px-4 py-2 text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                                    Bookmarks
                                </a>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-1 md:col-span-2">
                        <CreatePost />
                        <Suspense
                            fallback={
                                <div className="text-center p-4">
                                    Loading posts...
                                </div>
                            }
                        >
                            <PostFeed />
                        </Suspense>
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden md:block md:col-span-1">
                        <div className="bg-background rounded-lg shadow p-4 sticky top-20">
                            <h3 className="font-bold text-lg mb-4 text-foreground">Trending</h3>
                            <div className="space-y-3">
                                <div className="text-sm">
                                    <p className="text-gray-500">Trending in Technology</p>
                                    <p className="font-bold text-foreground">#NextJS</p>
                                    <p className="text-gray-500">1,234 echoes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}