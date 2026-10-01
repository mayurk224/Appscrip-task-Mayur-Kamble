"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PRODUCTS_PER_PAGE } from "../lib/products";
import styles from "./ProductListing.module.css";

const filterFields = [
  { key: "category", label: "Category" },
  { key: "brand", label: "Brand" },
  { key: "tags", label: "Tags" },
  { key: "rating", label: "Rating" },
];
const ratingOptions = [5, 4, 3, 2, 1];
const LOADING_INDICATOR_DURATION_MS = 220;

function buildFilters(products) {
  return filterFields.map(({ key, label }) => ({
    key,
    label,
    options: key === "rating"
      ? ratingOptions.map(String)
      : [...new Set(products.flatMap((product) => key === "tags" ? product.tags : product[key] ? [product[key]] : []))]
        .sort((a, b) => a.localeCompare(b)),
  }));
}

function formatRatingOption(option) {
  const rating = Number(option);
  return `${"★".repeat(rating)}${"☆".repeat(5 - rating)} & up`;
}

function HeartIcon({ filled }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 8.6c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10A4.6 4.6 0 0 1 12 6a4.6 4.6 0 0 1 8.8 2.6Z" />
    </svg>
  );
}

const ProductToolbar = memo(function ProductToolbar({ total, sidebarVisible, onToggleSidebar, onSortChange, sortBy }) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.productSummary}>
        <span className={styles.productCount}>{total} PRODUCTS</span>
        <button className={styles.sidebarButton} type="button" aria-expanded={sidebarVisible} onClick={onToggleSidebar}>
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 4h14M3 10h14M3 16h14" />
            <path d="m7 2-2 2 2 2M13 8l2 2-2 2M7 14l-2 2 2 2" />
          </svg>
          <span>{sidebarVisible ? "HIDE FILTERS" : "SHOW FILTERS"}</span>
        </button>
      </div>
      <label className={styles.sortControl}>
        <span>SORT BY</span>
        <select value={sortBy} onChange={onSortChange}>
          <option value="recommended">Recommended</option>
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
          <option value="price-low-high">Lowest price</option>
          <option value="price-high-low">Highest price</option>
        </select>
      </label>
    </div>
  );
});

const FilterSidebar = memo(function FilterSidebar({ filters, selectedFilters, onFilterChange, onClearFilters, hasSelectedFilters }) {
  return (
    <aside className={styles.sidebar} aria-label="Filter products">
      <button className={styles.clearFiltersButton} type="button" onClick={onClearFilters} disabled={!hasSelectedFilters}>
        Clear Filters
      </button>
      {filters.map(({ key, label, options }) => (
        <details className={styles.filter} key={key}>
          <summary>{label}</summary>
          <div className={styles.filterOptions}>
            {options.map((option) => (
              <label key={option}>
                <input type="checkbox" checked={selectedFilters[key]?.includes(option) ?? false} onChange={() => onFilterChange(key, option)} />
                <span>{key === "rating" ? formatRatingOption(option) : option}</span>
              </label>
            ))}
          </div>
        </details>
      ))}
    </aside>
  );
});

const ProductGrid = memo(function ProductGrid({ products, wishlist, onToggleWishlist }) {
  return (
    <div className={styles.productGrid}>
      {products.map((product) => {
        const isWishlisted = wishlist.includes(product.id);
        return (
          <article className={styles.productCard} key={product.id}>
            <div className={styles.productImage}>
              <img
                src={product.image}
                alt={product.brand ? `${product.title} by ${product.brand}` : product.title}
                loading="lazy"
              />
              <button
                className={styles.wishlistButton}
                type="button"
                aria-label={isWishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
                aria-pressed={isWishlisted}
                onClick={() => onToggleWishlist(product.id)}
              >
                <HeartIcon filled={isWishlisted} />
              </button>
            </div>
            <div className={styles.productDetails}>
              <h2>{product.title}</h2>
              <div className={styles.priceRating}>
                <p className={styles.price}>${product.price.toFixed(2)}</p>
                <p className={styles.rating} aria-label={`Rated ${product.rating} out of 5`}>
                  <span aria-hidden="true">★</span> {product.rating.toFixed(1)}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
});

const Pagination = memo(function Pagination({ currentPage, pageCount, onPageChange, isUpdating }) {
  if (pageCount <= 1) return null;

  return (
    <nav className={styles.pagination} aria-label="Product pages">
      {currentPage > 1 && <button className={styles.pageLink} type="button" onClick={() => onPageChange(currentPage - 1)} disabled={isUpdating}>Previous</button>}
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
        <button
          className={`${styles.pageLink} ${pageNumber === currentPage ? styles.currentPage : ""}`}
          type="button"
          aria-current={pageNumber === currentPage ? "page" : undefined}
          disabled={isUpdating || pageNumber === currentPage}
          onClick={() => onPageChange(pageNumber)}
          key={pageNumber}
        >
          {pageNumber}
        </button>
      ))}
      {currentPage < pageCount && <button className={styles.pageLink} type="button" onClick={() => onPageChange(currentPage + 1)} disabled={isUpdating}>Next</button>}
    </nav>
  );
});

function updatePageUrl(page, method = "pushState") {
  const url = new URL(window.location.href);
  if (page === 1) url.searchParams.delete("page");
  else url.searchParams.set("page", String(page));
  window.history[method]({ page }, "", `${url.pathname}${url.search}${url.hash}`);
}

export default function ProductListing({ products: allProducts, currentPage: initialPage, hasLoadError }) {
  const catalogRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isUpdating, setIsUpdating] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sortBy, setSortBy] = useState("recommended");
  const [wishlist, setWishlist] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const hasSelectedFilters = Object.values(selectedFilters).some((options) => options.length > 0);
  const filters = useMemo(() => buildFilters(allProducts), [allProducts]);

  const filteredProducts = useMemo(() => allProducts.filter((product) =>
    filters.every(({ key }) => {
      const selectedOptions = selectedFilters[key] ?? [];
      if (selectedOptions.length === 0) return true;
      if (key === "tags") return selectedOptions.some((option) => product.tags?.includes(option));
      if (key === "rating") return selectedOptions.some((option) => product.rating >= Number(option));
      return selectedOptions.includes(product[key]);
    }),
  ), [allProducts, filters, selectedFilters]);
  const pageCount = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const sortedProducts = useMemo(() => {
    if (sortBy === "newest") return [...filteredProducts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sortBy === "popular") return [...filteredProducts].sort((a, b) => b.rating - a.rating);
    if (sortBy === "price-low-high") return [...filteredProducts].sort((a, b) => a.price - b.price);
    if (sortBy === "price-high-low") return [...filteredProducts].sort((a, b) => b.price - a.price);
    return filteredProducts;
  }, [filteredProducts, sortBy]);
  const visibleProducts = sortedProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

  useEffect(() => {
    function syncPageFromHistory() {
      const parsedPage = Number.parseInt(new URL(window.location.href).searchParams.get("page") ?? "1", 10);
      const page = Number.isInteger(parsedPage) ? Math.min(Math.max(parsedPage, 1), pageCount || 1) : 1;
      setCurrentPage(page);
      if (page !== parsedPage) updatePageUrl(page, "replaceState");
    }

    window.addEventListener("popstate", syncPageFromHistory);
    return () => window.removeEventListener("popstate", syncPageFromHistory);
  }, [pageCount]);

  useEffect(() => {
    if (!isUpdating) return undefined;

    const timeout = window.setTimeout(() => setIsUpdating(false), LOADING_INDICATOR_DURATION_MS);
    return () => window.clearTimeout(timeout);
  }, [currentPage, isUpdating]);

  const toggleSidebar = useCallback(() => setSidebarVisible((visible) => !visible), []);
  const handleSortChange = useCallback((event) => setSortBy(event.target.value), []);
  const updateFilter = useCallback((key, value) => {
    setSelectedFilters((current) => {
      const next = { ...current };
      const selectedOptions = next[key] ?? [];
      if (selectedOptions.includes(value)) {
        next[key] = selectedOptions.filter((option) => option !== value);
        if (next[key].length === 0) delete next[key];
      } else {
        next[key] = [...selectedOptions, value];
      }
      return next;
    });
    setCurrentPage(1);
    updatePageUrl(1, "replaceState");
  }, []);
  const clearFilters = useCallback(() => {
    setSelectedFilters({});
    setCurrentPage(1);
    updatePageUrl(1, "replaceState");
  }, []);
  const toggleWishlist = useCallback((productId) => {
    setWishlist((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]);
  }, []);
  const changePage = useCallback((page) => {
    if (page < 1 || page > pageCount || page === currentPage) return;
    setIsUpdating(true);
    catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setCurrentPage(page);
    updatePageUrl(page);
  }, [currentPage, pageCount]);

  return (
    <section className={styles.catalog} aria-label="Products" ref={catalogRef}>
      <ProductToolbar total={filteredProducts.length} sidebarVisible={sidebarVisible} onToggleSidebar={toggleSidebar} onSortChange={handleSortChange} sortBy={sortBy} />
      <div className={`${styles.catalogLayout} ${!sidebarVisible ? styles.sidebarHidden : ""}`}>
        {sidebarVisible && <FilterSidebar filters={filters} selectedFilters={selectedFilters} onFilterChange={updateFilter} onClearFilters={clearFilters} hasSelectedFilters={hasSelectedFilters} />}
        <div className={styles.results} aria-busy={isUpdating}>
          {isUpdating && (
            <div className={styles.updatingIndicator} role="status">
              <span className={styles.loadingSpinner} aria-hidden="true" />
              <span>Updating products…</span>
            </div>
          )}
          {visibleProducts.length > 0 ? (
            <ProductGrid products={visibleProducts} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
          ) : (
            <p className={styles.emptyState} role={hasLoadError ? "alert" : undefined}>
              {hasLoadError ? "Products could not be loaded. Please try again." : "No products match these filters."}
            </p>
          )}
        </div>
      </div>
      <Pagination currentPage={currentPage} pageCount={pageCount} onPageChange={changePage} isUpdating={isUpdating} />
    </section>
  );
}
