'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import PostCard from '@/components/post/PostCard';
import CommentSection from '@/components/post/CommentSection';

export default function PostDetail() {
    const params = useParams();
    const postId = params?.postId as string;

    const { data: post, isLoading, error } = useQuery({
        queryKey: ['post', postId],
        queryFn: async () => {
            const response = await fetch(`/api/posts/${postId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch post');
            }
            return response.json();
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                Error loading post. Please try again later.
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <PostCard {...post} />
            <CommentSection postId={postId as string} showAll={true} />
        </div>
    );
}