import type { CustomerTimelineEvent } from "@/types/customer";
const dateTime = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
  hour: "numeric",
  minute: "2-digit",
});
export function CustomerTimeline({ events }: { events: CustomerTimelineEvent[] }) {
  return (
    <section className="admin-card">
      <header className="border-b px-4 py-3.5 sm:px-5">
        <h2 className="text-[15px] font-semibold">Activity</h2>
      </header>
      <ol className="p-4 sm:p-5">
        {events.map((event, index) => (
          <li key={event.id} className="relative flex gap-3 pb-5 last:pb-0">
            <span className="relative z-10 mt-1 size-2.5 shrink-0 rounded-full bg-[var(--color-text-muted)] ring-4 ring-white" />
            {index < events.length - 1 && (
              <div className="absolute bottom-0 left-[4px] top-2 w-px bg-[var(--color-border)]" />
            )}
            <div>
              <p className="text-[13px] font-medium">{event.title}</p>
              {event.description && (
                <p className="mt-0.5 text-[12px] text-[var(--color-text-secondary)]">
                  {event.description}
                </p>
              )}
              <time className="mt-1 block text-[11px] text-[var(--color-text-muted)]">
                {dateTime.format(new Date(event.date))}
              </time>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
