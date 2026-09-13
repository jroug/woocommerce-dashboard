import type { CustomerAddress } from "@/types/customer";
export function CustomerAddressCard({
  title,
  name,
  address,
  sameAsShipping,
  onEdit,
}: {
  title: string;
  name: string;
  address: CustomerAddress;
  sameAsShipping?: boolean;
  onEdit?: () => void;
}) {
  return (
    <section className="admin-card">
      <header className="flex items-center justify-between border-b px-4 py-3.5">
        <h2 className="text-[15px] font-semibold">{title}</h2>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-[12px] font-medium text-[var(--color-info)]"
          >
            Edit
          </button>
        )}
      </header>
      <address className="p-4 text-[12px] not-italic leading-5 text-[var(--color-text-secondary)]">
        {sameAsShipping ? (
          <p>Same as shipping address</p>
        ) : (
          <>
            <p className="font-medium text-[var(--color-text)]">
              {[address.firstName, address.lastName].filter(Boolean).join(" ") || name}
            </p>
            {address.company && <p>{address.company}</p>}
            {!address.address1 && !address.city && !address.country && <p>No address provided.</p>}
            <p>{address.address1}</p>
            {address.address2 && <p>{address.address2}</p>}
            <p>
              {address.postcode} {address.city}
            </p>
            {address.state && <p>{address.state}</p>}
            <p>{address.country}</p>
          </>
        )}
      </address>
    </section>
  );
}
