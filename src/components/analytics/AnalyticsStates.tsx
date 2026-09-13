import { BarChart3 } from "lucide-react";
export function AnalyticsSkeleton() {
  return (
    <main className="mx-auto page-container animate-pulse px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 h-7 w-32 rounded bg-black/10" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="admin-card h-24" key={index} />
        ))}
      </div>
      <div className="admin-card mt-3 h-[320px]" />
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <div className="admin-card h-64" />
        <div className="admin-card h-64" />
      </div>
    </main>
  );
}
export function AnalyticsEmpty({ onChangeRange }: { onChangeRange: () => void }) {
  return (
    <section className="admin-card mt-3 flex min-h-72 flex-col items-center justify-center px-6 text-center">
      <BarChart3 size={28} className="text-[var(--color-text-muted)]" />
      <h2 className="mt-3 text-[15px] font-semibold">No data available for this period</h2>
      <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
        Choose a wider date range to view store performance.
      </p>
      <button
        type="button"
        onClick={onChangeRange}
        className="admin-control mt-4 h-8 px-3 text-[12px] font-semibold"
      >
        View last 30 days
      </button>
    </section>
  );
}
