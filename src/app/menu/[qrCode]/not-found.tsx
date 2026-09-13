import Link from "next/link";
import { Coffee } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-brand-100 to-brand-200 dark:from-brand-950 dark:via-brand-900 dark:to-brand-950 p-4">
      <div className="bg-[var(--color-surface)] rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-[var(--color-border)]">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto mb-4">
          <Coffee size={28} className="text-white" />
        </div>
        <h1 className="font-heading text-2xl font-bold mb-2">
          Meja Tidak Ditemukan
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          QR code yang kamu scan tidak valid. Silakan hubungi kasir.
        </p>
      </div>
    </div>
  );
}