import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        const posts = await prisma.post.findMany({
            include: {
                author: {
                    select: {
                        name: true,
                        username: true,
                        image: true
                    }
                },
                likes: {
                    select: {
                        userId: true
                    }
                },
                bookmarks: {
                    select: {
                        userId: true
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        bookmarks: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20
        });

        const transformedPosts = posts.map(post => ({
            ...post,
            isLiked: userId ? post.likes.some(like => like.userId === userId) : false,
            isBookmarked: userId ? post.bookmarks.some(bookmark => bookmark.userId === userId) : false,
            likeCount: post._count.likes,
            bookmarkCount: post._count.bookmarks,
            likes: undefined,
            bookmarks: undefined,
            _count: undefined
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