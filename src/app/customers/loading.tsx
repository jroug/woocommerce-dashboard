import { AppShell } from "@/components/dashboard/AppShell";
import { CustomersTableSkeleton } from "@/components/customers/CustomersStates";
export default function LoadingCustomers() {
  return (
    <AppShell activeSection="customers" mobileTitle="Customers">
      <main className="mx-auto page-container px-4 py-6 sm:px-6 lg:px-8">
        <div className="skeleton mb-4 h-7 w-32 rounded" />
        <div className="mb-4 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-lg)] border bg-[var(--color-border)] sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="h-16 bg-white p-3" key={index}>
              <div className="skeleton h-3 w-20 rounded" />
              <div className="skeleton mt-2 h-5 w-14 rounded" />
            </div>
          ))}
        </div>
        <CustomersTableSkeleton />
      </main>
    </AppShell>
  );
}
