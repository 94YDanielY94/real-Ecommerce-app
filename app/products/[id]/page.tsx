import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, Star, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { notFound } from "next/navigation";
import PurchaseBox from "@/components/ui/Purchase-box";
import ReviewSection from "@/components/ui/ReviewSection";

interface ProductPageParams {
  id: string;
}

interface ProductPageProps {
  params: Promise<ProductPageParams>;
}

interface ProductCategory {
  name: string;
}

interface ProductImage {
  image_url?: string;
}

interface ProductUser {
  first_name?: string;
  last_name?: string;
}

interface ProductReview {
  id: string;
  rating: number;
  created_at?: string | null;
  comment: string;
  users?: ProductUser;
}

interface RatingBreakdownItem {
  stars: number;
  count: number;
  percentage: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  stock_quantity: number;
  categories?: ProductCategory;
  product_images: ProductImage[];
  specifications?: Record<string, string | number | boolean | null | undefined>;
  reviews?: ProductReview[];
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const res = await fetch(`http://localhost:3040/api/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    notFound();
  }

  const product: Product = await res.json();

  const reviews: ProductReview[] = product.reviews ?? [];
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? reviews.reduce((sum: number, r: ProductReview) => sum + r.rating, 0) /
        reviewCount
      : 0;

  const ratingBreakdown: RatingBreakdownItem[] = [5, 4, 3, 2, 1].map(
    (stars) => {
      const count = reviews.filter(
        (r: ProductReview) => r.rating === stars,
      ).length;
      return {
        stars,
        count,
        percentage:
          reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0,
      };
    },
  );

  const recommendPercentage =
    reviewCount > 0
      ? Math.round(
          (reviews.filter((r: ProductReview) => r.rating >= 4).length /
            reviewCount) *
            100,
        )
      : 0;

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Breadcrumb */}
      <p className="text-sm text-muted-foreground mb-8 px-4 sm:px-6 lg:px-18">
        Home / {product.categories?.name} / {product.name}
      </p>

      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] px-4 sm:px-6 lg:px-18">
        {/* Images */}
        <section className="">
          {/* Main Image */}
          <div className="aspect-square w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
            <Image
              src={product.product_images[0]?.image_url ?? "/placeholder.svg"}
              alt={product.name}
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
            <p className="text-sm text-muted-foreground">
              {product.categories?.name}
            </p>

            <h1 className="mt-2 text-4xl font-bold">{product.name}</h1>
            <p className="mt-2 text-muted-foreground">{product.description}</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-primary stroke-primary"
                  />
                ))}
              </div>

              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} ({reviewCount} Reviews)
              </span>
            </div>

            <h2 className="mt-5 text-4xl font-bold">
              ${Number(product.price).toLocaleString()}
            </h2>
            <p className="text-sm text-emerald-600">
              {product.stock_quantity} in stock
            </p>
          </div>

          <Separator />

          <PurchaseBox
            productId={product.id}
            stockQuantity={product.stock_quantity}
          />

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
        <div className="mt-6 grid grid-cols-2 gap-6 max-w-3xl">
          {Object.entries(product.specifications ?? {}).map(([key, value]) => (
            <div key={key} className="contents">
              <p className="text-muted-foreground capitalize">
                {key.replace(/_/g, " ")}
              </p>

              <p className="font-medium">{String(value)}</p>
            </div>
          ))}
        </div>

        <Separator />

        {/* --- CUSTOMER REVIEWS SECTION --- */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Customer Reviews</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Based on {reviewCount} verified purchases
              </p>
            </div>
            <ReviewSection productId={product.id} />
          </div>

          {/* Rating Breakdown & Summary Grid */}
          <div className="mt-8 grid gap-8 md:grid-cols-[250px_1fr] bg-neutral-50 dark:bg-neutral-900/50 p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            {/* Score Overview */}
            <div className="flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 pb-6 md:pb-0 md:pr-8">
              <span className="text-5xl font-extrabold tracking-tight">
                {averageRating.toFixed(1)}
              </span>
              <div className="flex text-primary my-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="size-5 fill-primary stroke-primary"
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {recommendPercentage}% of customers recommend this product
              </p>
            </div>

            {/* Rating Bars */}
            <div className="space-y-2 flex flex-col justify-center">
              {ratingBreakdown.map((item) => (
                <div
                  key={item.stars}
                  className="flex items-center gap-3 text-sm"
                >
                  <span className="w-12 text-xs font-medium flex items-center gap-1">
                    {item.stars}{" "}
                    <Star className="size-3 fill-current text-muted-foreground" />
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
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="size-3" /> Verified Purchase
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {review.created_at
                      ? new Date(review.created_at).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )
                      : ""}
                  </span>
                </div>

                <div>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {review.comment}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    By {review.users?.first_name} {review.users?.last_name}
                  </span>
                </div>
              </div>
            ))}

            {reviewCount === 0 && (
              <p className="text-sm text-muted-foreground">
                No reviews yet. Be the first to review this product.
              </p>
            )}
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
