"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import { toast } from "@/components/ui/toast";
import Image from "next/image";
import type { Cart, CartItem } from "./page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useCallback, useRef } from "react";

const fetchCart = async (): Promise<Cart> => {
  const res = await fetch("/api/cart");
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
};
const deleteCartItem = async (id: string) => {
  const res = await fetch(`/api/cart/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to delete item");
  }

  return data;
};
const updateCartQuantity = async ({
  id,
  quantity,
}: {
  id: string;
  quantity: number;
}) => {
  const res = await fetch(`/api/cart/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to update cart");
  }

  return data;
};

export default function CartClient({ cart }: { cart: Cart }) {
  const queryClient = useQueryClient();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Subscribe to cart data so the UI updates after mutations
  const { data: currentCart } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    initialData: cart,
    staleTime: 0,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteCartItem,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      toast.add({
        type: "success",
        title: "Item removed",
        description: "The item was removed from your cart.",
      });
    },

    onError: (error: Error) => {
      toast.add({
        type: "error",
        title: "Error",
        description: error.message,
      });
    },
  });
  const mutation = useMutation({
    mutationFn: updateCartQuantity,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      toast.add({
        type: "success",
        title: "Cart updated",
        description: "Quantity changed successfully",
      });
    },

    onError: (error: Error) => {
      console.error(error);

      toast.add({
        type: "error",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleQuantityChange = useCallback(
    (id: string, quantity: number) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        mutation.mutate({ id, quantity });
      }, 300);
    },
    [mutation],
  );

  // Use currentCart (fetched data) instead of the static prop
  const items = currentCart?.cart_items ?? [];
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.products.price) * item.quantity,
    0,
  );

  const estimatedTax = subtotal * 0.065;
  const total = subtotal + estimatedTax;

  return (
    <main className="space-y-8 min-h-screen flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full space-y-8 px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            {items.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden shadow-none border border-neutral-300"
              >
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="relative w-full sm:w-36 h-48 sm:h-36 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={
                        item.products.product_images[0]?.image_url ??
                        "/placeholder.svg"
                      }
                      alt={item.products.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h2 className="text-lg sm:text-xl font-semibold">
                          {item.products.name}
                        </h2>
                        <p className="text-base sm:text-lg font-medium sm:hidden">
                          ${Number(item.products.price).toLocaleString()}
                        </p>
                      </div>

                      <p className="text-sm text-muted-foreground mt-1">
                        {item.products.description}
                      </p>

                      {item.products.stock_quantity !== null && (
                        <p className="text-xs text-emerald-600 font-medium mt-1">
                          ✓ {item.products.stock_quantity} in stock
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-3">
                      <Stepper
                        initialQuantity={item.quantity}
                        max={item.products.stock_quantity ?? Infinity}
                        onQuantityChange={(qty) =>
                          handleQuantityChange(item.id, qty)
                        }
                      />

                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deleteMutation.isPending}
                          onClick={() => deleteMutation.mutate(item.id)}
                          className="h-8 px-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          {deleteMutation.isPending ? "Removing..." : "Remove"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right hidden sm:block shrink-0">
                    <p className="text-lg font-medium">
                      ${Number(item.products.price).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="pt-2">
              <Button variant="link" className="px-0 text-sm">
                <Link href="/">← Continue Shopping</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="h-fit sticky top-24">
              <CardHeader>
                <CardTitle className=" text-xl">Order Summary</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <Separator />

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal ({items.length}{" "}
                    {items.length === 1 ? "item" : "items"})
                  </span>
                  <span className="font-medium">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Tax</span>
                  <span className="font-medium">
                    ${estimatedTax.toFixed(2)}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <Link href="/checkout">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>

                <div className="text-xs text-muted-foreground space-y-1.5 pt-2">
                  <p className="flex items-center gap-1.5">
                    <span>🛡</span> Secure checkout, encrypted payment
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span>📦</span> Free white-glove delivery on this order
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
