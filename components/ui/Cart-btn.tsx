"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "./toast";

async function addToCart(productId: string, quantity: number = 1) {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to add item");
  }

  return res.json();
}

export default function AddToCartButton({
  productId,
  quantity = 1,
  variant = "default",
}: {
  productId: string;
  quantity?: number;
  variant?: "default" | "outline";
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => addToCart(productId, quantity),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      toast.add({
        type: "success",
        title: "Added to Cart",
        description: "product added successfully",
      });
    },
  });

  return (
    <Button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className={`${variant == "default" ? "" : "bg-transparent border-2 border-primary text-black"}`}
    >
      {mutation.isPending ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
