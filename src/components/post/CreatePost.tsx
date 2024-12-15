import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQueryClient, useMutation } from '@tanstack/react-query';

export default function CreatePost() {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { data: session } =  useSession();
    const queryClient = useQueryClient();

    const createPostMutation = useMutation({
        mutationFn: async (postContent: string) => {
            const response = await fetch('/api/posts/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: postContent }),
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            setContent('');
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            setIsLoading(true);
            await createPostMutation.mutateAsync(content);
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!session) return null;

    return (
        <div className="bg-background rounded-lg shadow p-4 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
                    placeholder="What's happening?"
                    rows={3}
                />
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading || !content.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Posting...' : 'Echo'}
                    </button>
                </div>
            </form>
        </div>
    );
}