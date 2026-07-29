import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import ProductCard from "@/components/ui/Product-card";
import ShopFilters from "@/components/ui/Shop-filter";
import { Suspense } from "react";

const getProductData = async (params?: string) => {
  const url = params
    ? `http://localhost:3040/api/products?${params}`
    : "http://localhost:3040/api/products";

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}) {
  const { category, minPrice, maxPrice,sort } = await searchParams;
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (minPrice) params.set("minPrice", minPrice);
  if (maxPrice) params.set("maxPrice", maxPrice);
  if (sort) params.set("sort", sort);
  const data = await getProductData(params.toString());

  return (
    <div>
      <Navbar />
      <ShopFilters />

      <div className="product-grid flex justify-center flex-wrap gap-8 px-18">
        <Suspense fallback={<div>Loading products...</div>}>
          {data.products?.map((product: any) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
