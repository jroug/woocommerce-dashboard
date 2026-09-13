import type { CustomerDetails } from "@/types/customer";
import { CustomerBadge } from "./CustomerBadge";
import { TextInput } from "@/components/products/ProductFormField";
const date = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
export function CustomerProfile({
  customer,
  editing,
  onChange,
}: {
  customer: CustomerDetails;
  editing: boolean;
  onChange: (patch: Partial<CustomerDetails>) => void;
}) {
  const updateAddress = (
    kind: "shipping" | "billing",
    key: "address1" | "city" | "postcode" | "country",
    value: string,
  ) => onChange({ [kind]: { ...customer[kind], [key]: value } });
  return (
    <section className="admin-card">
      <header className="border-b px-4 py-3.5 sm:px-5">
        <h2 className="text-[15px] font-semibold">Customer profile</h2>
      </header>
      {editing ? (
        <div className="p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["First name", "firstName"],
                ["Last name", "lastName"],
                ["Email", "email"],
                ["Phone", "phone"],
              ] as const
            ).map(([label, key]) => (
              <label key={key}>
                <span className="mb-1 block text-[12px] font-medium">{label}</span>
                <TextInput
                  type={key === "email" ? "email" : "text"}
                  value={customer[key]}
                  onChange={(event) => onChange({ [key]: event.target.value })}
                />
              </label>
            ))}
          </div>
          {(["shipping", "billing"] as const).map((kind) => (
            <fieldset className="mt-4 border-t pt-4" key={kind}>
              <legend className="px-1 text-[12px] font-semibold">
                {kind === "shipping" ? "Shipping" : "Billing"} address
              </legend>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["Address", "address1"],
                    ["City", "city"],
                    ["Postcode", "postcode"],
                    ["Country", "country"],
                  ] as const
                ).map(([label, key]) => (
                  <label key={key}>
                    <span className="mb-1 block text-[11px] text-[var(--color-text-secondary)]">
                      {label}
                    </span>
                    <TextInput
                      value={customer[kind][key]}
                      onChange={(event) => updateAddress(kind, key, event.target.value)}
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      ) : (
        <dl className="grid gap-x-6 gap-y-4 p-4 text-[13px] sm:grid-cols-2 sm:p-5">
          <div>
            <dt className="text-[11px] text-[var(--color-text-muted)]">Full name</dt>
            <dd className="mt-0.5 font-medium">
              {customer.firstName} {customer.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] text-[var(--color-text-muted)]">Customer type</dt>
            <dd className="mt-1">
              <CustomerBadge customer={customer} />
            </dd>
          </div>
          <div>
            <dt className="text-[11px] text-[var(--color-text-muted)]">Username</dt>
            <dd className="mt-0.5 font-medium">{customer.username || "Guest"}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-[var(--color-text-muted)]">Customer ID</dt>
            <dd className="mt-0.5 font-medium">#{customer.userId || customer.id}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-[var(--color-text-muted)]">Date joined</dt>
            <dd className="mt-0.5 font-medium">
              {customer.dateRegisteredLocal
                ? date.format(new Date(`${customer.dateRegisteredLocal.slice(0, 10)}T12:00:00Z`))
                : customer.dateCreated
                  ? date.format(new Date(customer.dateCreated))
                  : "Guest checkout"}
            </dd>
          </div>
        </dl>
      )}
    </section>
  );
}
