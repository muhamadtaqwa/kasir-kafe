"use client";

import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { deleteCategory } from "../actions";

export function DeleteCategoryButton({
  id,
  productCount,
}: {
  id: string;
  productCount: number;
}) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await deleteCategory(id);
  }

  if (!confirm) {
    return (
      <button
        onClick={() => setConfirm(true)}
        className="p-2 rounded-lg border border-red-200 dark:border-red-900
          text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        title="Hapus kategori"
      >
        <Trash2 size={16} />
      </button>
    );
  }

  return (
    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3 max-w-xs">
      {productCount > 0 ? (
        <div className="flex items-start gap-2 mb-2">
          <AlertTriangle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-red-700 dark:text-red-400">
            Kategori ini punya {productCount} produk. Hapus dulu produknya.
          </p>
        </div>
      ) : (
        <p className="text-xs text-red-700 dark:text-red-400 mb-2">
          Yakin hapus kategori ini?
        </p>
      )}

      <div className="flex gap-2">
        {productCount === 0 && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs
              disabled:opacity-60 flex items-center gap-1"
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : "Ya, hapus"}
          </button>
        )}
        <button
          onClick={() => setConfirm(false)}
          className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs"
        >
          Batal
        </button>
      </div>
    </div>
  );
}