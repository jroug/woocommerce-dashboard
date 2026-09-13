"use client";
import Link from "next/link";
import { Download, Plus, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import type {
  Customer,
  CustomerJoinedFilter,
  CustomerOrdersFilter,
  CustomerSort,
  CustomerSpentFilter,
  CustomerTypeFilter,
  CustomerView,
} from "@/types/customer";
import { CustomerMetrics } from "./CustomerMetrics";
import { CustomersPagination } from "./CustomersPagination";
import { EmptyCustomersState, NoCustomerResults } from "./CustomersStates";
import { CustomersTable } from "./CustomersTable";
import { CustomersToolbar } from "./CustomersToolbar";

const PAGE_SIZE = 7;
const tabs: Array<{ label: string; value: CustomerView }> = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Returning", value: "returning" },
  { label: "High value", value: "high-value" },
  { label: "No orders", value: "no-orders" },
];
// Segments can overlap; new customers joined during the last 30 days.
const isType = (customer: Customer, type: CustomerTypeFilter | CustomerView, now: Date) =>
  type === "all" ||
  (type === "new" &&
    new Date(customer.dateCreated) <= now &&
    new Date(customer.dateCreated).getTime() >= now.getTime() - 30 * 86_400_000) ||
  (type === "returning" && customer.ordersCount > 1) ||
  (type === "high-value" && Number(customer.totalSpent) >= 500) ||
  (type === "no-orders" && customer.ordersCount === 0);

export function CustomersPage({
  initialCustomers,
  currency,
}: {
  initialCustomers: Customer[];
  currency: string;
}) {
  const records = initialCustomers;
  const [view, setView] = useState<CustomerView>("all");
  const [query, setQuery] = useState("");
  const [type, setType] = useState<CustomerTypeFilter>("all");
  const [orders, setOrders] = useState<CustomerOrdersFilter>("all");
  const [spent, setSpent] = useState<CustomerSpentFilter>("all");
  const [location, setLocation] = useState("all");
  const [joined, setJoined] = useState<CustomerJoinedFilter>("all");
  const [sort, setSort] = useState<CustomerSort>("active-newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const locations = useMemo(
    () => [...new Set(records.map((item) => item.billing.country).filter(Boolean))].sort(),
    [records],
  );
  const filteredCustomers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const now = new Date();
    return records
      .filter((customer) => {
        const amount = Number(customer.totalSpent);
        const orderMatch =
          orders === "all" ||
          (orders === "none" && customer.ordersCount === 0) ||
          (orders === "one" && customer.ordersCount === 1) ||
          (orders === "repeat" && customer.ordersCount >= 2) ||
          (orders === "five-plus" && customer.ordersCount >= 5);
        const spentMatch =
          spent === "all" ||
          (spent === "zero" && amount === 0) ||
          (spent === "under-100" && amount > 0 && amount < 100) ||
          (spent === "100-500" && amount >= 100 && amount <= 500) ||
          (spent === "over-500" && amount > 500);
        const joinedAt = new Date(customer.dateCreated);
        // Relative ranges use the current date.
        const joinedMatch =
          joined === "all" ||
          (joined === "7-days" &&
            joinedAt <= now &&
            joinedAt.getTime() >= now.getTime() - 7 * 86_400_000) ||
          (joined === "30-days" &&
            joinedAt <= now &&
            joinedAt.getTime() >= now.getTime() - 30 * 86_400_000) ||
          (joined === "this-year" &&
            joinedAt <= now &&
            joinedAt.getFullYear() === now.getFullYear());
        return (
          isType(customer, view, now) &&
          isType(customer, type, now) &&
          (!normalized ||
            `${customer.firstName} ${customer.lastName} ${customer.username ?? ""} ${customer.email} ${customer.phone}`
              .toLowerCase()
              .includes(normalized)) &&
          orderMatch &&
          spentMatch &&
          (location === "all" || customer.billing.country === location) &&
          joinedMatch
        );
      })
      .sort((a, b) => {
        const aName = `${a.firstName} ${a.lastName}`,
          bName = `${b.firstName} ${b.lastName}`;
        if (sort === "name-asc") return aName.localeCompare(bName);
        if (sort === "name-desc") return bName.localeCompare(aName);
        if (sort === "orders-high") return b.ordersCount - a.ordersCount;
        if (sort === "spent-high") return Number(b.totalSpent) - Number(a.totalSpent);
        if (sort === "spent-low") return Number(a.totalSpent) - Number(b.totalSpent);
        if (sort === "active-newest" || sort === "active-oldest") {
          const aDate = a.lastActiveDate ? new Date(a.lastActiveDate).getTime() : null;
          const bDate = b.lastActiveDate ? new Date(b.lastActiveDate).getTime() : null;
          if (aDate === null) return bDate === null ? 0 : 1;
          if (bDate === null) return -1;
          return sort === "active-newest" ? bDate - aDate : aDate - bDate;
        }
        const difference = new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
        return sort === "newest" ? difference : -difference;
      });
  }, [joined, location, orders, query, records, sort, spent, type, view]);
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
  // Local record changes can shrink the result set without changing the requested page.
  const safePage = Math.min(page, totalPages);
  const visibleCustomers = filteredCustomers.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const hasFilters = Boolean(
    view !== "all" ||
    query ||
    type !== "all" ||
    orders !== "all" ||
    spent !== "all" ||
    location !== "all" ||
    joined !== "all" ||
    sort !== "active-newest",
  );
  // A narrower result set may no longer contain the current page.
  const updateFilter =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value);
      setPage(1);
    };
  const clearFilters = () => {
    setView("all");
    setQuery("");
    setType("all");
    setOrders("all");
    setSpent("all");
    setLocation("all");
    setJoined("all");
    setSort("active-newest");
    setPage(1);
  };
  const selectCustomer = (id: number) =>
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
      const allSelected = visibleCustomers.every((item) => next.has(item.id));
      visibleCustomers.forEach((item) => (allSelected ? next.delete(item.id) : next.add(item.id)));
      return next;
    });
  return (
    <main className="mx-auto page-container px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold leading-7 tracking-[-.02em]">Customers</h1>
          <p className="mt-0.5 text-[13px] text-[var(--color-text-secondary)]">
            Manage customer relationships and order activity.
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
            href="/customers/new"
            className="flex h-8 items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--color-action)] px-3 text-[12px] font-semibold text-white hover:bg-[var(--color-action-hover)]"
          >
            <Plus size={14} />
            Add customer
          </Link>
        </div>
      </div>
      <CustomerMetrics customers={filteredCustomers} currency={currency} />
      <section className="admin-card overflow-hidden" aria-label="Customers list">
        <nav aria-label="Customer views" className="overflow-x-auto border-b px-2">
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
        <CustomersToolbar
          currency={currency}
          query={query}
          type={type}
          orders={orders}
          spent={spent}
          location={location}
          joined={joined}
          sort={sort}
          locations={locations}
          hasFilters={hasFilters}
          onQueryChange={updateFilter(setQuery)}
          onTypeChange={updateFilter(setType)}
          onOrdersChange={updateFilter(setOrders)}
          onSpentChange={updateFilter(setSpent)}
          onLocationChange={updateFilter(setLocation)}
          onJoinedChange={updateFilter(setJoined)}
          onSortChange={updateFilter(setSort)}
          onClear={clearFilters}
        />
        {records.length === 0 ? (
          <EmptyCustomersState />
        ) : filteredCustomers.length === 0 ? (
          <NoCustomerResults onClear={clearFilters} query={query} />
        ) : (
          <>
            <CustomersTable
              sort={sort}
              onSortChange={updateFilter(setSort)}
              customers={visibleCustomers}
              selected={selected}
              onSelect={selectCustomer}
              onSelectAll={selectAllVisible}
            />
            <CustomersPagination
              page={safePage}
              totalPages={totalPages}
              totalItems={filteredCustomers.length}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </main>
  );
}
