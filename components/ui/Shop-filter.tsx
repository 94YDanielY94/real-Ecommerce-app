import PriceRange from "./Price-range";
import CategoryFilter from "./Category-filter";
import SortDropdown from "./sort";

const getCategoriesData = async () => {
  const res = await fetch("http://localhost:3040/api/categories", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};


export default async function ShopFilter() {
  const categoriesData = await getCategoriesData();

  return (
    <section className="w-full px-18 py-6">
      <div className="flex flex-wrap items-start justify-between gap-8">
        <div className="flex-1">
          <h2 className="mb-4 text-xl font-semibold">Categories</h2>
          <CategoryFilter categories={categoriesData.categories} />
        </div>

        <PriceRange />

        <SortDropdown/>
      </div>
    </section>
  );
}
