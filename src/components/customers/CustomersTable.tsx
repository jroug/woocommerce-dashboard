"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Customer, CustomerSort } from "@/types/customer";
import { CustomerAvatar } from "./CustomerAvatar";
import { CustomerBadge } from "./CustomerBadge";
function formatDate(value: string | null | undefined) {
  return value && Number.isFinite(new Date(value).getTime())
    ? date.format(new Date(`${value.slice(0, 10)}T12:00:00Z`))
    : "—";
}
const date = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
function SelectAll({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  // The mixed checkbox state is a DOM property, not a declarative HTML attribute.
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label="Select all visible customers"
      checked={checked}
      onChange={onChange}
      className="size-4 cursor-pointer accent-[#303030]"
    />
  );
}
export function CustomersTable({
  customers,
  selected,
  onSelect,
  onSelectAll,
  sort,
  onSortChange,
}: {
  customers: Customer[];
  selected: Set<number>;
  onSelect: (id: number) => void;
  onSelectAll: () => void;
  sort: CustomerSort;
  onSortChange: (sort: CustomerSort) => void;
}) {
  const selectedVisible = customers.filter((item) => selected.has(item.id)).length;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1580px] border-collapse text-left text-[13px]">
        <caption className="sr-only">Store customers</caption>
        <thead className="border-b bg-[var(--color-surface-subdued)] text-[12px] text-[var(--color-text-secondary)]">
          <tr>
            <th className="w-11 px-4 py-2">
              <SelectAll
                checked={selectedVisible === customers.length && customers.length > 0}
                indeterminate={selectedVisible > 0 && selectedVisible < customers.length}
                onChange={onSelectAll}
              />
            </th>
            <th className="px-2 py-2 font-medium">Name</th>
            <th className="px-3 py-2 font-medium">Username</th>
            <th
              className="whitespace-nowrap px-3 py-2 font-medium"
              aria-sort={
                sort === "active-newest"
                  ? "descending"
                  : sort === "active-oldest"
                    ? "ascending"
                    : "none"
              }
            >
              <button
                type="button"
                onClick={() =>
                  onSortChange(sort === "active-newest" ? "active-oldest" : "active-newest")
                }
                className="flex items-center gap-1"
              >
                Last active <span aria-hidden="true">{sort === "active-oldest" ? "↑" : "↓"}</span>
              </button>
            </th>
            <th className="whitespace-nowrap px-3 py-2 font-medium">Date registered</th>
            <th className="px-3 py-2 font-medium">Email</th>
            <th className="px-3 py-2 text-right font-medium">Orders</th>
            <th className="whitespace-nowrap px-3 py-2 text-right font-medium">Total spend</th>
            <th className="px-3 py-2 text-right font-medium">AOV</th>
            <th className="whitespace-nowrap px-3 py-2 font-medium">Country / Region</th>
            <th className="px-3 py-2 font-medium">City</th>
            <th className="px-3 py-2 font-medium">Region</th>
            <th className="whitespace-nowrap px-4 py-2 font-medium">Postal code</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className={`group hover:bg-[var(--color-surface-subdued)] ${selected.has(customer.id) ? "bg-[#f1f5f3]" : "bg-[var(--color-surface)]"}`}
            >
              <td className="px-4 py-2.5">
                <input
                  type="checkbox"
                  aria-label={`Select ${customer.firstName} ${customer.lastName}`}
                  checked={selected.has(customer.id)}
                  onChange={() => onSelect(customer.id)}
                  className="size-4 cursor-pointer accent-[#303030]"
                />
              </td>
              <td className="px-2 py-2.5">
                <Link
                  href={
                    customer.userId
                      ? `/customers/${customer.userId}`
                      : `/customers/guest-${customer.id}`
                  }
                  className="flex items-center gap-2.5"
                >
                  <CustomerAvatar customer={customer} />
                  <span>
                    <span className="block font-semibold underline-offset-2 group-hover:underline">
                      {customer.firstName} {customer.lastName}
                    </span>
                    <CustomerBadge customer={customer} />
                  </span>
                </Link>
              </td>
              <td className="px-3 py-2.5 text-[var(--color-text-secondary)]">
                {customer.username || "Guest"}
              </td>
              <td className="whitespace-nowrap px-3 py-2.5 text-[var(--color-text-secondary)]">
                {formatDate(customer.lastActiveDateLocal ?? customer.lastActiveDate)}
              </td>
              <td className="whitespace-nowrap px-3 py-2.5 text-[var(--color-text-secondary)]">
                {formatDate(customer.dateRegisteredLocal ?? customer.dateCreated)}
              </td>
              <td className="px-3 py-2.5 text-[var(--color-text-secondary)]">
                {customer.email ? (
                  <a href={`mailto:${customer.email}`} className="hover:underline">
                    {customer.email}
                  </a>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums">{customer.ordersCount}</td>
              <td className="whitespace-nowrap px-3 py-2.5 text-right font-semibold tabular-nums">
                {new Intl.NumberFormat("en-IE", {
                  style: "currency",
                  currency: customer.currency,
                }).format(Number(customer.totalSpent))}
              </td>
              <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums">
                {customer.hasAverageOrderValue === false
                  ? "—"
                  : new Intl.NumberFormat("en-IE", {
                      style: "currency",
                      currency: customer.currency,
                    }).format(Number(customer.averageOrderValue))}
              </td>
              <td className="px-3 py-2.5 text-[var(--color-text-secondary)]">
                {customer.billing.countryCode || "—"}
              </td>
              <td className="px-3 py-2.5 text-[var(--color-text-secondary)]">
                {customer.billing.city || "—"}
              </td>
              <td className="px-3 py-2.5 text-[var(--color-text-secondary)]">
                {customer.billing.state || "—"}
              </td>
              <td className="px-4 py-2.5 text-[var(--color-text-secondary)]">
                {customer.billing.postcode || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
