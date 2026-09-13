import Link from "next/link";
import { ArrowLeft, MoreHorizontal, Pencil } from "lucide-react";
import type { Customer } from "@/types/customer";
import { CustomerAvatar } from "./CustomerAvatar";
import { CustomerBadge } from "./CustomerBadge";
export function CustomerHeader({
  customer,
  editing,
  onEdit,
}: {
  customer: Customer;
  editing: boolean;
  onEdit?: () => void;
}) {
  return (
    <header className="mb-4">
      <Link
        href="/customers"
        className="mb-3 inline-flex items-center gap-1 text-[13px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
      >
        <ArrowLeft size={15} />
        Customers
      </Link>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div className="flex items-center gap-3">
          <CustomerAvatar customer={customer} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[22px] font-semibold leading-7 tracking-[-.02em]">
                {customer.firstName} {customer.lastName}
              </h1>
              <CustomerBadge customer={customer} />
            </div>
            <p className="text-[12px] text-[var(--color-text-secondary)]">
              {customer.userId ? `Customer #${customer.userId}` : "Guest customer"}
            </p>
          </div>
        </div>
        {onEdit && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="admin-control flex h-8 items-center gap-1.5 px-2.5 text-[12px] font-medium"
            >
              <Pencil size={13} />
              {editing ? "Done editing" : "Edit customer"}
            </button>
            <button
              type="button"
              aria-label="More customer actions"
              className="admin-control flex size-8 items-center justify-center"
              title="Add tag, export, or delete customer"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
