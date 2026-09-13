"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { checkPaymentStatus } from "./actions";

export function QrisPayment({
  data,
  onClose,
}: {
  data: {
    orderNumber: string;
    orderId: string;
    qrUrl: string | null;
    qrString: string | null;
    total: number;
  };
  onClose: () => void;
}) {
  const [status, setStatus] = useState<"PENDING" | "SUCCESS" | "FAILED">(
    "PENDING"
  );

  // Polling cek status pembayaran tiap 3 detik
  useEffect(() => {
    if (status !== "PENDING") return;

    const interval = setInterval(async () => {
      const res = await checkPaymentStatus(data.orderId);
      if (res.status === "SUCCESS") setStatus("SUCCESS");
      if (res.status === "FAILED") setStatus("FAILED");
    }, 3000);

    return () => clearInterval(interval);
  }, [status, data.orderId]);

  if (status === "SUCCESS") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-brand-100 to-brand-200 dark:from-green-950 dark:via-brand-900 dark:to-brand-950 p-4">
        <div className="bg-[var(--color-surface)] rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-[var(--color-border)]">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold mb-2">
            Pembayaran Berhasil!
          </h1>
          <p className="text-sm text-[var(--color-muted)] mb-4">
            Pesananmu sedang diproses
          </p>
          <div className="bg-brand-50 dark:bg-brand-900/40 rounded-xl p-4">
            <p className="text-xs text-[var(--color-muted)]">Nomor Order</p>
            <p className="font-heading font-bold text-xl">
              {data.orderNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="mt-6 w-full py-2.5 rounded-lg bg-gradient-to-r from-brand-600 to-brand-700
              hover:from-brand-700 hover:to-brand-800 text-white font-medium"
          >
            Pesan Lagi
          </button>
        </div>
      </div>
    );
  }

  if (status === "FAILED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-brand-100 to-brand-200 dark:from-red-950 dark:via-brand-900 dark:to-brand-950 p-4">
        <div className="bg-[var(--color-surface)] rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-[var(--color-border)]">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mx-auto mb-4">
            <XCircle size={40} className="text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold mb-2">
            Pembayaran Gagal
          </h1>
          <p className="text-sm text-[var(--color-muted)] mb-4">
            QR sudah kadaluarsa atau dibatalkan
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-brand-600 to-brand-700
              hover:from-brand-700 hover:to-brand-800 text-white font-medium"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-brand-100 to-brand-200 dark:from-brand-950 dark:via-brand-900 dark:to-brand-950 p-4">
      <div className="bg-[var(--color-surface)] rounded-3xl shadow-2xl p-6 max-w-sm w-full border border-[var(--color-border)]">
        <h1 className="font-heading text-xl font-bold text-center mb-1">
          Scan QRIS untuk Bayar
        </h1>
        <p className="text-xs text-center text-[var(--color-muted)] mb-4">
          Order: {data.orderNumber}
        </p>

        {/* QR Code */}
        <div className="bg-white rounded-2xl p-4 mb-4 flex items-center justify-center">
          {data.qrUrl ? (
            <img
              src={data.qrUrl}
              alt="QRIS"
              className="w-full max-w-[240px]"
            />
          ) : (
            <div className="text-center py-8 text-[var(--color-muted)] text-sm">
              Gagal memuat QR
            </div>
          )}
        </div>

        {/* Total */}
        <div className="bg-brand-50 dark:bg-brand-900/40 rounded-xl p-4 mb-4 text-center">
          <p className="text-xs text-[var(--color-muted)]">Total Bayar</p>
          <p className="font-heading font-bold text-2xl text-brand-700 dark:text-brand-300">
            Rp {data.total.toLocaleString("id-ID")}
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-muted)] mb-4">
          <Loader2 size={16} className="animate-spin" />
          Menunggu pembayaran...
        </div>

        <p className="text-xs text-center text-[var(--color-muted)]">
          Scan pakai aplikasi e-wallet atau mobile banking yang mendukung QRIS.
          Halaman ini otomatis update setelah bayar.
        </p>

        {/* QR String untuk testing sandbox */}
        {data.qrString && (
          <details className="mt-4">
            <summary className="text-xs text-[var(--color-muted)] cursor-pointer text-center">
              🧪 Testing Sandbox? Klik di sini
            </summary>
            <div className="mt-2 bg-[var(--color-background)] rounded-lg p-3 border border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-muted)] mb-1">
                Copy string ini ke simulator Midtrans:
              </p>
              <textarea
                readOnly
                value={data.qrString}
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                className="w-full text-xs font-mono bg-transparent border border-[var(--color-border)] rounded p-2 h-24 resize-none"
              />
              <a
                href="https://simulator.sandbox.midtrans.com/qris/index"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-xs text-brand-600 dark:text-brand-400 underline"
              >
                Buka Simulator Midtrans →
              </a>
            </div>
          </details>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 text-sm text-[var(--color-muted)] hover:text-brand-600 transition-colors"
        >
          Batal
        </button>
      </div>
    </div>
  );
}