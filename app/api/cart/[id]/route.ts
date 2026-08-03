import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Defensive params handling (works for both Promise and plain object)
    const params = await Promise.resolve(context.params);
    const itemId = params?.id;

    if (!itemId || typeof itemId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid itemId" },
        { status: 400 },
      );
    }

    let body: { quantity?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const quantity = body?.quantity;
    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return NextResponse.json(
        { error: "Quantity must be a positive integer" },
        { status: 400 },
      );
    }

    // Try the update inside a transaction
    try {
      const updatedItem = await prisma.$transaction(async (tx) => {
        const cartItem = await tx.cart_items.findFirst({
          where: {
            id: itemId,
            carts: {
              user_id: session.user.id,
            },
          },
          include: {
            products: true,
          },
        });

        if (!cartItem) {
          throw new Error("CART_ITEM_NOT_FOUND");
        }

        if (
          cartItem.products.stock_quantity !== null &&
          quantity > cartItem.products.stock_quantity
        ) {
          throw new Error("INSUFFICIENT_STOCK");
        }

        return tx.cart_items.update({
          where: { id: itemId },
          data: { quantity },
        });
      });

      return NextResponse.json(updatedItem);
    } catch (txError) {
      if (txError instanceof Error) {
        if (txError.message === "CART_ITEM_NOT_FOUND") {
          return NextResponse.json(
            { error: "Cart item not found" },
            { status: 404 },
          );
        }
        if (txError.message === "INSUFFICIENT_STOCK") {
          return NextResponse.json(
            { error: "Not enough stock available" },
            { status: 400 },
          );
        }
      }
      throw txError; // Re-throw unknown DB errors to outer catch
    }
  } catch (error) {
    console.error("PATCH /api/cart/[itemId] fatal error:", error);

    // Return the actual error message in development
    const isDev = process.env.NODE_ENV === "development";
    return NextResponse.json(
      {
        error: "Internal server error",
        ...(isDev && {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        }),
      },
      { status: 500 },
    );
  }
}

export const DELETE = async (
  _req: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await Promise.resolve(context.params);
    const id = params?.id;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid itemId" },
        { status: 400 },
      );
    }

    // Ensure the cart item belongs to the authenticated user
    const cartItem = await prisma.cart_items.findFirst({
      where: {
        id,
        carts: {
          user_id: session.user.id,
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 },
      );
    }

    await prisma.cart_items.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { message: "Cart item deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
