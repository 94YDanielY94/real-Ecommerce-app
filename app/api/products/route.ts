import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/client";

// Fetching all products with active filters
export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const categoryId = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort");
    const search = searchParams.get("search");

    const where: Prisma.productsWhereInput = {};

    // 1. Expanded Search Filter (matches name, description, brand, OR category name)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        {
          categories: {
            name: { contains: search, mode: "insensitive" },
          },
        },
      ];
    }

    // 2. Explicit Category Filter
    if (categoryId) {
      where.category_id = categoryId;
    }

    // 3. Price Filter
    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
        ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
      };
    }

    // 4. Sorting
    let orderBy: Record<string, "asc" | "desc"> = { created_at: "desc" };

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

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 },
    );
  }
};
