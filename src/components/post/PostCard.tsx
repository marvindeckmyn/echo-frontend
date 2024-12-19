import { formatDistanceToNow } from 'date-fns';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Heart, Bookmark, MessageCircle, Repeat2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Author {
    name: string | null;
    username: string;
    image: string | null;
}

interface PostProps {
    id: string;
    content: string;
    createdAt: string;
    author: Author;
    initialLikeCount?: number;
    initialBookmarkCount?: number;
    initialLiked?: boolean;
    initialBookmarked?: boolean;
    commentCount?: number;
}

export default function PostCard({ 
    id,
    content,
    createdAt,
    author,
    initialLikeCount = 0,
    initialBookmarkCount = 0,
    initialLiked = false,
    initialBookmarked = false,
    commentCount = 0
}: PostProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
    const [bookmarkCount, setBookmarkCount] = useState(initialBookmarkCount);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

    const handleLike = async () => {
        if (!session || isLikeLoading) {
            //  Toast notification later, now console log
            console.log('Please log in to like posts');
            return;
        }
        setIsLikeLoading(true);

        try {
            const response = await fetch(`/api/posts/${id}/like`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to like post');
            }
            const data = await response.json();
            setIsLiked(data.liked);
            setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
        } catch (error) {
            console.error('Error liking post:', error);
        } finally {
            setIsLikeLoading(false);
        }
    };

    const handleBookmark = async () => {
        if (!session || isBookmarkLoading) {
            // Toast notification later, now console log
            console.log('Please log in to bookmark posts');
            return;
        }
        setIsBookmarkLoading(true);

        try {
            const response = await fetch(`/api/posts/${id}/bookmark`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to bookmark post');
            }
            const data = await response.json();
            setIsBookmarked(data.bookmarked);
            setBookmarkCount(prev => data.bookmarked ? prev + 1 : prev - 1);
        } catch (error) {
            console.error('Error bookmarking post:', error);
        } finally {
            setIsBookmarkLoading(false);
        }
    };

    const handleCommentClick = (e: React.MouseEvent) => {
        e.preventDefault();
        router.push(`/posts/${id}#comment`);
    }

    return (
        <div className="bg-background rounded-lg shadow p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex space-x-3">
                <div className="flex-shrink-0">
                    {author.image ? (
                        <Image
                            src={author.image}
                            alt={author.name || author.username}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                        <Link
                            href={`/${author.username}`}
                            className="font-bold text-foreground hover:underline"
                        >
                            {author.name || author.username}
                        </Link>
                        <span className="text-gray-500">@{author.username}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500">
                            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                        </span>
                    </div>
                    <p className="mt-1 text-foreground whitespace-pre-wrap">{content}</p>
                    <div className="mt-3 flex items-center space-x-8">
                    <button 
                        className="text-gray-500 hover:text-blue-500 transition-colors flex items-center space-x-2"
                        onClick={handleCommentClick}
                    >
                            <MessageCircle className="w-5 h-5"/>
                            <span>{commentCount}</span>
                        </button>
                        <button
                            onClick={handleLike}
                            className={`flex items-center space-x-2 transition-colors ${
                                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                            }`}
                        >
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                            <span>{likeCount}</span>
                        </button>
                        <button className="text-gray-500 hover:text-green-500 transition-colors flex items-center space-x-2">
                            <Repeat2 className="w-5 h-5" />
                            <span>0</span>
                        </button>
                        <button
                            onClick={handleBookmark}
                            className={`flex items-center space-x-2 transition-colors ${
                                isBookmarked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
                            }`}
                        >
                            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                            <span>{bookmarkCount}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}