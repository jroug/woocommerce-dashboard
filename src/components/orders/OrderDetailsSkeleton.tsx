export function OrderDetailsSkeleton() {
  return (
    <main className="mx-auto page-container px-4 py-6 sm:px-6 lg:px-8" aria-hidden="true">
      <div className="skeleton mb-4 h-8 w-64 rounded-[var(--radius-md)]" />
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-3">
          <div className="admin-card p-5">
            <div className="skeleton h-5 w-32 rounded" />
            {Array.from({ length: 3 }, (_, index) => (
              <div className="mt-4 flex gap-3" key={index}>
                <div className="skeleton size-12 rounded-[var(--radius-md)]" />
                <div className="flex-1">
                  <div className="skeleton h-4 w-1/2 rounded" />
                  <div className="skeleton mt-2 h-3 w-1/3 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="skeleton h-48 rounded-[var(--radius-lg)]" />
          <div className="skeleton h-80 rounded-[var(--radius-lg)]" />
        </div>
        <div className="space-y-3">
          <div className="skeleton h-60 rounded-[var(--radius-lg)]" />
          <div className="skeleton h-48 rounded-[var(--radius-lg)]" />
          <div className="skeleton h-48 rounded-[var(--radius-lg)]" />
        </div>
      </div>
    </main>
  );
}
