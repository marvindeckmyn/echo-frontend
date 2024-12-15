import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { content } = body;

        if (!content) {
            return NextResponse.json(
                { message: "Content is required" },
                { status: 400 }
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

        const post = await prisma.post.create({
            data: {
                content,
                authorId: user.id
            },
            include: {
                author: {
                    select: {
                        name: true,
                        username: true,
                        image: true
                    }
                }
            }
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error("Post creation error:", error);
        return NextResponse.json(
            { message: "Error creating post" },
            { status: 500 }
        );
    }
}