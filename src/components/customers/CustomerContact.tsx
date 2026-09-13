import { Mail, Phone } from "lucide-react";
import type { Customer } from "@/types/customer";
export function CustomerContact({ customer, onEdit }: { customer: Customer; onEdit?: () => void }) {
  return (
    <section className="admin-card">
      <header className="flex items-center justify-between border-b px-4 py-3.5">
        <h2 className="text-[15px] font-semibold">Contact information</h2>
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
      <div className="space-y-3 p-4 text-[12px]">
        <a
          href={`mailto:${customer.email}`}
          className="flex items-center gap-2 text-[var(--color-info)]"
        >
          <Mail size={14} />
          {customer.email}
        </a>
        <a
          href={`tel:${customer.phone}`}
          className="flex items-center gap-2 text-[var(--color-text-secondary)]"
        >
          <Phone size={14} />
          {customer.phone || "No phone number"}
        </a>
      </div>
    </section>
  );
}
