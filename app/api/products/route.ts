import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//Fetching all products and the filter
export const GET = async (request: Request) => {
  try {
  const { searchParams } = new URL(request.url);

    const categoryId = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort");

    const where: any = {};
    if (categoryId) where.category_id = categoryId;
    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
        ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
      };
    }

    let orderBy: any = { created_at: "desc" };

    switch (sort) {
      case "Price: Low → High":
        orderBy = { price: "asc" };
        break;
      case "Price: High → Low":
        orderBy = { price: "desc" };
        break;
      case "Newest":
      default:
        orderBy = { created_at: "desc" };
        break;
    }

    const products = await prisma.products.findMany({
      where,
      orderBy,
      include: {
        product_images: true,
        categories: true,
      },
    });
    return new NextResponse(JSON.stringify({ products }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Error fetching products" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
