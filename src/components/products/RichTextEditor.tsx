"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Redo2, Strikethrough, Undo2 } from "lucide-react";
import { useEffect } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  ariaLabel: string;
};

function ToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`flex size-7 items-center justify-center rounded-[var(--radius-sm)] transition disabled:cursor-not-allowed disabled:opacity-40 ${active ? "bg-[var(--color-surface-hover)] text-[var(--color-text)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"}`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ value, onChange, readOnly = false, ariaLabel }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editable: !readOnly,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "product-rich-text-content",
        "aria-label": ariaLabel,
      },
    },
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML())
      editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  if (!editor)
    return (
      <div className="admin-control min-h-28 animate-pulse bg-[var(--color-surface-subdued)]" />
    );

  const run = (command: () => void) => () => command();
  const disabled = readOnly;

  return (
    <div className="admin-control overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 border-b bg-[var(--color-surface-subdued)] px-1.5 py-1">
        <ToolbarButton
          label="Undo"
          disabled={disabled || !editor.can().undo()}
          onClick={run(() => editor.chain().focus().undo().run())}
        >
          <Undo2 size={14} />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          disabled={disabled || !editor.can().redo()}
          onClick={run(() => editor.chain().focus().redo().run())}
        >
          <Redo2 size={14} />
        </ToolbarButton>
        <span className="mx-1 h-4 border-l" />
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          disabled={disabled}
          onClick={run(() => editor.chain().focus().toggleBold().run())}
        >
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          disabled={disabled}
          onClick={run(() => editor.chain().focus().toggleItalic().run())}
        >
          <Italic size={14} />
        </ToolbarButton>
        <ToolbarButton
          label="Strikethrough"
          active={editor.isActive("strike")}
          disabled={disabled}
          onClick={run(() => editor.chain().focus().toggleStrike().run())}
        >
          <Strikethrough size={14} />
        </ToolbarButton>
        <span className="mx-1 h-4 border-l" />
        <ToolbarButton
          label="Bullet list"
          active={editor.isActive("bulletList")}
          disabled={disabled}
          onClick={run(() => editor.chain().focus().toggleBulletList().run())}
        >
          <List size={14} />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor.isActive("orderedList")}
          disabled={disabled}
          onClick={run(() => editor.chain().focus().toggleOrderedList().run())}
        >
          <ListOrdered size={14} />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
