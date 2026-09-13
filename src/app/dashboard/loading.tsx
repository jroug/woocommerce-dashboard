import { StatCardSkeleton } from "@/components/dashboard/StatCard";
export default function DashboardLoading() {
  return (
    <main className="mx-auto page-container px-4 py-6 sm:px-6 lg:px-8">
      <div className="skeleton mb-4 h-8 w-44 rounded-[var(--radius-md)]" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
      <div className="skeleton mt-3 h-[320px] rounded-[var(--radius-lg)]" />
      <span className="sr-only">Loading dashboard</span>
    </main>
  );
}
