import { AppShell } from "@/components/dashboard/AppShell";
import { OrdersTableSkeleton } from "@/components/orders/OrdersStates";

export default function OrdersLoading() {
  return (
    <AppShell activeSection="orders" mobileTitle="Orders">
      <main className="mx-auto page-container px-4 py-6 sm:px-6 lg:px-8">
        <div className="skeleton mb-4 h-8 w-40 rounded-[var(--radius-md)]" />
        <OrdersTableSkeleton />
        <span className="sr-only">Loading orders</span>
      </main>
    </AppShell>
  );
}
