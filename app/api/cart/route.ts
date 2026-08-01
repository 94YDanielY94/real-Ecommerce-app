import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const cart = await prisma.carts.findUnique({
      where: {
        user_id: session.user.id,
      },
      include: {
        cart_items: {
          include: {
            products: {
              include: {
                product_images: {
                  where: {
                    is_primary: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json(
        { message: "Cart not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(cart);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const { productId, quantity } = await req.json();

    let cart = await prisma.carts.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!cart) {
      cart = await prisma.carts.create({
        data: {
          user_id: userId,
        },
      });
    }

    const existingItem = await prisma.cart_items.findFirst({
      where: {
        cart_id: cart.id,
        product_id:productId,
      },
    });

    if (existingItem) {
      const updatedItem = await prisma.cart_items.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });

      return NextResponse.json(updatedItem);
    }

    const newItem = await prisma.cart_items.create({
      data: {
        cart_id: cart.id,
        product_id:productId,
        quantity,
      },
    });

    return NextResponse.json(newItem, {
      status: 201,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
