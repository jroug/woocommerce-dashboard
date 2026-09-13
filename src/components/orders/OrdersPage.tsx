"use client";
import Link from "next/link";
import { Download, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import type { Order, OrderDateFilter, OrderSort, OrderStatus, PaymentStatus } from "@/types/order";
import { BulkActions } from "./BulkActions";
import { OrdersPagination } from "./OrdersPagination";
import { EmptyOrdersState, NoOrderResults } from "./OrdersStates";
import { OrdersTable } from "./OrdersTable";
import { OrdersToolbar } from "./OrdersToolbar";

const PAGE_SIZE = 7;
const tabs: Array<{ label: string; value: OrderStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "On hold", value: "on-hold" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Refunded", value: "refunded" },
  { label: "Failed", value: "failed" },
];

export function OrdersPage({ initialOrders }: { initialOrders: Order[] }) {
  const extraStatuses = [...new Set(initialOrders.map((order) => order.status))].filter(
    (status) => !tabs.some((tab) => tab.value === status),
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [date, setDate] = useState<OrderDateFilter>("all");
  const [payment, setPayment] = useState<PaymentStatus | "all">("all");
  const [sort, setSort] = useState<OrderSort>("newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const referenceDate = new Date();
    const startOfToday = new Date(referenceDate);
    startOfToday.setHours(0, 0, 0, 0);
    return initialOrders
      .filter((order) => {
        const searchable =
          `${order.number} ${order.customer.firstName} ${order.customer.lastName} ${order.customer.email}`.toLowerCase();
        const ageInDays =
          (referenceDate.getTime() - new Date(order.dateCreated).getTime()) / 86_400_000;
        const matchesDate =
          date === "all" ||
          (date === "today" && ageInDays >= 0 && new Date(order.dateCreated) >= startOfToday) ||
          (date === "7d" && ageInDays >= 0 && ageInDays <= 7) ||
          (date === "30d" && ageInDays >= 0 && ageInDays <= 30);
        return (
          (!normalizedQuery || searchable.includes(normalizedQuery)) &&
          (status === "all" || order.status === status) &&
          (payment === "all" || order.paymentStatus === payment) &&
          matchesDate
        );
      })
      .sort((a, b) => {
        if (sort === "highest") return Number(b.total) - Number(a.total);
        if (sort === "lowest") return Number(a.total) - Number(b.total);
        const difference = new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
        return sort === "newest" ? difference : -difference;
      });
  }, [date, initialOrders, payment, query, sort, status]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const visibleOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = Boolean(
    query || status !== "all" || date !== "all" || payment !== "all" || sort !== "newest",
  );
  const clearFilters = () => {
    setQuery("");
    setStatus("all");
    setDate("all");
    setPayment("all");
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
  const selectOrder = (id: number) =>
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
      const allSelected = visibleOrders.every((order) => next.has(order.id));
      visibleOrders.forEach((order) => (allSelected ? next.delete(order.id) : next.add(order.id)));
      return next;
    });

  return (
    <main className="mx-auto page-container px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold leading-7 tracking-[-.02em] text-[var(--color-text)]">
            Orders
          </h1>
          <p className="mt-0.5 text-[13px] text-[var(--color-text-secondary)]">
            Manage and fulfill customer orders.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="admin-control hidden h-8 items-center gap-1.5 px-3 text-[12px] font-semibold sm:flex"
          >
            <Download size={14} />
            Export
          </button>
          <Link
            href="/orders/new"
            className="flex h-8 items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--color-action)] px-3 text-[12px] font-semibold text-white shadow-[0_1px_0_rgba(0,0,0,.1)] hover:bg-[var(--color-action-hover)]"
          >
            <Plus size={14} />
            Create order
          </Link>
        </div>
      </div>
      <section className="admin-card overflow-hidden" aria-label="Orders list">
        <nav aria-label="Order views" className="overflow-x-auto border-b px-2">
          <div className="flex min-w-max gap-0.5">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.value}
                onClick={() => {
                  setStatus(tab.value);
                  setPage(1);
                }}
                aria-current={status === tab.value ? "page" : undefined}
                className={`relative px-3 py-2.5 text-[13px] font-medium ${status === tab.value ? "text-[var(--color-text)] after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-[var(--color-text)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
        <OrdersToolbar
          extraStatuses={extraStatuses}
          query={query}
          status={status}
          date={date}
          payment={payment}
          sort={sort}
          hasFilters={hasFilters}
          onQueryChange={updateFilter(setQuery)}
          onStatusChange={updateFilter(setStatus)}
          onDateChange={updateFilter(setDate)}
          onPaymentChange={updateFilter(setPayment)}
          onSortChange={updateFilter(setSort)}
          onClear={clearFilters}
        />
        {selected.size > 0 && <BulkActions count={selected.size} />}
        {initialOrders.length === 0 ? (
          <EmptyOrdersState />
        ) : filteredOrders.length === 0 ? (
          <NoOrderResults onClear={clearFilters} />
        ) : (
          <>
            <OrdersTable
              orders={visibleOrders}
              selected={selected}
              onSelect={selectOrder}
              onSelectAll={selectAllVisible}
            />
            <OrdersPagination
              page={page}
              totalPages={totalPages}
              totalItems={filteredOrders.length}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </main>
  );
}
