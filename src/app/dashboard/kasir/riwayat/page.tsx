import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Receipt, QrCode, Banknote, Printer } from "lucide-react";

export default async function RiwayatPage() {
  const orders = await prisma.order.findMany({
    where: {
      createdBy: { not: null },
    },
    include: {
      payment: true,
      table: true,
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Riwayat Transaksi</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          50 transaksi terakhir
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-800 flex items-center justify-center mx-auto mb-4">
            <Receipt
              size={28}
              className="text-brand-600 dark:text-brand-400"
            />
          </div>
          <h3 className="font-heading font-bold text-lg">
            Belum ada transaksi
          </h3>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Transaksi akan muncul di sini
          </p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-brand-50 dark:bg-brand-900/40 border-b border-[var(--color-border)]">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">No. Order</th>
                  <th className="text-left px-4 py-3 font-medium">Pelanggan</th>
                  <th className="text-left px-4 py-3 font-medium">Meja</th>
                  <th className="text-left px-4 py-3 font-medium">Metode</th>
                  <th className="text-right px-4 py-3 font-medium">Total</th>
                  <th className="text-left px-4 py-3 font-medium">Waktu</th>
                  <th className="text-right px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-[var(--color-border)] last:border-0 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{o.orderNumber}</td>
                    <td className="px-4 py-3 text-[var(--color-muted)]">
                      {o.customerName || "-"}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-muted)]">
                      {o.table?.name || "Takeaway"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs">
                        {o.payment?.method === "QRIS" ? (
                          <>
                            <QrCode size={12} /> QRIS
                          </>
                        ) : (
                          <>
                            <Banknote size={12} /> Tunai
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      Rp {o.total.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-muted)] text-xs">
                      {new Date(o.createdAt).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/kasir/struk/${o.id}`}
                        className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:text-brand-800 text-xs"
                      >
                        <Printer size={12} /> Struk
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-3">
            {orders.map((o) => (
              <Link
                key={o.id}
                href={`/dashboard/kasir/struk/${o.id}`}
                className="block bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4"
              >
                <div className="flex justify-between items-start gap-3 mb-2">
                  <div>
                    <div className="font-medium">{o.orderNumber}</div>
                    <div className="text-xs text-[var(--color-muted)] mt-0.5">
                      {o.table?.name || "Takeaway"} · {o._count.items} item
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      Rp {o.total.toLocaleString("id-ID")}
                    </div>
                    <div className="text-xs text-[var(--color-muted)] mt-0.5">
                      {o.payment?.method === "QRIS" ? "QRIS" : "Tunai"}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-[var(--color-muted)] pt-2 border-t border-[var(--color-border)]">
                  <span>
                    {new Date(o.createdAt).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-brand-600 dark:text-brand-400 flex items-center gap-1">
                    <Printer size={11} /> Struk
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
