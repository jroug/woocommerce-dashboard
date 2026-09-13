import Image from "next/image";
import type { OrderDetailLineItem } from "@/types/order";
export function OrderItems({
  items,
  currency,
}: {
  items: OrderDetailLineItem[];
  currency: string;
}) {
  const money = new Intl.NumberFormat("en-IE", { style: "currency", currency });
  return (
    <section className="admin-card overflow-hidden">
      <header className="border-b px-4 py-3.5 sm:px-5">
        <h2 className="text-[15px] font-semibold">Order items</h2>
      </header>
      <ul className="divide-y">
        {items.map((item) => (
          <li
            key={item.id}
            className="grid grid-cols-[48px_minmax(0,1fr)] gap-3 px-4 py-3 sm:grid-cols-[48px_minmax(0,1fr)_auto_auto] sm:items-center sm:px-5"
          >
            <Image
              unoptimized
              src={item.image}
              alt=""
              width={48}
              height={48}
              className="size-12 rounded-[var(--radius-md)] border object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold">{item.name}</p>
              {item.variation && (
                <p className="text-[12px] text-[var(--color-text-secondary)]">{item.variation}</p>
              )}
              <p className="text-[11px] text-[var(--color-text-muted)]">SKU: {item.sku}</p>
            </div>
            <p className="col-start-2 text-[12px] text-[var(--color-text-secondary)] sm:col-auto">
              {money.format(Number(item.unitPrice))} × {item.quantity}
            </p>
            <p className="text-right text-[13px] font-semibold tabular-nums sm:min-w-20">
              {money.format(Number(item.total))}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
