import { Search, SlidersHorizontal, X } from "lucide-react";
import type { InventoryFilter, PriceFilter, ProductSort, ProductStatus } from "@/types/product";
import type { ProductCategory } from "@/types/product";
interface Props {
  currency: string;
  query: string;
  status: ProductStatus | "all";
  category: string;
  inventory: InventoryFilter;
  price: PriceFilter;
  sort: ProductSort;
  categories: ProductCategory[];
  hasFilters: boolean;
  onQueryChange: (v: string) => void;
  onStatusChange: (v: ProductStatus | "all") => void;
  onCategoryChange: (v: string) => void;
  onInventoryChange: (v: InventoryFilter) => void;
  onPriceChange: (v: PriceFilter) => void;
  onSortChange: (v: ProductSort) => void;
  onClear: () => void;
}
const selectClass = "admin-control h-8 cursor-pointer px-2 text-[12px] font-medium outline-none";
export function ProductsToolbar(props: Props) {
  const money = (value: number) =>
    new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: props.currency,
      maximumFractionDigits: 0,
    }).format(value);
  return (
    <div className="border-b bg-[var(--color-surface-subdued)] p-3">
      <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
        <label className="admin-control flex h-8 min-w-0 flex-1 items-center gap-2 px-2.5 xl:max-w-[300px]">
          <Search size={15} className="shrink-0 text-[var(--color-text-muted)]" />
          <span className="sr-only">Search products</span>
          <input
            value={props.query}
            onChange={(e) => props.onQueryChange(e.target.value)}
            placeholder="Search products or SKU"
            className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[var(--color-text-muted)]"
          />
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0">
          <SlidersHorizontal
            size={15}
            className="shrink-0 text-[var(--color-text-secondary)] xl:hidden"
          />
          <select
            aria-label="Product status"
            value={props.status}
            onChange={(e) => props.onStatusChange(e.target.value as ProductStatus | "all")}
            className={selectClass}
          >
            <option value="all">All statuses</option>
            <option value="publish">Published</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending review</option>
            <option value="private">Private</option>
            <option value="future">Scheduled</option>
            <option value="trash">Trash</option>
          </select>
          <select
            aria-label="Category"
            value={props.category}
            onChange={(e) => props.onCategoryChange(e.target.value)}
            className={selectClass}
          >
            <option value="all">All categories</option>
            {props.categories.map((category) => (
              <option value={category.slug} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            aria-label="Stock status"
            value={props.inventory}
            onChange={(e) => props.onInventoryChange(e.target.value as InventoryFilter)}
            className={selectClass}
          >
            <option value="all">All inventory</option>
            <option value="in-stock">In stock</option>
            <option value="low-stock">Low stock</option>
            <option value="out-of-stock">Out of stock</option>
          </select>
          <select
            aria-label="Price range"
            value={props.price}
            onChange={(e) => props.onPriceChange(e.target.value as PriceFilter)}
            className={selectClass}
          >
            <option value="all">All prices</option>
            <option value="under-50">Under {money(50)}</option>
            <option value="50-100">
              {money(50)}–{money(100)}
            </option>
            <option value="over-100">Over {money(100)}</option>
          </select>
          <select
            aria-label="Sort products"
            value={props.sort}
            onChange={(e) => props.onSortChange(e.target.value as ProductSort)}
            className={selectClass}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
            <option value="price-high">Highest price</option>
            <option value="price-low">Lowest price</option>
            <option value="stock-high">Highest stock</option>
            <option value="stock-low">Lowest stock</option>
          </select>
          {props.hasFilters && (
            <button
              type="button"
              onClick={props.onClear}
              className="admin-control flex h-8 shrink-0 items-center gap-1 px-2 text-[12px] font-medium"
            >
              <X size={13} />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
