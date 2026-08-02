import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import AddressClient from "./AddressClient";
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

export interface Address {
  id: string;
  user_id: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  postal_code: string | null;
  country: string;
  is_default: boolean | null;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
}

export default async function AddressPage() {
  const cookie = (await headers()).get("cookie");

  const [cartRes, addressRes, userRes] = await Promise.all([
    fetch(`http://localhost:3040/api/cart`, {
      headers: {
        cookie: cookie ?? "",
      },
      cache: "no-store",
    }),
    fetch(`http://localhost:3040/api/addresses`, {
      headers: {
        cookie: cookie ?? "",
      },
      cache: "no-store",
    }),
    fetch(`http://localhost:3040/api/user`, {
      headers: {
        cookie: cookie ?? "",
      },
      cache: "no-store",
    }),
  ]);

  if (
    cartRes.status === 401 ||
    addressRes.status === 401 ||
    userRes.status === 401
  ) {
    redirect("/login");
  }

  if (cartRes.status === 404) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <h1 className="text-2xl font-semibold">
            Your cart is empty — add items before checkout
          </h1>
        </main>
        <Footer />
      </>
    );
  }

  if (!cartRes.ok || !addressRes.ok || !userRes.ok) {
    notFound();
  }

  const cart: Cart = await cartRes.json();
  const addresses: Address[] = await addressRes.json();
  const user: UserProfile = await userRes.json();

  return (
    <>
      <Navbar />
      <AddressClient
        cart={cart}
        addresses={addresses}
        userId={cart.user_id}
        user={user}
      />
      <Footer />
    </>
  );
}
