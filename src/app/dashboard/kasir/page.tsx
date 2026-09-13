import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Table as TableIcon, Plus, ShoppingBag, Receipt } from "lucide-react";

export default async function KasirPage() {
  const [tables, activeOrders] = await Promise.all([
    prisma.table.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.order.findMany({
      where: {
        status: { in: ["PAID", "DIMASAK"] },
        tableId: { not: null },
      },
      select: { tableId: true, id: true, orderNumber: true },
    }),
  ]);

  const tableOrderMap = new Map(activeOrders.map((o) => [o.tableId, o]));

  const occupiedCount = activeOrders.length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Kasir</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          {occupiedCount} meja terisi dari {tables.length} meja
        </p>
      </div>

      {/* Aksi Cepat */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          href="/dashboard/kasir/order/new?type=TAKEAWAY"
          className="group bg-gradient-to-br from-brand-500 to-brand-700 
            rounded-2xl p-5 text-white hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <ShoppingBag size={24} />
              <h3 className="font-heading font-bold text-lg mt-3">Takeaway</h3>
              <p className="text-white/80 text-sm mt-1">
                Bungkus / bawa pulang
              </p>
            </div>
            <Plus size={20} className="opacity-60 group-hover:opacity-100" />
          </div>
        </Link>

        <Link
          href="/dashboard/kasir/riwayat"
          className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 hover:border-brand-500 transition-colors"
        >
          <Receipt size={24} className="text-brand-600 dark:text-brand-400" />
          <h3 className="font-heading font-bold text-lg mt-3">Riwayat</h3>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Lihat transaksi
          </p>
        </Link>

        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5">
          <TableIcon
            size={24}
            className="text-brand-600 dark:text-brand-400"
          />
          <h3 className="font-heading font-bold text-lg mt-3">Dine In</h3>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Pilih meja di bawah
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-[var(--color-muted)]">Kosong</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-[var(--color-muted)]">Terisi</span>
        </div>
      </div>

      {/* Daftar Meja */}
      <h2 className="font-heading font-bold text-lg mb-4">Pilih Meja</h2>

      {tables.length === 0 ? (
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-12 text-center">
          <p className="text-[var(--color-muted)] text-sm">
            Belum ada meja. Tambahkan dulu di panel admin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((t) => {
            const activeOrder = tableOrderMap.get(t.id);
            const isOccupied = !!activeOrder;

            return (
              <Link
                key={t.id}
                href={
                  isOccupied
                    ? `/dashboard/kasir/struk/${activeOrder.id}`
                    : `/dashboard/kasir/order/new?tableId=${t.id}`
                }
                className={`group relative p-5 rounded-2xl border-2 transition-all text-center ${
                  isOccupied
                    ? "bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-800"
                    : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-brand-500 hover:shadow-lg"
                }`}
              >
                {/* Status dot */}
                <div
                  className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${
                    isOccupied ? "bg-red-500" : "bg-green-500"
                  }`}
                />

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${
                    isOccupied
                      ? "bg-gradient-to-br from-red-400 to-red-600"
                      : "bg-gradient-to-br from-brand-500 to-brand-700"
                  }`}
                >
                  <TableIcon size={24} className="text-white" />
                </div>
                <h3 className="font-heading font-bold text-lg mt-3">
                  {t.name}
                </h3>
                {isOccupied ? (
                  <>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
                      {activeOrder.orderNumber}
                    </p>
                    <div className="mt-2 flex items-center justify-center gap-1 text-xs text-red-600 dark:text-red-400">
                      <Receipt size={11} /> Lihat Struk
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-[var(--color-muted)] mt-1">
                    Kosong
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
