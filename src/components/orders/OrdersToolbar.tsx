import { Search, SlidersHorizontal, X } from "lucide-react";
import type { OrderDateFilter, OrderSort, OrderStatus, PaymentStatus } from "@/types/order";

interface OrdersToolbarProps {
  extraStatuses: OrderStatus[];
  query: string;
  status: OrderStatus | "all";
  date: OrderDateFilter;
  payment: PaymentStatus | "all";
  sort: OrderSort;
  hasFilters: boolean;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: OrderStatus | "all") => void;
  onDateChange: (value: OrderDateFilter) => void;
  onPaymentChange: (value: PaymentStatus | "all") => void;
  onSortChange: (value: OrderSort) => void;
  onClear: () => void;
}

const selectClass = "admin-control h-8 cursor-pointer px-2 text-[12px] font-medium outline-none";
export function OrdersToolbar(props: OrdersToolbarProps) {
  return (
    <div className="border-b bg-[var(--color-surface-subdued)] p-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label className="admin-control flex h-8 min-w-0 flex-1 items-center gap-2 px-2.5 lg:max-w-[360px]">
          <Search size={15} className="shrink-0 text-[var(--color-text-muted)]" />
          <span className="sr-only">Search orders</span>
          <input
            value={props.query}
            onChange={(event) => props.onQueryChange(event.target.value)}
            placeholder="Search orders, customers, or email"
            className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[var(--color-text-muted)]"
          />
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <SlidersHorizontal
            size={15}
            className="shrink-0 text-[var(--color-text-secondary)] lg:hidden"
          />
          <select
            aria-label="Status filter"
            value={props.status}
            onChange={(e) => props.onStatusChange(e.target.value as OrderStatus | "all")}
            className={selectClass}
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="on-hold">On hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
            {props.extraStatuses.map((status) => (
              <option key={status} value={status}>
                {status.replaceAll("-", " ")}
              </option>
            ))}
          </select>
          <select
            aria-label="Date filter"
            value={props.date}
            onChange={(e) => props.onDateChange(e.target.value as OrderDateFilter)}
            className={selectClass}
          >
            <option value="all">All dates</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          <select
            aria-label="Payment status filter"
            value={props.payment}
            onChange={(e) => props.onPaymentChange(e.target.value as PaymentStatus | "all")}
            className={selectClass}
          >
            <option value="all">All payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending payment</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed payment</option>
          </select>
          <select
            aria-label="Sort orders"
            value={props.sort}
            onChange={(e) => props.onSortChange(e.target.value as OrderSort)}
            className={selectClass}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest total</option>
            <option value="lowest">Lowest total</option>
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
