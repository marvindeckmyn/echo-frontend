import { formatDistanceToNow } from 'date-fns';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { type Comment } from '../../../types';
import { useRouter } from 'next/navigation';

interface CommentCardProps {
    comment: Comment;
    onReply?: (commentId: string) => void;
    isReply?: boolean;
    postId: string;
}

export default function CommentCard({ comment, onReply, isReply = false, postId }: CommentCardProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLiked, setIsLiked] = useState(
        comment.likes?.some(like => like.userId === session?.user?.id) ?? false
    );
    const [likeCount, setLikeCount] = useState(comment._count?.likes ?? 0);
    const [showReplyInput, setShowReplyInput] = useState(false);

    const handleLike = async () => {
        if (!session) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch(
                `/api/posts/${postId}/comments/${comment.id}/like`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) throw new Error('Failed to like comment');

            const data = await response.json();
            setIsLiked(data.liked);
            setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    const handleReply = () => {
        if (!session) {
            router.push('/login');
            return;
        }
        
        if (onReply) {
            onReply(comment.id);
        }
        setShowReplyInput(true);
    };

    return (
        <div className={`flex space-x-3 ${isReply ? 'ml-12' : ''}`}>
            <div className="flex-shrink-0">
                {comment.user.image ? (
                    <Image
                        src={comment.user.image}
                        alt={comment.user.name || comment.user.username}
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                    <Link
                        href={`/${comment.user.username}`}
                        className="font-medium text-foreground hover:underline"
                    >
                        {comment.user.name || comment.user.username}
                    </Link>
                    <span className="text-gray-500 text-sm">@{comment.user.username}</span>
                    <span className="text-gray-500 text-sm">·</span>
                    <span className="text-gray-500 text-sm">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                </div>

                <p className="mt-1 text-foreground text-sm">{comment.content}</p>

                <div className="mt-2 flex items-center space-x-6">
                    <button
                        onClick={handleLike}
                        className={`flex items-center space-x-1 text-sm ${
                            isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        }`}
                    >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{likeCount}</span>
                    </button>

                    {!isReply && (
                        <button
                            onClick={handleReply}
                            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>{comment._count?.replies || 0}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}