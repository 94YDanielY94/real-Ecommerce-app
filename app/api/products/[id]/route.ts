import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export const GET = async (_req: Request, { params }: Params) => {
  try {
    const { id } = await params;

    const product = await prisma.products.findUnique({
      where: {
        id,
      },
      include: {
        product_images: true,
        categories: true,
        reviews: {
          include: {
            users: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
              },
            },
          },
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
