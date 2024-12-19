import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();
const COMMENTS_PER_PAGE = 10;

export async function GET(
    request: Request,
    { params }: { params: {postId: string } }
) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const parentId = searchParams.get('parentId') || null;
        const session = await getServerSession(authOptions);

        const comments = await prisma.comment.findMany({
            where: {
                postId: params.postId,
                parentId: parentId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                    }
                },
                likes: session?.user?.email ? {
                    where: {
                        user: {
                            email: session.user.email
                        }
                    },
                    select: {
                        userId: true
                    }
                } : false,
                _count: {
                    select: {
                        replies: true,
                        likes: true,
                    }
                }
            },
            orderBy: [
                {
                    likes: {
                        _count: 'desc'
                    }
                },
                { createdAt: 'desc' }
            ],
            skip: (page - 1) * COMMENTS_PER_PAGE,
            take: COMMENTS_PER_PAGE,
        });

        const totalComments = await prisma.comment.count({
            where: {
                postId: params.postId,
                parentId: parentId,
            }
        });

        return NextResponse.json({
            comments,
            totalPages: Math.ceil(totalComments / COMMENTS_PER_PAGE),
            currentPage: page,
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json(
            { message: "Error fetching comments" },
            { status: 500 }
        );
    }
}

export async function POST(
    request: Request,
    { params }: { params: { postId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const { content, parentId } = await request.json();

        if (!content?.trim()) {
            return NextResponse.json(
                { message: "Comment content is required" },
                { status: 400 }
            );
        }

        // If parentId is provided, verify it exists and belongs to the same post
        if (parentId) {
            const parentComment = await prisma.comment.findUnique({
                where: { id: parentId }
            });

            if (!parentComment || parentComment.postId !== params.postId) {
                return NextResponse.json(
                    { message: "Invalid parent comment" },
                    { status: 400 }
                );
            }
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                postId: params.postId,
                userId: user.id,
                parentId: parentId || null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                    }
                },
                _count: {
                    select: {
                        replies: true,
                        likes: true,
                    }
                },
                likes: {
                    where: {
                        userId: user.id
                    },
                    select: {
                        userId: true
                    }
                }
            }
        });

        return NextResponse.json(comment);
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json(
            { message: "Error creating comment" },
            { status: 500 }
        );
    }
}