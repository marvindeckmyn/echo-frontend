import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(
    request: Request,
    { params }: { params: { postId: string; commentId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status : 401 }
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

        const comment = await prisma.comment.findUnique({
            where: { id: params.commentId }
        });

        if (!comment || comment.postId !== params.postId) {
            return NextResponse.json(
                { message: "Comment not found" },
                { status: 404 }
            );
        }

        const existingLike = await prisma.commentLike.findUnique({
            where: {
                commentId_userId: {
                    commentId: params.commentId,
                    userId: user.id
                }
            }
        });

        if (existingLike) {
            await prisma.commentLike.delete({
                where: { id: existingLike.id }
            });
            return NextResponse.json({ liked: false });
        }

        await prisma.commentLike.create({
            data: {
                commentId: params.commentId,
                userId: user.id
            }
        });

        return NextResponse.json({ liked: true });
    } catch (error) {
        console.error("Error handling comment like:", error);
        return NextResponse.json(
            { message: "Error handling comment like" },
            { status: 500 }
        );
    }
}