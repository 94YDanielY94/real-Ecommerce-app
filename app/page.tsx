import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import ProductCard from "@/components/ui/Product-card";
import ShopFilters from "@/components/ui/Shop-filter";
export default function Home() {
  return (
    <div>
      <Navbar />
      <ShopFilters />
      
      <div className="product-grid flex  justify-center flex-wrap gap-8 px-18">
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
      <Footer/>
    </div>
  );
}
