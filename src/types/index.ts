export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    image?: string;
    bio?: string;
    createdAt: Date;
}

export interface Post {
    id: string;
    content: string;
    authorId: string;
    author: User;
    createdAt: Date;
    updatedAt: Date;
    likes: number;
    replies: number;
}