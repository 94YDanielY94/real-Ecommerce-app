import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { addressSchema } from "@/lib/validations/address";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await prisma.addresses.findMany({
      where: { user_id: session.user.id },
      orderBy: [{ is_default: "desc" }, { id: "asc" }],
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const result = addressSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid address data",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = result.data;
    const userId = session.user.id;

    const existingCount = await prisma.addresses.count({
      where: { user_id: userId },
    });

    // First address (or explicit request) becomes the default
    const makeDefault = data.is_default ?? existingCount === 0;

    const address = await prisma.$transaction(async (tx) => {
      if (makeDefault) {
        await tx.addresses.updateMany({
          where: { user_id: userId, is_default: true },
          data: { is_default: false },
        });
      }

      return tx.addresses.create({
        data: {
          user_id: userId,
          address_line1: data.address_line1,
          address_line2: data.address_line2 || null,
          city: data.city,
          state: data.state || null,
          postal_code: data.postal_code || null,
          country: data.country,
          is_default: makeDefault,
        },
      });
    });

    return NextResponse.json(address, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 },
    );
  }
}
