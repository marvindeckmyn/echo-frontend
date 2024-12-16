import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

const prisma = new PrismaClient();


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

        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId: params.postId,
                    userId: user.id,
                }
            }
        });

        if (existingLike) {
            // Unlike if already liked
            await prisma.like.delete({
                where: {
                    id: existingLike.id
                }
            });
            return NextResponse.json({ liked: false });
        }

        // Create new like
        await prisma.like.create({
            data: {
                postId: params.postId,
                userId: user.id,
            }
        });

        return NextResponse.json({ liked: true });
    } catch (error) {
        console.error("Like error:", error);
        return NextResponse.json(
            { message: "Error processing like" },
            { status: 500 }
        );
    }
}