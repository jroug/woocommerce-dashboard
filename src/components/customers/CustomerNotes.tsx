import { Send } from "lucide-react";
import { useState } from "react";
import type { CustomerNote } from "@/types/customer";
const dateTime = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
  hour: "numeric",
  minute: "2-digit",
});
export function CustomerNotes({
  notes,
  onAdd,
}: {
  notes: CustomerNote[];
  onAdd?: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const add = () => {
    if (!text.trim()) return;
    onAdd?.(text.trim());
    setText("");
  };
  return (
    <section className="admin-card">
      <header className="border-b px-4 py-3.5 sm:px-5">
        <h2 className="text-[15px] font-semibold">{onAdd ? "Notes" : "Checkout notes"}</h2>
      </header>
      {onAdd && (
        <div className="border-b p-4 sm:p-5">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            aria-label="Customer note"
            placeholder="Add a private note about this customer…"
            rows={3}
            className="admin-control w-full resize-none p-2.5 text-[13px] outline-none"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={add}
              disabled={!text.trim()}
              className="flex h-8 items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--color-action)] px-3 text-[12px] font-semibold text-white disabled:opacity-45"
            >
              <Send size={13} />
              Add note
            </button>
          </div>
        </div>
      )}
      {notes.length === 0 && (
        <p className="p-4 text-[12px] text-[var(--color-text-muted)]">No notes recorded.</p>
      )}
      <ul className="divide-y">
        {notes.map((note) => (
          <li className="px-4 py-3 sm:px-5" key={note.id}>
            <p className="text-[12px] text-[var(--color-text-secondary)]">{note.text}</p>
            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
              Added {dateTime.format(new Date(note.date))} by {note.author}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
