export const getProducts = async (params?: string) => {
  const url = params
    ? `/api/products?${params}`
    : "/api/products";

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
};