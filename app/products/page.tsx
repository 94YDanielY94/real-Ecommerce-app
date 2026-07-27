import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus, ShieldCheck, Truck, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ProductPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      {/* Breadcrumb */}
      <p className="text-sm text-muted-foreground mb-8">
        Home / Phones / Samsung / Galaxy S25 Ultra
      </p>

      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Images */}
        <section className="grid grid-cols-[100px_1fr] gap-4">
          {/* Thumbnails */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((img) => (
              <button
                key={img}
                className="aspect-square overflow-hidden rounded-xl border"
              >
                <Image
                  src={`/products/${img}.jpg`}
                  alt=""
                  width={120}
                  height={120}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className="aspect-square overflow-hidden rounded-2xl border">
            <Image
              src="/products/1.jpg"
              alt=""
              width={900}
              height={900}
              className="h-full w-full object-contain"
            />
          </div>
        </section>

        {/* Product Info */}
        <aside className="sticky top-8 h-fit space-y-8">
          <div>
            <p className="text-sm text-muted-foreground">
              Samsung
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Galaxy S25 Ultra
            </h1>

            <div className="mt-4 flex items-center gap-2">
              <Star className="size-4 fill-current" />
              <Star className="size-4 fill-current" />
              <Star className="size-4 fill-current" />
              <Star className="size-4 fill-current" />
              <Star className="size-4 fill-current" />

              <span className="text-sm text-muted-foreground">
                4.9 (381 Reviews)
              </span>
            </div>

            <h2 className="mt-5 text-4xl font-bold">$1,299</h2>
        </div>

          <Separator />

          {/* Storage */}
          <div className="space-y-3">
            <h3 className="font-medium">Storage</h3>

            <div className="flex gap-3">
              <Button variant="outline">256GB</Button>
              <Button>512GB</Button>
              <Button variant="outline">1TB</Button>
            </div>
          </div>

          {/* Color */}
          <div className="space-y-3">
            <h3 className="font-medium">Color</h3>

            <div className="flex gap-3">
              <button className="size-8 rounded-full border bg-black" />
              <button className="size-8 rounded-full border bg-gray-300" />
              <button className="size-8 rounded-full border bg-blue-300" />
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-3">
            <h3 className="font-medium">Quantity</h3>

            <div className="flex w-fit items-center rounded-lg border">
              <Button size="icon" variant="ghost">
                <Minus />
              </Button>

              <span className="w-10 text-center">1</span>

              <Button size="icon" variant="ghost">
                <Plus />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button className="w-full h-12">
              Add to Cart
            </Button>

            <Button
              variant="outline"
              className="w-full h-12"
            >
              Buy Now
            </Button>

            <Button
              variant="ghost"
              className="w-full"
            >
              <Heart className="mr-2 size-4" />
              Add to Wishlist
            </Button>
          </div>

          <Separator />

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Truck className="size-4" />
              Free delivery
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              1-Year Warranty
            </div>
          </div>
        </aside>
      </div>

      {/* Details */}
      <section className="mt-20 space-y-16">
        <div>
          <h2 className="text-2xl font-semibold">
            Description
          </h2>

          <p className="mt-4 max-w-4xl text-muted-foreground">
            The Galaxy S25 Ultra features a 6.9-inch AMOLED display,
            Snapdragon processor, 200MP camera, and an all-day battery.
          </p>
        </div>

        <Separator />

        <div>
          <h2 className="text-2xl font-semibold">
            Specifications
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-6 max-w-3xl">
            <p>Display</p>
            <p>6.9" AMOLED</p>

            <p>Processor</p>
            <p>Snapdragon 8 Elite</p>

            <p>RAM</p>
            <p>12 GB</p>

            <p>Storage</p>
            <p>256 GB</p>

            <p>Battery</p>
            <p>5000 mAh</p>

            <p>Operating System</p>
            <p>Android 16</p>
          </div>
        </div>

        <Separator />

        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Related Products
            </h2>

            <Link href="/products">
              View all
            </Link>
          </div>

          <div className="grid mt-8 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Product Cards */}
          </div>
        </div>
      </section>
    </main>
  );
}