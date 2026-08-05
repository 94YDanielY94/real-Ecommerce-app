import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/client";

export async function POST(req: Request) {
  console.log("STRIPE WEBHOOK HIT");

  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Webhook signature verification failed";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    console.log("CHECKOUT COMPLETED");

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const cartId = session.metadata?.cartId;
    const shippingAddressId = session.metadata?.shippingAddressId;

    if (!userId || !cartId || !shippingAddressId) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    // Idempotency check
    const existingOrder = await prisma.orders.findFirst({
      where: {
        stripe_session_id: session.id,
      },
    });
    if (existingOrder) {
      return NextResponse.json({ received: true });
    }

    const cart = await prisma.carts.findUnique({
      where: { id: cartId },
      include: { cart_items: { include: { products: true } } },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    if (cart.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Stock validation
    for (const item of cart.cart_items) {
      if (Number(item.products.stock_quantity) < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.products.name}` },
          { status: 400 },
        );
      }
    }
    console.log("adding order");

    try {
      await prisma.$transaction(async (tx) => {
        const orderData: Prisma.ordersUncheckedCreateInput = {
          user_id: userId,
          shipping_address_id: shippingAddressId,
          status: "PROCESSING",
          total_amount: session.amount_total!,
          stripe_session_id: session.id,
          stripe_event_id: event.id,
          order_items: {
            create: cart.cart_items.map((item) => ({
              quantity: item.quantity,
              unit_price: item.products.price,
              products: {
                connect: { id: item.product_id },
              },
            })),
          },
        };

        await tx.orders.create({
          data: orderData,
        });
        console.log("removing cart");

        // Decrement stock per-item with correct quantities
        await Promise.all(
          cart.cart_items.map((item) =>
            tx.products.update({
              where: { id: item.product_id },
              data: { stock_quantity: { decrement: item.quantity } },
            }),
          ),
        );

        await tx.cart_items.deleteMany({ where: { cart_id: cartId } });
      });
    } catch (err: unknown) {
      console.error("Transaction failed:", err);
      return NextResponse.json(
        { error: "Failed to process order" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}
