import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//Fetching all categories
export const GET = async () => {
  try {
    const categories = await prisma.categories.findMany();
    return new NextResponse(JSON.stringify({ categories }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Error fetching categories" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
