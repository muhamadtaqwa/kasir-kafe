"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteTable } from "../actions";

export function DeleteTableButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await deleteTable(id);
  }

  if (!confirm) {
    return (
      <button
        onClick={() => setConfirm(true)}
        className="p-2 rounded-lg border border-red-200 dark:border-red-900
          text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        title="Hapus meja"
      >
        <Trash2 size={16} />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[var(--color-muted)]">Yakin?</span>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs
          disabled:opacity-60 flex items-center gap-1"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : "Ya"}
      </button>
      <button
        onClick={() => setConfirm(false)}
        className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs"
      >
        Batal
      </button>
    </div>
  );
}