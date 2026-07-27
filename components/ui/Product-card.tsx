import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { Button } from "./button";
export default function ProductCard() {
  return (
    <div className="w-72 overflow-hidde">
      {/* Image */}
      <div className="relative h-72 bg-neutral-200 rounded-2xl">
        <Image
          src="/placeholder.png"
          alt="Product"
          fill
          className="object-cover"
        />

        <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow">
          <Heart className="h-4 w-4 text-emerald-700" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-2 p-4">
        {/* Name + Price */}
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-semibold">Product name</h2>

          <span className="text-2xl font-medium">$300</span>
        </div>

        {/* Description */}
        <p className="text-sm leading-6 text-neutral-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>

        {/* Rating */}
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

        {/* Button */}
        <Button className={'bg-transparent border-2 border-primary text-black'}>Add to Cart</Button>
      </div>
    </div>
  );
}