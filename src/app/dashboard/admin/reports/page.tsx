import { prisma } from "@/lib/prisma";
import {
  TrendingUp,
  ShoppingCart,
  Wallet,
  QrCode,
  Banknote,
  Package,
} from "lucide-react";

export default async function ReportsPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: {
      status: { in: ["PAID", "DIMASAK", "SELESAI"] },
      createdAt: { gte: today },
    },
    include: {
      payment: true,
      items: {
        include: { product: true },
      },
    },
  });

  const totalOrder = orders.length;
  const totalPendapatan = orders.reduce((sum, o) => sum + o.total, 0);
  const totalDiskon = orders.reduce((sum, o) => sum + o.discount, 0);
  const totalPajak = orders.reduce((sum, o) => sum + o.tax, 0);

  const totalQRIS = orders
    .filter((o) => o.payment?.method === "QRIS" && o.payment.status === "SUCCESS")
    .reduce((sum, o) => sum + o.total, 0);

  const totalTunai = orders
    .filter((o) => o.payment?.method === "CASH" && o.payment.status === "SUCCESS")
    .reduce((sum, o) => sum + o.total, 0);

  // Produk terlaris
  const productMap = new Map<string, { name: string; qty: number }>();
  orders.forEach((o) => {
    o.items.forEach((item) => {
      const existing = productMap.get(item.productId);
      if (existing) {
        existing.qty += item.qty;
      } else {
        productMap.set(item.productId, {
          name: item.product.name,
          qty: item.qty,
        });
      }
    });
  });

  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Laporan Keuangan</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Ringkasan hari ini —{" "}
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Ringkasan Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={ShoppingCart}
          label="Total Order"
          value={totalOrder.toString()}
        />
        <StatCard
          icon={TrendingUp}
          label="Pendapatan"
          value={`Rp ${totalPendapatan.toLocaleString("id-ID")}`}
        />
        <StatCard
          icon={QrCode}
          label="QRIS"
          value={`Rp ${totalQRIS.toLocaleString("id-ID")}`}
        />
        <StatCard
          icon={Banknote}
          label="Tunai"
          value={`Rp ${totalTunai.toLocaleString("id-ID")}`}
        />
      </div>

      {/* Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5">
          <h2 className="font-heading font-bold text-lg mb-4">Rincian</h2>
          <div className="space-y-3 text-sm">
            <Row label="Pendapatan Kotor" value={`Rp ${totalPendapatan.toLocaleString("id-ID")}`} />
            <Row label="Total Diskon" value={`- Rp ${totalDiskon.toLocaleString("id-ID")}`} />
            <Row label="Total Pajak" value={`Rp ${totalPajak.toLocaleString("id-ID")}`} />
            <div className="border-t border-[var(--color-border)] pt-3">
              <Row
                label="Pendapatan Bersih"
                value={`Rp ${(totalPendapatan - totalDiskon).toLocaleString("id-ID")}`}
                bold
              />
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5">
          <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
            <Package size={18} /> Produk Terlaris
          </h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)]">Belum ada penjualan</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300 text-xs flex items-center justify-center font-medium">
                      {i + 1}
                    </span>
                    <span>{p.name}</span>
                  </div>
                  <span className="text-[var(--color-muted)]">{p.qty} pcs</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Riwayat Transaksi */}
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="p-5 border-b border-[var(--color-border)]">
          <h2 className="font-heading font-bold text-lg">Riwayat Transaksi Hari Ini</h2>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center text-[var(--color-muted)] text-sm">
            Belum ada transaksi hari ini
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-50 dark:bg-brand-900/40 border-b border-[var(--color-border)]">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">No. Order</th>
                  <th className="text-left px-4 py-3 font-medium">Pelanggan</th>
                  <th className="text-left px-4 py-3 font-medium">Metode</th>
                  <th className="text-right px-4 py-3 font-medium">Total</th>
                  <th className="text-left px-4 py-3 font-medium">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-[var(--color-border)] last:border-0"
                  >
                    <td className="px-4 py-3 font-medium">{o.orderNumber}</td>
                    <td className="px-4 py-3 text-[var(--color-muted)]">
                      {o.customerName || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs">
                        {o.payment?.method === "QRIS" ? (
                          <><QrCode size={12} /> QRIS</>
                        ) : (
                          <><Banknote size={12} /> Tunai</>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      Rp {o.total.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-muted)] text-xs">
                      {new Date(o.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mb-3">
        <Icon size={18} className="text-white" />
      </div>
      <p className="text-xs text-[var(--color-muted)]">{label}</p>
      <p className="font-heading font-bold text-lg mt-0.5">{value}</p>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className={bold ? "font-medium" : "text-[var(--color-muted)]"}>
        {label}
      </span>
      <span className={bold ? "font-bold text-brand-600 dark:text-brand-400" : ""}>
        {value}
      </span>
    </div>
  );
}