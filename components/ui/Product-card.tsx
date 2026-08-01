import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";
import { Product } from "@/types/types";
import AddToCartButton from "./Cart-btn";
export default function ProductCard({ data }: { data: Product }) {
  return (
    <div>
      <div className="flex-1 max-w-96 min-w-60 overflow-hidden">
        <Link href={"/products"}>
          <div className="relative h-72 bg-neutral-200 rounded-2xl">
            <Image
              src={`${data.product_images[0].image_url}`}
              alt="Product"
              fill
              className="object-cover rounded-2xl object-center"
            />
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
              <Star className="h-3 w-3 fill-emerald-700 text-emerald-700" />
              <Star className="h-3 w-3 fill-emerald-700 text-emerald-700" />
              <Star className="h-3 w-3 fill-emerald-700 text-emerald-700" />
              <Star className="h-3 w-3 fill-emerald-700 text-emerald-700" />
              <Star className="h-3 w-3 fill-neutral-300 text-neutral-300" />
            </div>

            <span className="text-sm">4.0</span>
            <span className="text-sm text-neutral-500">(200)</span>
          </div>

          <AddToCartButton productId={data.id} />
        </div>
      </div>
    </div>
  );
}
