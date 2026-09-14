import { Panel } from "./Panel";
import { StatusBadge } from "./StatusBadge";
import type { OrderStatusSummary } from "@/types/dashboard";

export function OrderStatus({
  items,
  totalOrders,
}: {
  items: OrderStatusSummary[];
  totalOrders: number;
}) {
  return (
    <Panel
      title="Order status"
      description={`${totalOrders.toLocaleString()} ${totalOrders === 1 ? "order" : "orders"} this period`}
    >
      <ul className="mt-3 divide-y px-4 pb-2 sm:px-5">
        {items.map((item) => (
          <li className="flex items-center justify-between py-2.5" key={item.status}>
            <StatusBadge status={item.status} label={item.label} />
            <span className="text-[13px] font-semibold tabular-nums text-[var(--color-text)]">
              {item.count}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
