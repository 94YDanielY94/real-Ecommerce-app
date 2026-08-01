import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";
import { Product } from "@/types/types";
import AddToCartButton from "./Cart-btn";
export default function ProductCard({ data }: { data: Product }) {
  const reviews = data.reviews ?? [];
  const reviewCount = reviews.length;
  const rating =
    reviewCount > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;

  return (
    <div>
      <div className="flex-1 max-w-96 min-w-60 overflow-hidden">
        <Link href={`/products/${data.id}`}>
          <div className="relative h-72 bg-neutral-200 rounded-2xl group ">
            <Image
              src={`${data.product_images[0].image_url}`}
              alt="Product"
              fill
              className="object-cover rounded-2xl object-center"
            />

            <button className="productLink absolute cursor-pointer bottom-0 right-3 flex p-3 items-center justify-center rounded-2xl bg-white shadow opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bottom-3">
              <svg
                fill="#000000"
                width="30px"
                height="30px"
                viewBox="0 0 0.9 0.9"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0.123 0.777a0.037 0.037 0 0 1 0 -0.053L0.659 0.188H0.45a0.037 0.037 0 0 1 0 -0.075h0.3a0.037 0.037 0 0 1 0.037 0.037v0.3a0.037 0.037 0 0 1 -0.075 0V0.241L0.177 0.777a0.037 0.037 0 0 1 -0.053 0" />
              </svg>
            </button>
          </div>
        </Link>

        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-2xl font-semibold">{data.name}</h2>

            <span className="text-2xl font-medium">${data.price}</span>
          </div>

          <p className="text-sm leading-6 text-neutral-600">
            {data.description}
          </p>

          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.round(rating)
                      ? "fill-emerald-700 text-emerald-700"
                      : "fill-neutral-300 text-neutral-300"
                  }`}
                />
              ))}
            </div>

            <span className="text-sm">{rating.toFixed(1)}</span>
            <span className="text-sm text-neutral-500">({reviewCount})</span>
          </div>

          <AddToCartButton productId={data.id} />
        </div>
      </div>
    </div>
  );
}
