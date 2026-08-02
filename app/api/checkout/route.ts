import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "../../../lib/stripe";
import { prisma } from "../../../lib/prisma"; // or your db client

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin") || "http://localhost:3040";

    // Parse body params (cartId, userId, addressId)
    const body = await req.json();
    const { cartId, userId, addressId } = body;

    if (!cartId || !userId || !addressId) {
      return NextResponse.json(
        { error: "Missing cartId, userId or addressId" },
        { status: 400 },
      );
    }

    // Fetch cart with items to build line_items dynamically
    const cart = await prisma.carts.findUnique({
      where: { id: cartId },
      include: {
        cart_items: {
          include: { products: true },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    if (cart.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (cart.cart_items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Verify the shipping address belongs to the same user
    const address = await prisma.addresses.findFirst({
      where: { id: addressId, user_id: userId },
    });

    if (!address) {
      return NextResponse.json(
        { error: "Shipping address not found" },
        { status: 404 },
      );
    }

    // Build Stripe line items from cart
    const line_items = cart.cart_items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.products.name,
          // images: [item.products.image], // optional
        },
        unit_amount: Math.round(Number(item.products.price) * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?canceled=true`, // Add a cancel URL
      metadata: {
        userId,
        cartId,
        shippingAddressId: addressId,
      },
      // Optional: prevent customer from changing quantity
      // allow_promotion_codes: true,
    });

    if (!session.url) {
      throw new Error("Stripe checkout session did not return a redirect URL.");
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout error:", error);

    // Handle Stripe-specific errors
    const message = error?.message || "Internal server error";
    const status = error?.statusCode || 500;

    return NextResponse.json({ error: message }, { status });
  }
}
