"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

interface WriteReviewFormProps {
  productId: string;
  open: boolean;
  onClose: () => void;
}

export default function WriteReviewForm({
  productId,
  open,
  onClose,
}: WriteReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          comment,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || err.message || "Failed to submit review");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      toast.add({
        type: "success",
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      setRating(0);
      setComment("");
      onClose();
    },
    onError: (error: Error) => {
      toast.add({
        type: "error",
        title: "Error",
        description: error.message,
      });
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Write a Review</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Star Rating */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Your Rating
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const filled = star <= (hoveredRating || rating);
              return (
                <button
                  key={star}
                  type="button"
                  className="p-0.5 transition-transform hover:scale-110"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  <Star
                    className={`size-7 ${
                      filled
                        ? "fill-primary stroke-primary"
                        : "stroke-neutral-300 dark:stroke-neutral-600 fill-transparent"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <label
            htmlFor="review-comment"
            className="text-sm font-medium text-muted-foreground"
          >
            Your Review
          </label>
          <textarea
            id="review-comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <Button
            variant="outline"
            className="flex-1 rounded-full"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-full"
            disabled={rating === 0 || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </div>
    </div>
  );
}
