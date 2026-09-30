const PRODUCTS_API_URL = "https://dummyjson.com/products";
export const PRODUCTS_PER_PAGE = 15;

export async function getCompleteProductDataset() {
  const query = new URLSearchParams({
    limit: "0",
    select: "id,title,thumbnail,rating,price,category,brand,tags,meta",
  });

  try {
    const response = await fetch(`${PRODUCTS_API_URL}?${query}`, {
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Product request failed with status ${response.status}`);
    }

    const data = await response.json();
    const products = Array.isArray(data.products)
      ? data.products.map((product) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        rating: product.rating,
        category: product.category,
        brand: product.brand,
        tags: Array.isArray(product.tags) ? product.tags : [],
        createdAt: product.meta?.createdAt ?? "",
        image: product.thumbnail || "",
      }))
      : [];

    return { products, error: false };
  } catch {
    return { products: [], error: true };
  }
}
