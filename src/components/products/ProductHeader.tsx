import Link from "next/link";
import { ArrowLeft, Copy, Eye, MoreHorizontal, Save } from "lucide-react";
import type { ProductStatus } from "@/types/product";
import { ProductStatusBadge } from "./ProductStatusBadge";
export function ProductHeader({
  title,
  status,
  dirty,
  saved,
  onSave,
  readOnly = false,
}: {
  title: string;
  status: ProductStatus;
  dirty: boolean;
  saved: boolean;
  onSave: () => void;
  readOnly?: boolean;
}) {
  return (
    <header className="mb-4">
      <Link
        href="/products"
        className="mb-3 inline-flex items-center gap-1 text-[13px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
      >
        <ArrowLeft size={15} />
        Products
      </Link>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[22px] font-semibold leading-7 tracking-[-.02em]">
              {title || "Untitled product"}
            </h1>
            <ProductStatusBadge status={status} />
          </div>
          <p
            className={`mt-0.5 text-[12px] ${dirty ? "text-[var(--color-warning)]" : "text-[var(--color-text-muted)]"}`}
          >
            {readOnly
              ? "WooCommerce product · Read-only"
              : saved
                ? "Product saved"
                : dirty
                  ? "Unsaved changes"
                  : "All changes saved"}
          </p>
        </div>
        {!readOnly && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="admin-control hidden h-8 items-center gap-1.5 px-2.5 text-[12px] font-medium md:flex"
            >
              <Copy size={13} />
              Duplicate
            </button>
            <button
              type="button"
              className="admin-control hidden h-8 items-center gap-1.5 px-2.5 text-[12px] font-medium sm:flex"
            >
              <Eye size={13} />
              Preview
            </button>
            <button
              type="button"
              aria-label="More product actions"
              className="admin-control flex size-8 items-center justify-center"
            >
              <MoreHorizontal size={16} />
            </button>
            <button
              type="button"
              disabled={!dirty}
              onClick={onSave}
              className="flex h-8 items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--color-action)] px-3 text-[12px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Save size={13} />
              Save
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
