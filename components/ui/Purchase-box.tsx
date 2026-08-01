"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import AddToCartButton from "@/components/ui/Cart-btn";

interface PurchaseBoxProps {
  productId: string;
  stockQuantity: number | null;
}

export default function PurchaseBox({
  productId,
  stockQuantity,
}: PurchaseBoxProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <>
      {/* Quantity */}
      <div className="space-y-3">
        <h3 className="font-medium">Quantity</h3>

        <Stepper
          initialQuantity={1}
          max={stockQuantity ?? Infinity}
          onQuantityChange={setQuantity}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <AddToCartButton
          productId={productId}
          quantity={quantity}
          variant="default"
        />
        <Link href="/checkout">
          <Button variant="outline" className="w-full h-12 rounded-full">
            Buy Now
          </Button>
        </Link>
      </div>
    </>
  );
}
