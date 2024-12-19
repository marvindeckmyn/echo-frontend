export interface User {
    id: string;
    name: string | null;
    username: string;
    email: string | null;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Post {
    id: string;
    content: string;
    authorId: string;
    author: User;
    createdAt: Date;
    updatedAt: Date;
    likes: Like[];
    bookmarks: Bookmark[];
    comments: Comment[];
    _count?: {
        likes: number;
        bookmarks: number;
        comments: number;
    }
}

export interface Like {
    id: string;
    postId: string;
    userId: string;
    createdAt: Date;
    post: Post;
    user: User;
}

export interface Bookmark {
    id: string;
    postId: string;
    userId: string;
    createdAt: Date;
    post: Post;
    user: User;
}

export interface Comment {
    id: string;
    content: string;
    postId: string;
    userId: string;
    parentId?: string | null;
    createdAt: Date;
    updatedAt: Date;
    post: Post;
    user: User;
    parent?: Comment | null;
    replies?: Comment[];
    likes: CommentLike[];
    _count?: {
        replies: number;
        likes: number;
    }
}

export interface CommentLike {
    id: string;
    commentId: string;
    userId: string;
    createdAt: Date;
    comment: Comment;
    user: User;
}