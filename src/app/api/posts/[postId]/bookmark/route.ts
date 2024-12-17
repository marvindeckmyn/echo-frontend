import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

        const existingBookmark = await prisma.bookmark.findUnique({
            where: {
                postId_userId: {
                    postId: params.postId,
                    userId: user.id,
                }
            }
        });

        if (existingBookmark) {
            // Remove bookmark if already bookmarked
            await prisma.bookmark.delete({
                where: {
                    id: existingBookmark.id
                }
            });
            return NextResponse.json({ bookmarked: false });
        }

        // Create new bookmark
        await prisma.bookmark.create({
            data: {
                postId: params.postId,
                userId: user.id,
            }
        });

        return NextResponse.json({ bookmarked: true });
    } catch (error) {
        console.error("Bookmark error:", error);
        return NextResponse.json(
            { message: "Error processing bookmark" },
            { status: 500 }
        );
    }
}