import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations/zodauth";
import { z } from 'zod'
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          message: "Invalid data",
          errors: z.treeifyError(result.error),
        },
        {
          status: 400,
        },
      );
    }
    const { email, password } = result.data;
    if (!email || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 },
      );
    }

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.users.create({
      data: {
        email,
        first_name: "",
        last_name: "",
        is_admin: false,
        password_hash: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully.",
        user: {
          id: user.id,
          email: user.email,
        },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
