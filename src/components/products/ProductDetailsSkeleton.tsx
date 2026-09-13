export function ProductDetailsSkeleton() {
  return (
    <main
      className="mx-auto page-container animate-pulse px-4 py-6 sm:px-6 lg:px-8"
      aria-label="Loading product"
      aria-busy="true"
    >
      <div className="mb-5 h-5 w-20 rounded bg-black/10" />
      <div className="mb-5 flex items-center justify-between">
        <div className="h-7 w-64 rounded bg-black/10" />
        <div className="h-8 w-24 rounded bg-black/10" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          {[190, 330, 180, 220, 200].map((height, index) => (
            <div key={index} className="admin-card bg-white/75" style={{ height }} />
          ))}
        </div>
        <div className="space-y-4">
          <div className="admin-card h-40 bg-white/75" />
          <div className="admin-card h-80 bg-white/75" />
          <div className="admin-card h-28 bg-white/75" />
        </div>
      </div>
    </main>
  );
}
