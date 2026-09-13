"use client";
import { AppShell } from "@/components/dashboard/AppShell";

export default function ProductsError({ reset }: { reset: () => void }) {
  return (
    <AppShell activeSection="products" mobileTitle="Products">
      <main className="mx-auto max-w-[1240px] px-6 py-6">
        <section className="admin-card p-8 text-center" role="alert">
          <h1 className="text-lg font-semibold">Unable to load products</h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            We couldn’t connect to WooCommerce. Check the store connection and API credentials, then
            try again.
          </p>
          <button type="button" onClick={reset} className="admin-control mt-4 px-4 py-2">
            Try again
          </button>
        </section>
      </main>
    </AppShell>
  );
}
