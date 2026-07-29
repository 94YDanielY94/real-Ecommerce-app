import { NextResponse } from "next/server";

export const GET = () => {
  return new NextResponse(
    JSON.stringify({ message: "Hello from the products API route!" }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
};
