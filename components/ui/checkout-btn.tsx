"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";

export default function CheckoutButton({
  cartId,
  userId,
}: {
  cartId: string;
  userId: string;
}) {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data as { url: string };
    },
    onSuccess: (data) => {
      // ✅ Hard redirect to Stripe (not router.push!)
      window.location.href = data.url;
    },
  });

  return (
    <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
      {mutation.isPending ? "Processing..." : "Checkout"}
    </Button>
  );
}
