import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: { postId: string } }
) {
    try {
        // For now, just get the mos recent comment since we haven't implemented likes for comments yet
        // We'll update this to sort by likes count later
        const topComment = await prisma.comment.findFirst({
            where: {
                postId: params.postId,
                parentId: null, // Only top-level comments
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
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ comment: topComment });
    } catch (error) {
        console.error("Error fetching top comment:", error);
        return NextResponse.json(
            { message: "Error fetching top comment" },
            { status: 500 }
        );
    }
}