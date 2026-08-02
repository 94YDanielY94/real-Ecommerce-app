import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { addressSchema } from "@/lib/validations/address";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await Promise.resolve(context.params);
    const id = params?.id;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid address id" },
        { status: 400 },
      );
    }

    // Ensure the address belongs to the authenticated user
    const existing = await prisma.addresses.findFirst({
      where: { id, user_id: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
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
    const makeDefault = data.is_default ?? existing.is_default ?? false;

    const address = await prisma.$transaction(async (tx) => {
      if (makeDefault) {
        await tx.addresses.updateMany({
          where: { user_id: session.user.id, is_default: true, NOT: { id } },
          data: { is_default: false },
        });
      }

      return tx.addresses.update({
        where: { id },
        data: {
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

    return NextResponse.json(address);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await Promise.resolve(context.params);
    const id = params?.id;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid address id" },
        { status: 400 },
      );
    }

    // Ensure the address belongs to the authenticated user
    const existing = await prisma.addresses.findFirst({
      where: { id, user_id: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.addresses.delete({ where: { id } });

      // If the deleted address was the default, promote another one
      if (existing.is_default) {
        const next = await tx.addresses.findFirst({
          where: { user_id: session.user.id },
        });

        if (next) {
          await tx.addresses.update({
            where: { id: next.id },
            data: { is_default: true },
          });
        }
      }
    });

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 },
    );
  }
}
