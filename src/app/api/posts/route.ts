import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.email ?
            (await prisma.user.findUnique({ where: { email: session.user.email } }))?.id
            : null;

        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        bookmarks: true,
                        comments: true,
                    }
                },
                likes: userId ? {
                    where: { userId }
                } : false,
                bookmarks: userId ? {
                    where: { userId }
                } : false,
            },
            take: 20
        });

        const transformedPosts = posts.map(post => ({
            ...post,
            isLiked: post.likes.length > 0,
            isBookmarked: post.bookmarks.length > 0,
            likeCount: post._count.likes,
            bookmarkCount: post._count.bookmarks,
            commentCount: post._count.comments,
            likes: undefined,
            bookmarks: undefined,
        }));

        return NextResponse.json(transformedPosts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { message: "Error fetching posts" },
            { status: 500 }
        );
    }
}