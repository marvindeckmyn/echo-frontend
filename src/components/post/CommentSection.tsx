import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import CommentCard from './CommentCard';
import { type Comment } from '@/types';

interface CommentSectionProps {
    postId: string;
    showAll?: boolean; // true for detailed view, false for feed view
}

export default function CommentSection({ postId, showAll = false }: CommentSectionProps) {
    const { data: session } = useSession();
    const [comment, setComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const queryClient = useQueryClient();

    // Query for either all comments or just the top comment
    const { data, isLoading } = useQuery({
        queryKey: ['comments', postId, showAll] as const,
        queryFn: async () => {
            const endpoint = showAll
                ? `/api/posts/${postId}/comments`
                : `/api/posts/${postId}/comments/top`;
            const res = await fetch(endpoint);
            if (!res.ok) throw new Error('Failed to fetch comments');
            return res.json();
        },
    });

    const createComment = useMutation({
        mutationFn: async ({ content, parentId }: {content: string; parentId?: string }) => {
            const res = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, parentId }),
            });
            if (!res.ok) throw new Error('Failed to create comment');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
            setComment('');
            setReplyingTo(null);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        createComment.mutate({
            content: comment,
            parentId: replyingTo || undefined,
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
        );
    }

    const comments = showAll ? data?.comments : (data?.comment ? [data.comment] : []);

    return (
        <div className="space-y-4 mt-4">
            {session && (
                <form onSubmit={handleSubmit} className="space-y-2">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
                        className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                    />
                    <div className="flex justify-end space-x-2">
                        {replyingTo && (
                            <button
                                type="button"
                                onClick={() => setReplyingTo(null)}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={!comment.trim() || createComment.isPending}
                            className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        >
                            {createComment.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                replyingTo ? 'Reply' : 'Comment'
                            )}
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {comments.map((comment: Comment) => (
                    <div key={comment.id} className="space-y-4">
                        <CommentCard
                            comment={comment}
                            onReply={setReplyingTo}
                        />
                        {(comment._count?.replies ?? 0) > 0 && showAll && (
                            <div className="ml-12 space-y-4">
                                {comment.replies?.map((reply: Comment) => (
                                    <CommentCard
                                        key={reply.id}
                                        comment={reply}
                                        isReply={true}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {showAll && data?.totalPages > 1 && (
                    <div className="flex justify-center">
                        <button className="text-blue-500 hover:text-blue-600">
                            Load more comments
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}