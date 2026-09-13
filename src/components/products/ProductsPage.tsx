"use client";
import Link from "next/link";
import { Download, Plus, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import type {
  InventoryFilter,
  PriceFilter,
  Product,
  ProductCategory,
  ProductSort,
  ProductStatus,
} from "@/types/product";
import { BulkActions } from "./BulkActions";
import { getInventoryState } from "./InventoryStatus";
import { ProductsPagination } from "./ProductsPagination";
import { EmptyProductsState, NoProductResults } from "./ProductsStates";
import { ProductsTable } from "./ProductsTable";
import { ProductsToolbar } from "./ProductsToolbar";

const PAGE_SIZE = 15;
type ProductView = "all" | ProductStatus | "out-of-stock" | "low-stock";
const tabs: Array<{ label: string; value: ProductView }> = [
  { label: "All", value: "all" },
  { label: "Published", value: "publish" },
  { label: "Draft", value: "draft" },
  { label: "Pending review", value: "pending" },
  { label: "Private", value: "private" },
  { label: "Scheduled", value: "future" },
  { label: "Out of stock", value: "out-of-stock" },
  { label: "Low stock", value: "low-stock" },
];

export function ProductsPage({
  initialProducts,
  categories,
  currency = "EUR",
}: {
  initialProducts: Product[];
  categories: ProductCategory[];
  currency?: string;
}) {
  // console.log(initialProducts);

  const [view, setView] = useState<ProductView>("all");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProductStatus | "all">("all");
  const [category, setCategory] = useState("all");
  const [inventory, setInventory] = useState<InventoryFilter>("all");
  const [price, setPrice] = useState<PriceFilter>("all");
  const [sort, setSort] = useState<ProductSort>("newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return initialProducts
      .filter((product) => {
        const inventoryState = getInventoryState(product);
        const amount = Number(product.price);
        const viewMatches = view === "all" || view === product.status || view === inventoryState;
        const priceMatches =
          price === "all" ||
          (price === "under-50" && amount < 50) ||
          (price === "50-100" && amount >= 50 && amount <= 100) ||
          (price === "over-100" && amount > 100);
        return (
          viewMatches &&
          (!normalized || `${product.name} ${product.sku}`.toLowerCase().includes(normalized)) &&
          (status === "all" || product.status === status) &&
          (category === "all" ||
            (product.categories ?? [product.category]).some((item) => item.slug === category)) &&
          (inventory === "all" || inventoryState === inventory) &&
          priceMatches
        );
      })
      .sort((a, b) => {
        if (sort === "name-asc") return a.name.localeCompare(b.name);
        if (sort === "name-desc") return b.name.localeCompare(a.name);
        if (sort === "price-high") return Number(b.price) - Number(a.price);
        if (sort === "price-low") return Number(a.price) - Number(b.price);
        if (sort === "stock-high") return (b.stockQuantity ?? 0) - (a.stockQuantity ?? 0);
        if (sort === "stock-low") return (a.stockQuantity ?? 0) - (b.stockQuantity ?? 0);
        const difference = new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
        return sort === "newest" ? difference : -difference;
      });
  }, [category, initialProducts, inventory, price, query, sort, status, view]);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = Boolean(
    view !== "all" ||
    query ||
    status !== "all" ||
    category !== "all" ||
    inventory !== "all" ||
    price !== "all" ||
    sort !== "newest",
  );
  const clearFilters = () => {
    setView("all");
    setQuery("");
    setStatus("all");
    setCategory("all");
    setInventory("all");
    setPrice("all");
    setSort("newest");
    setPage(1);
  };
  // A narrower result set may no longer contain the current page.
  const updateFilter =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value);
      setPage(1);
    };
  const selectProduct = (id: number) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  // Toggle only this page, preserving selections hidden by pagination or filters.
  const selectAllVisible = () =>
    setSelected((current) => {
      const next = new Set(current);
      const allSelected = visibleProducts.every((product) => next.has(product.id));
      visibleProducts.forEach((product) => {
        if (allSelected) next.delete(product.id);
        else next.add(product.id);
      });
      return next;
    });
  return (
    <main className="mx-auto max-w-[1240px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold leading-7 tracking-[-.02em]">Products</h1>
          <p className="mt-0.5 text-[13px] text-[var(--color-text-secondary)]">
            Manage products, pricing, and inventory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="admin-control hidden h-8 items-center gap-1.5 px-3 text-[12px] font-semibold md:flex"
          >
            <Download size={14} />
            Export
          </button>
          <button
            type="button"
            className="admin-control hidden h-8 items-center gap-1.5 px-3 text-[12px] font-semibold sm:flex"
          >
            <Upload size={14} />
            Import
          </button>
          <Link
            href="/products/new"
            className="flex h-8 items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--color-action)] px-3 text-[12px] font-semibold text-white shadow-[0_1px_0_rgba(0,0,0,.1)] hover:bg-[var(--color-action-hover)]"
          >
            <Plus size={14} />
            Add product
          </Link>
        </div>
      </div>
      <section className="admin-card overflow-hidden" aria-label="Products list">
        <nav aria-label="Product views" className="overflow-x-auto border-b px-2">
          <div className="flex min-w-max gap-0.5">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.value}
                onClick={() => {
                  setView(tab.value);
                  setPage(1);
                }}
                aria-current={view === tab.value ? "page" : undefined}
                className={`relative px-3 py-2.5 text-[13px] font-medium ${view === tab.value ? "text-[var(--color-text)] after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-[var(--color-text)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
        <ProductsToolbar
          query={query}
          status={status}
          category={category}
          inventory={inventory}
          price={price}
          sort={sort}
          categories={categories}
          currency={currency}
          hasFilters={hasFilters}
          onQueryChange={updateFilter(setQuery)}
          onStatusChange={updateFilter(setStatus)}
          onCategoryChange={updateFilter(setCategory)}
          onInventoryChange={updateFilter(setInventory)}
          onPriceChange={updateFilter(setPrice)}
          onSortChange={updateFilter(setSort)}
          onClear={clearFilters}
        />
        {selected.size > 0 && <BulkActions count={selected.size} />}{" "}
        {initialProducts.length === 0 ? (
          <EmptyProductsState />
        ) : filteredProducts.length === 0 ? (
          <NoProductResults onClear={clearFilters} />
        ) : (
          <>
            <ProductsTable
              products={visibleProducts}
              selected={selected}
              onSelect={selectProduct}
              onSelectAll={selectAllVisible}
            />
            <ProductsPagination
              page={page}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </main>
  );
}
