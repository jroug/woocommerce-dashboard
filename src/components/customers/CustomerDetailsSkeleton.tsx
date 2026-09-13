export function CustomerDetailsSkeleton() {
  return (
    <main
      className="mx-auto page-container animate-pulse px-4 py-6 sm:px-6 lg:px-8"
      aria-label="Loading customer"
      aria-busy="true"
    >
      <div className="mb-4 h-5 w-24 rounded bg-black/10" />
      <div className="mb-5 flex justify-between">
        <div className="h-8 w-64 rounded bg-black/10" />
        <div className="h-8 w-28 rounded bg-black/10" />
      </div>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-3">
          {[90, 180, 310, 130, 240].map((height, index) => (
            <div key={index} className="admin-card bg-white/75" style={{ height }} />
          ))}
        </div>
        <div className="space-y-3">
          {[135, 190, 120, 170].map((height, index) => (
            <div key={index} className="admin-card bg-white/75" style={{ height }} />
          ))}
        </div>
      </div>
    </main>
  );
}
