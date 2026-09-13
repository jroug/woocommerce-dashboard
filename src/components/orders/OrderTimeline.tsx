import { Send } from "lucide-react";
import type { OrderDetails } from "@/types/order";
const dateTime = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});
export function OrderTimeline({ order }: { order: OrderDetails }) {
  return (
    <section className="admin-card">
      <header className="border-b px-4 py-3.5 sm:px-5">
        <h2 className="text-[15px] font-semibold">Timeline</h2>
      </header>
      {!order.readOnly && (
        <div className="border-b p-4 sm:p-5">
          <textarea
            aria-label="Order note"
            placeholder="Leave a comment…"
            rows={3}
            className="admin-control w-full resize-none p-2.5 text-[13px] outline-none placeholder:text-[var(--color-text-muted)]"
          />
          <div className="mt-2 flex items-center justify-between gap-2">
            <select
              aria-label="Note visibility"
              defaultValue="private"
              className="admin-control h-8 px-2 text-[12px] font-medium outline-none"
            >
              <option value="private">Private note</option>
              <option value="customer">Note to customer</option>
            </select>
            <button
              type="button"
              className="flex h-8 items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--color-action)] px-3 text-[12px] font-semibold text-white"
            >
              <Send size={13} />
              Add note
            </button>
          </div>
        </div>
      )}
      <ol className="p-4 sm:p-5">
        {order.notes.map((note) => (
          <li key={`note-${note.id}`} className="relative flex gap-3 pb-5 last:pb-0">
            <span className="relative z-10 mt-1 size-2.5 shrink-0 rounded-full bg-[var(--color-warning)] ring-4 ring-white" />
            <div className="absolute bottom-0 left-[4px] top-2 w-px bg-[var(--color-border)]" />
            <div>
              <p className="text-[13px] font-medium">
                Note added by {note.author} ·{" "}
                {note.customerVisible ? "Customer note" : "Private note"}
              </p>
              <p className="mt-0.5 text-[12px] text-[var(--color-text-secondary)]">
                {note.content}
              </p>
              <time className="mt-1 block text-[11px] text-[var(--color-text-muted)]">
                {dateTime.format(new Date(note.date))}
              </time>
            </div>
          </li>
        ))}
        {order.timeline.map((event, index) => (
          <li key={event.id} className="relative flex gap-3 pb-5 last:pb-0">
            <span className="relative z-10 mt-1 size-2.5 shrink-0 rounded-full bg-[var(--color-text-muted)] ring-4 ring-white" />
            {index < order.timeline.length - 1 && (
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
