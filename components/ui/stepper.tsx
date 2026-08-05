"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface StepperProps {
  initialQuantity?: number;
  max?: number;
  onQuantityChange?: (qty: number) => void;
}

export function Stepper({
  initialQuantity = 1,
  max = Infinity,
  onQuantityChange,
}: StepperProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  // Adjust state during rendering when initialQuantity changes
  const [prevInitial, setPrevInitial] = useState(initialQuantity);
  if (prevInitial !== initialQuantity) {
    setPrevInitial(initialQuantity);
    setQuantity(initialQuantity);
  }

  const updateQuantity = (newQty: number) => {
    const qty = Math.min(Math.max(1, newQty), max);

    setQuantity(qty);
    onQuantityChange?.(qty);
  };

  return (
    <div className="flex items-center border border-neutral-500 rounded-full w-fit">
      <Button
        variant="ghost"
        size="icon"
        disabled={quantity <= 1}
        onClick={() => updateQuantity(quantity - 1)}
      >
        −
      </Button>

      <span className="w-10 text-center">{quantity}</span>

      <Button
        variant="ghost"
        size="icon"
        disabled={quantity >= max}
        onClick={() => updateQuantity(quantity + 1)}
      >
        +
      </Button>
    </div>
  );
}
