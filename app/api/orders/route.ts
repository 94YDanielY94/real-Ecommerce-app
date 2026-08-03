import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getOrders } from "@/lib/queries/orders";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await getOrders(
      session.user.id,
      session.user.is_admin === true,
    );

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
