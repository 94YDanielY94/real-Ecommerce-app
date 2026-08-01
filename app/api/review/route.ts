import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const { productId, rating, comment } = await req.json();

    // Validate required fields
    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 },
      );
    }

    const parsedRating = Number(rating);

    if (
      !Number.isInteger(parsedRating) ||
      parsedRating < 1 ||
      parsedRating > 5
    ) {
      return NextResponse.json(
        { error: "rating must be an integer between 1 and 5" },
        { status: 400 },
      );
    }

    if (typeof comment !== "string" || comment.trim().length === 0) {
      return NextResponse.json(
        { error: "comment is required" },
        { status: 400 },
      );
    }

    if (comment.length > 2000) {
      return NextResponse.json(
        { error: "comment must be 2000 characters or less" },
        { status: 400 },
      );
    }

    // Ensure the product exists
    const product = await prisma.products.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // A user can only review a product once (unique [user_id, product_id])
    const existingReview = await prisma.reviews.findUnique({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: productId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 409 },
      );
    }

    const review = await prisma.reviews.create({
      data: {
        user_id: userId,
        product_id: productId,
        rating: parsedRating,
        comment: comment.trim(),
      },
      include: {
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
