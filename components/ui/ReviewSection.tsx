"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import WriteReviewForm from "@/components/ui/WriteReviewForm";

export default function ReviewSection({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className="rounded-full w-fit" onClick={() => setOpen(true)}>
        Write a Review
      </Button>

      <WriteReviewForm
        productId={productId}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
