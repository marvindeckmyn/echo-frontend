import { formatDistanceToNow } from 'date-fns';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

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
}

export default function PostCard({ id, content, createdAt, author }: PostProps) {
    const { data: session } = useSession();

    return (
        <div className="bg-background rounded-lg shadow p-4 hover:bg-gray-50 transition-colors">
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
                    <button className="text-gray-500 hover:text-blue-500 transition-colors">
                            <span>💬 0</span>
                        </button>
                        <button className="text-gray-500 hover:text-red-500 transition-colors">
                            <span>❤️ 0</span>
                        </button>
                        <button className="text-gray-500 hover:text-green-500 transition-colors">
                            <span>🔄 0</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}