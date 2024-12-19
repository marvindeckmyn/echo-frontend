'use client';

import { useQuery } from '@tanstack/react-query';
import PostCard from './PostCard';
import { Loader2 } from 'lucide-react';

interface Post {
    id: string;
    content: string;
    createdAt: string;
    author: {
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

export default function PostFeed() {
    const { data: posts, isLoading, error } = useQuery<Post[]>({
        queryKey: ['posts'] as const,
        queryFn: async () => {
            const response = await fetch('/api/posts');
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            return response.json();
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                Error loading posts. Please try again later.
            </div>
        );
    }

    if (!posts?.length) {
        return (
            <div className="text-gray-500 text-center p-4">
                No posts yet. Be the first to post!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <PostCard
                    key={post.id}
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
            ))}
        </div>
    );
}