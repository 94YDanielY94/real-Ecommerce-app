import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import CartClient from "./CartClient";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    price: number;
    description: string | null;
    stock_quantity: number | null;
    product_images: {
      image_url: string;
    }[];
  };
}

export interface Cart {
  id: string;
  user_id: string;
  cart_items: CartItem[];
}

export default async function CartPage() {
  const cookie = (await headers()).get("cookie");

  const res = await fetch(`	http://localhost:3040/api/cart`, {
    headers: {
      cookie: cookie ?? "",
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    redirect("/login");
  }

  if (res.status === 404) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen flex items-center justify-center">
          <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        </main>

        <Footer />
      </>
    );
  }

  if (!res.ok) {
    notFound();
  }

  const cart: Cart = await res.json();

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-6 sm:px-10 md:px-18">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">Your Cart</h1>
          <p className="text-muted-foreground text-sm">
            {cart.cart_items.length} {cart.cart_items.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>
      <CartClient cart={cart} />

      <Footer />
    </>
  );
}
