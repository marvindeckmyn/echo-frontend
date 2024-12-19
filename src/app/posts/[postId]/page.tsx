'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import PostCard from '@/components/post/PostCard';
import CommentSection from '@/components/post/CommentSection';

interface TransformedPost {
    id: string;
    content: string;
    createdAt: string;
    author: {
        id: string;
        name: string | null;
        username: string;
        image: string | null;
    };
    isLiked: boolean;
    isBookmarked: boolean;
    likeCount: number;
    bookmarkCount: number;
    commentCount: number;
}

export default function PostDetail() {
    const params = useParams();
    const router = useRouter();
    const postId = params?.postId as string;

    const { data: post, isLoading, error } = useQuery<TransformedPost>({
        queryKey: ['post', postId],
        queryFn: async () => {
            const response = await fetch(`/api/posts/${postId}`);
            if (!response.ok) {
                if (response.status === 404) {
                    router.push('/404');
                    return null;
                }
                throw new Error('Failed to fetch post');
            }
            return response.json();
        },
    });

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center min-h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            );
        }

        if (error || !post) {
            return (
                <div className="text-red-500 text-center p-4">
                    Error loading post. Please try again later.
                </div>
            );
        }

        return (
            <>
                <PostCard
                    id={post.id}
                    content={post.content}
                    createdAt={post.createdAt}
                    author={post.author}
                    initialLikeCount={post.likeCount}
                    initialBookmarkCount={post.bookmarkCount}
                    initialLiked={post.isLiked}
                    initialBookmarked={post.isBookmarked}
                    commentCount={post.commentCount}
                />
                <CommentSection postId={postId as string} showAll={true} />
            </>
        );
    };

    return (
        <div className="min-h-screen bg-background pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Left Sidebar */}
                    <div className="hidden md:block md:col-span-1">
                        <div className="bg-background rounded-lg shadow p-4 sticky top-20">
                            <nav className="space-y-2">
                                <a href="/" className="flex items-center px-4 py-2 text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                                    Home
                                </a>
                                <a href="/profile" className="flex items-center px-4 py-2 text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                                    Profile
                                </a>
                                <a href="/bookmarks" className="flex items-center px-4 py-2 text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                                    Bookmarks
                                </a>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-1 md:col-span-2">
                        {renderContent()}
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