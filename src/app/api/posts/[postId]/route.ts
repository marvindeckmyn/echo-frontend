import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: { postId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.email ?
            (await prisma.user.findUnique({ where: { email: session.user.email } }))?.id
            : null;

        const post = await prisma.post.findUnique({
            where: {
                id: params.postId,
            },
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
                ... (userId ? {
                    likes: {
                        where: { userId },
                        select: { userId: true }
                    },
                    bookmarks: {
                        where: { userId },
                        select: { userId: true }
                    }
                } : {})
            },
        });

        if (!post) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            );
        }

        // Transform the post data to match the expected format
        const transformedPost = {
            ...post,
            isLiked: !!post.likes?.length,
            isBookmarked: !!post.bookmarks?.length,
            likeCount: post._count.likes,
            bookmarkCount: post._count.bookmarks,
            commentCount: post._count.comments,
            likes: undefined,
            bookmarks: undefined,
        };

        return NextResponse.json(transformedPost);
    } catch (error) {
        console.error("Error fetching post:", error);
        return NextResponse.json(
            { message: "Error fetching post" },
            { status: 500 }
        );
    }
}