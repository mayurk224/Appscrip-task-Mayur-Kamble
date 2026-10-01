import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductListing from "../components/ProductListing";
import { getCompleteProductDataset, PRODUCTS_PER_PAGE } from "../lib/products";
import styles from "./page.module.css";
import { notFound } from "next/navigation";

function parseRequestedPage(value) {
  if (value === undefined) return 1;
  if (typeof value !== "string" || !/^\d+$/.test(value)) return null;

  const page = Number(value);
  return Number.isSafeInteger(page) && page > 0 ? page : null;
}

export default async function Home({ searchParams }) {
  const query = await searchParams;
  const currentPage = parseRequestedPage(query.page);
  if (currentPage === null) notFound();

  const { products, error } = await getCompleteProductDataset();
  const pageCount = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  if (pageCount > 0 ? currentPage > pageCount : currentPage > 1) notFound();

  const listedProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Discover our product",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: listedProducts.map((product, index) => ({
        "@type": "ListItem",
        position: (currentPage - 1) * PRODUCTS_PER_PAGE + index + 1,
        item: {
          "@type": "Product",
          name: product.title,
          ...(product.image ? { image: product.image } : {}),
          ...(product.category ? { category: product.category } : {}),
          ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <Header />
      <main>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroContent}>
            <h1 id="hero-title">Discover our product</h1>
            <p>
              Explore thoughtfully curated pieces designed to bring
              <br className={styles.desktopBreak} /> quality, creativity, and a little inspiration into your
              <br className={styles.desktopBreak} /> everyday life.
            </p>
          </div>
        </section>
        <ProductListing
          products={products}
          currentPage={currentPage}
          hasLoadError={error}
        />
      </main>
      <Footer />
    </>
  );
}
