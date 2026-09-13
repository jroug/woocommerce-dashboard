import { Search, SlidersHorizontal, X } from "lucide-react";
import type {
  CustomerJoinedFilter,
  CustomerOrdersFilter,
  CustomerSort,
  CustomerSpentFilter,
  CustomerTypeFilter,
} from "@/types/customer";
const selectClass = "admin-control h-8 cursor-pointer px-2 text-[12px] font-medium outline-none";
interface Props {
  currency: string;
  query: string;
  type: CustomerTypeFilter;
  orders: CustomerOrdersFilter;
  spent: CustomerSpentFilter;
  location: string;
  joined: CustomerJoinedFilter;
  sort: CustomerSort;
  locations: string[];
  hasFilters: boolean;
  onQueryChange: (v: string) => void;
  onTypeChange: (v: CustomerTypeFilter) => void;
  onOrdersChange: (v: CustomerOrdersFilter) => void;
  onSpentChange: (v: CustomerSpentFilter) => void;
  onLocationChange: (v: string) => void;
  onJoinedChange: (v: CustomerJoinedFilter) => void;
  onSortChange: (v: CustomerSort) => void;
  onClear: () => void;
}
export function CustomersToolbar(props: Props) {
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
          <span className="sr-only">Search names, usernames, or email</span>
          <input
            value={props.query}
            onChange={(e) => props.onQueryChange(e.target.value)}
            placeholder="Search name, email, or phone"
            className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[var(--color-text-muted)]"
          />
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0">
          <SlidersHorizontal
            size={15}
            className="shrink-0 text-[var(--color-text-secondary)] xl:hidden"
          />
          <select
            aria-label="Customer type"
            value={props.type}
            onChange={(e) => props.onTypeChange(e.target.value as CustomerTypeFilter)}
            className={selectClass}
          >
            <option value="all">All types</option>
            <option value="new">New</option>
            <option value="returning">Returning</option>
            <option value="high-value">High value</option>
            <option value="no-orders">No orders</option>
          </select>
          <select
            aria-label="Number of orders"
            value={props.orders}
            onChange={(e) => props.onOrdersChange(e.target.value as CustomerOrdersFilter)}
            className={selectClass}
          >
            <option value="all">All orders</option>
            <option value="none">No orders</option>
            <option value="one">1 order</option>
            <option value="repeat">2+ orders</option>
            <option value="five-plus">5+ orders</option>
          </select>
          <select
            aria-label="Total spent"
            value={props.spent}
            onChange={(e) => props.onSpentChange(e.target.value as CustomerSpentFilter)}
            className={selectClass}
          >
            <option value="all">Any spend</option>
            <option value="zero">{money(0)}</option>
            <option value="under-100">Under {money(100)}</option>
            <option value="100-500">
              {money(100)}–{money(500)}
            </option>
            <option value="over-500">Over {money(500)}</option>
          </select>
          <select
            aria-label="Location"
            value={props.location}
            onChange={(e) => props.onLocationChange(e.target.value)}
            className={selectClass}
          >
            <option value="all">All locations</option>
            {props.locations.map((location) => (
              <option value={location} key={location}>
                {location}
              </option>
            ))}
          </select>
          <select
            aria-label="Date joined"
            value={props.joined}
            onChange={(e) => props.onJoinedChange(e.target.value as CustomerJoinedFilter)}
            className={selectClass}
          >
            <option value="all">Any join date</option>
            <option value="7-days">Last 7 days</option>
            <option value="30-days">Last 30 days</option>
            <option value="this-year">This year</option>
          </select>
          <select
            aria-label="Sort customers"
            value={props.sort}
            onChange={(e) => props.onSortChange(e.target.value as CustomerSort)}
            className={selectClass}
          >
            <option value="active-newest">Last active: newest</option>
            <option value="active-oldest">Last active: oldest</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="orders-high">Most orders</option>
            <option value="spent-high">Highest spent</option>
            <option value="spent-low">Lowest spent</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
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
