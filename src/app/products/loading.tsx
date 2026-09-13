import { AppShell } from "@/components/dashboard/AppShell";
import { ProductsTableSkeleton } from "@/components/products/ProductsStates";
export default function ProductsLoading() {
  return (
    <AppShell activeSection="products" mobileTitle="Products">
      <main className="mx-auto page-container px-4 py-6 sm:px-6 lg:px-8">
        <div className="skeleton mb-4 h-8 w-40 rounded-[var(--radius-md)]" />
        <ProductsTableSkeleton />
        <span className="sr-only">Loading products</span>
      </main>
    </AppShell>
  );
}
