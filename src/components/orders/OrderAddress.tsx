import { Pencil } from "lucide-react";
import type { OrderAddress as Address } from "@/types/order";
export function OrderAddress({
  title,
  address,
  sameAsShipping = false,
  readOnly = false,
}: {
  title: string;
  address: Address;
  sameAsShipping?: boolean;
  readOnly?: boolean;
}) {
  return (
    <section className="admin-card">
      <header className="flex items-center justify-between border-b px-4 py-3.5">
        <h2 className="text-[15px] font-semibold">{title}</h2>
        {!readOnly && (
          <button
            type="button"
            className="flex items-center gap-1 text-[12px] font-medium hover:underline"
          >
            <Pencil size={12} />
            Edit
          </button>
        )}
      </header>
      <address className="p-4 text-[13px] not-italic leading-5 text-[var(--color-text-secondary)]">
        <p className="font-medium text-[var(--color-text)]">
          {address.firstName} {address.lastName}
        </p>
        {sameAsShipping ? (
          <p className="mt-1 text-[12px] text-[var(--color-text-muted)]">
            Same as shipping address
          </p>
        ) : (
          <>
            {address.company && <p>{address.company}</p>}
            <p>{address.address1}</p>
            {address.address2 && <p>{address.address2}</p>}
            <p>
              {address.postcode} {address.city}
            </p>
            <p>{address.state}</p>
            <p>{address.country}</p>
          </>
        )}
      </address>
    </section>
  );
}
