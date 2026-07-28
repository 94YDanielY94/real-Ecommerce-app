'use client'
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Stepper() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex items-center border border-neutral-500 rounded-full w-fit">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
      >
        −
      </Button>

      <span className="w-10 text-center">{quantity}</span>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setQuantity(quantity + 1)}
      >
        +
      </Button>
    </div>
  );
}