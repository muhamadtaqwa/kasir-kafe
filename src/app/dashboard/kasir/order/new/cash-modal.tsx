"use client";

import { useState } from "react";
import { X, Banknote, Loader2 } from "lucide-react";

export function CashModal({
  total,
  onConfirm,
  onClose,
  submitting,
}: {
  total: number;
  onConfirm: (paid: number) => void;
  onClose: () => void;
  submitting: boolean;
}) {
  const [paid, setPaid] = useState<number>(0);
  const [inputValue, setInputValue] = useState("");

  const suggestions = [
    20000, 50000, 100000, 150000, 200000,
  ].filter((v) => v >= total);

  const change = paid - total;
  const isValid = paid >= total;

  function handleInput(val: string) {
    const num = parseInt(val.replace(/\D/g, "")) || 0;
    setInputValue(num ? num.toLocaleString("id-ID") : "");
    setPaid(num);
  }

  function handleSuggestion(val: number) {
    setPaid(val);
    setInputValue(val.toLocaleString("id-ID"));
  }

  function handleExact() {
    setPaid(total);
    setInputValue(total.toLocaleString("id-ID"));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-md bg-[var(--color-surface)] rounded-t-3xl sm:rounded-3xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Banknote size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg">Pembayaran Tunai</h2>
              <p className="text-xs text-[var(--color-muted)]">Masukkan uang diterima</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2">
            <X size={20} />
          </button>
        </div>

        {/* Total */}
        <div className="bg-brand-50 dark:bg-brand-900/40 rounded-xl p-4 mb-4 text-center">
          <p className="text-xs text-[var(--color-muted)]">Total Tagihan</p>
          <p className="font-heading font-bold text-2xl text-brand-700 dark:text-brand-300">
            Rp {total.toLocaleString("id-ID")}
          </p>
        </div>

        {/* Input Uang */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1.5">Uang Diterima</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-muted)]">
              Rp
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={(e) => handleInput(e.target.value)}
              placeholder="0"
              autoFocus
              className="w-full pl-10 pr-3 py-3 rounded-lg border-2 border-[var(--color-border)]
                bg-[var(--color-background)] text-[var(--color-foreground)]
                font-bold text-lg
                focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Tombol Cepat */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <button
            onClick={handleExact}
            className="py-2 rounded-lg bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300 text-xs font-medium hover:bg-brand-200 dark:hover:bg-brand-700"
          >
            Uang Pas
          </button>
          {suggestions.slice(0, 5).map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestion(s)}
              className="py-2 rounded-lg border border-[var(--color-border)] text-xs font-medium hover:bg-brand-50 dark:hover:bg-brand-900/30"
            >
              {s / 1000}rb
            </button>
          ))}
        </div>

        {/* Kembalian */}
        {paid > 0 && (
          <div
            className={`rounded-xl p-4 mb-4 text-center ${
              isValid
                ? "bg-green-50 dark:bg-green-950/30"
                : "bg-red-50 dark:bg-red-950/30"
            }`}
          >
            <p className="text-xs text-[var(--color-muted)]">
              {isValid ? "Kembalian" : "Kurang"}
            </p>
            <p
              className={`font-heading font-bold text-2xl ${
                isValid
                  ? "text-green-700 dark:text-green-400"
                  : "text-red-700 dark:text-red-400"
              }`}
            >
              Rp {Math.abs(change).toLocaleString("id-ID")}
            </p>
          </div>
        )}

        {/* Tombol Konfirmasi */}
        <button
          onClick={() => onConfirm(paid)}
          disabled={!isValid || submitting}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-brand-600 to-brand-700
            hover:from-brand-700 hover:to-brand-800 text-white font-medium
            disabled:opacity-40 disabled:cursor-not-allowed
            flex items-center justify-center gap-2 transition-all"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Memproses...
            </>
          ) : (
            "Konfirmasi Pembayaran"
          )}
        </button>
      </div>
    </div>
  );
}