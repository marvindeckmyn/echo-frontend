import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, username, password, name } = body;

        if (!email || !username || !password) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400}
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "Email or username already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashesdPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                username,
                name: name || username, // Use usernamem as name if no name provided
                password: hashesdPassword,
            },
        });

        return NextResponse.json(
            { message: "User created succesfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Error creating user" },
            { status: 500 }
        );
    }
}