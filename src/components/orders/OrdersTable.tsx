"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Order } from "@/types/order";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

const date = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function SelectAllCheckbox({
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
      aria-label="Select all visible orders"
      checked={checked}
      onChange={onChange}
      className="size-4 cursor-pointer accent-[#303030]"
    />
  );
}

export function OrdersTable({
  orders,
  selected,
  onSelect,
  onSelectAll,
}: {
  orders: Order[];
  selected: Set<number>;
  onSelect: (id: number) => void;
  onSelectAll: () => void;
}) {
  const selectedVisible = orders.filter((order) => selected.has(order.id)).length;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] border-collapse text-left text-[13px]">
        <caption className="sr-only">Store orders</caption>
        <thead className="border-b bg-[var(--color-surface-subdued)] text-[12px] text-[var(--color-text-secondary)]">
          <tr>
            <th className="w-11 px-4 py-2 font-medium">
              <SelectAllCheckbox
                checked={selectedVisible === orders.length && orders.length > 0}
                indeterminate={selectedVisible > 0 && selectedVisible < orders.length}
                onChange={onSelectAll}
              />
            </th>
            <th className="px-2 py-2 font-medium">Order</th>
            <th className="px-3 py-2 font-medium">Date</th>
            <th className="px-3 py-2 font-medium">Customer</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 font-medium">Payment</th>
            <th className="px-3 py-2 text-right font-medium">Items</th>
            <th className="px-4 py-2 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {orders.map((order) => {
            const customerName =
              `${order.customer.firstName} ${order.customer.lastName}`.trim() || "Guest";
            return (
              <tr
                key={order.id}
                className={`group transition-colors hover:bg-[var(--color-surface-subdued)] ${selected.has(order.id) ? "bg-[#f1f5f3]" : "bg-[var(--color-surface)]"}`}
              >
                <td className="px-4 py-2.5">
                  <input
                    type="checkbox"
                    aria-label={`Select order ${order.number}`}
                    checked={selected.has(order.id)}
                    onChange={() => onSelect(order.id)}
                    className="size-4 cursor-pointer accent-[#303030]"
                  />
                </td>
                <td className="px-2 py-2.5 font-semibold">
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-[var(--color-text)] underline-offset-2 group-hover:underline"
                  >
                    #{order.number}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-[var(--color-text-secondary)]">
                  {date.format(new Date(order.dateCreated))}
                </td>
                <td className="px-3 py-2.5">
                  <Link href={`/orders/${order.id}`} className="block">
                    <span className="block font-medium text-[var(--color-text)]">
                      {customerName}
                    </span>
                    <span className="block text-[11px] text-[var(--color-text-muted)]">
                      {order.customer.email}
                    </span>
                  </Link>
                </td>
                <td className="px-3 py-2.5">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-3 py-2.5">
                  <PaymentStatusBadge status={order.paymentStatus} />
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right text-[var(--color-text-secondary)]">
                  {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 text-right font-semibold tabular-nums text-[var(--color-text)]">
                  {new Intl.NumberFormat("en-IE", {
                    style: "currency",
                    currency: order.currency,
                  }).format(Number(order.total))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
