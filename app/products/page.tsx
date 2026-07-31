import Image from "next/image";
import Link from "next/link";
import { Heart, ShieldCheck, Truck, Star, ThumbsUp, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Stepper } from "@/components/ui/stepper";

export default function ProductPage() {
  // Sample review data - replace or fetch dynamically as needed
  const ratingBreakdown = [
    { stars: 5, percentage: 88, count: 335 },
    { stars: 4, percentage: 8, count: 30 },
    { stars: 3, percentage: 2, count: 8 },
    { stars: 2, percentage: 1, count: 4 },
    { stars: 1, percentage: 1, count: 4 },
  ];

  const reviews = [
    {
      id: 1,
      author: "Alex Morgan",
      date: "2 days ago",
      rating: 5,
      verified: true,
      title: "Best phone display on the market right now!",
      content:
        "Upgraded from an S21 Ultra and the difference is massive. The flat anti-reflective screen on the S25 Ultra makes outdoor visibility incredible. Battery life comfortably lasts me a full day and a half.",
      likes: 18,
    },
    {
      id: 2,
      author: "David K.",
      date: "1 week ago",
      rating: 5,
      verified: true,
      title: "Unbelievable camera capabilities",
      content:
        "The 200MP sensor combined with the new Snapdragon chip makes processing low-light photos practically instantaneous. S-Pen feels snappier too. High price tag, but worth every penny.",
      likes: 12,
    },
    {
      id: 3,
      author: "Sarah L.",
      date: "2 weeks ago",
      rating: 4,
      verified: true,
      title: "Great phone, but quite large",
      content:
        "Performance and screen are flawless. The titanium body feels light for its size, but if you have smaller hands, definitely try holding one in-store first before buying.",
      likes: 5,
    },
  ];

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Breadcrumb */}
      <p className="text-sm text-muted-foreground mb-8 px-4 sm:px-6 lg:px-18">
        Home / Phones / Samsung / Galaxy S25 Ultra
      </p>

      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] px-4 sm:px-6 lg:px-18">
        {/* Images */}
        <section className="">
         

          {/* Main Image */}
          <div className="aspect-square w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
            <Image
              src="/wal16.png"
              alt="Product image"
              width={900}
              height={900}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        {/* Product Info */}
        <aside className="sticky top-8 h-fit space-y-8">
          <div>
            <p className="text-sm text-muted-foreground">Samsung</p>

            <h1 className="mt-2 text-4xl font-bold">Galaxy S25 Ultra</h1>
            <p className="mt-2 text-muted-foreground">
              The Galaxy S25 Ultra features a 6.9-inch AMOLED display,
              Snapdragon processor, 200MP camera, and an all-day battery.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-primary stroke-primary" />
                ))}
              </div>

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
              <button className="size-8 rounded-full border bg-black ring-offset-2 focus:ring-2 focus:ring-black" />
              <button className="size-8 rounded-full border bg-gray-300" />
              <button className="size-8 rounded-full border bg-blue-300" />
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-3">
            <h3 className="font-medium">Quantity</h3>

            <Stepper />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button className="w-full h-12 rounded-full">Add to Cart</Button>
            <Link href="/checkout">
              <Button variant="outline" className="w-full h-12 rounded-full">
                Buy Now
              </Button>
            </Link>

            <Button variant="ghost" className="w-full h-12 rounded-full">
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

      {/* Details & Reviews */}
      <section className="mt-20 space-y-16 px-4 sm:px-6 lg:px-18">
        {/* Specifications */}
        <div>
          <h2 className="text-2xl font-semibold">Specifications</h2>

          <div className="mt-6 grid grid-cols-2 gap-6 max-w-3xl">
            <p className="text-muted-foreground">Display</p>
            <p className="font-medium">6.9&quot; AMOLED</p>

            <p className="text-muted-foreground">Processor</p>
            <p className="font-medium">Snapdragon 8 Elite</p>

            <p className="text-muted-foreground">RAM</p>
            <p className="font-medium">12 GB</p>

            <p className="text-muted-foreground">Storage</p>
            <p className="font-medium">256 GB</p>

            <p className="text-muted-foreground">Battery</p>
            <p className="font-medium">5000 mAh</p>

            <p className="text-muted-foreground">Operating System</p>
            <p className="font-medium">Android 16</p>
          </div>
        </div>

        <Separator />

        {/* --- CUSTOMER REVIEWS SECTION --- */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Customer Reviews</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Based on 381 verified purchases
              </p>
            </div>
            <Button className="rounded-full w-fit">Write a Review</Button>
          </div>

          {/* Rating Breakdown & Summary Grid */}
          <div className="mt-8 grid gap-8 md:grid-cols-[250px_1fr] bg-neutral-50 dark:bg-neutral-900/50 p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            {/* Score Overview */}
            <div className="flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 pb-6 md:pb-0 md:pr-8">
              <span className="text-5xl font-extrabold tracking-tight">4.9</span>
              <div className="flex text-primary my-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-5 fill-primary stroke-primary" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                96% of customers recommend this product
              </p>
            </div>

            {/* Rating Bars */}
            <div className="space-y-2 flex flex-col justify-center">
              {ratingBreakdown.map((item) => (
                <div key={item.stars} className="flex items-center gap-3 text-sm">
                  <span className="w-12 text-xs font-medium flex items-center gap-1">
                    {item.stars} <Star className="size-3 fill-current text-muted-foreground" />
                  </span>
                  <div className="h-2 flex-1 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-xs text-right text-muted-foreground">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews List */}
          <div className="mt-10 space-y-8">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-neutral-200 dark:border-neutral-800 pb-8 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex text-primary">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-4 ${
                            i < review.rating
                              ? "fill-primary stroke-primary"
                              : "text-neutral-300 stroke-neutral-300 dark:text-neutral-700"
                          }`}
                        />
                      ))}
                    </div>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="size-3" /> Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {review.date}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-base">{review.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {review.content}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    By {review.author}
                  </span>
                  <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <ThumbsUp className="size-3.5" />
                    Helpful ({review.likes})
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="mt-8 text-center">
            <Button variant="outline" className="rounded-full">
              Load More Reviews
            </Button>
          </div>
        </div>

        <Separator />

        {/* Related Products */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Related Products</h2>

            <Link href="/" className="text-sm font-medium hover:underline">
              View all
            </Link>
          </div>

          <div className="grid mt-8 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Product Cards */}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}