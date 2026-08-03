import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const VALID_STATUSES = new Set(["PROCESSING", "DELIVERED"]);

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can change order status
    if (session.user.is_admin !== true) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const params = await Promise.resolve(context.params);
    const id = params?.id;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid order id" },
        { status: 400 },
      );
    }

    let body: { status?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const status = body?.status;

    if (typeof status !== "string" || !VALID_STATUSES.has(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be PROCESSING or DELIVERED" },
        { status: 400 },
      );
    }

    const existing = await prisma.orders.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = await prisma.orders.update({
      where: { id },
      data: { status },
      include: {
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        addresses: true,
        order_items: {
          include: {
            products: {
              include: {
                product_images: {
                  where: { is_primary: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to update order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 },
    );
  }
}
