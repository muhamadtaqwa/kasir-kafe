import { prisma } from "@/lib/prisma";
import { OrderCard } from "./order-card";

export default async function DapurPage() {
  const orders = await prisma.order.findMany({
    where: {
      status: { in: ["PAID", "DIMASAK"] },
    },
    include: {
      items: {
        include: { product: true },
      },
      table: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const paidOrders = orders.filter((o) => o.status === "PAID");
  const cookingOrders = orders.filter((o) => o.status === "DIMASAK");

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Dapur</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          {orders.length} pesanan aktif
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-12 text-center">
          <div className="text-5xl mb-4">🍳</div>
          <h3 className="font-heading font-bold text-lg">Tidak ada pesanan</h3>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Semua pesanan sudah selesai
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Kolom Antrian */}
          <div>
            <h2 className="font-heading font-bold text-lg mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              Antrian ({paidOrders.length})
            </h2>
            <div className="space-y-3">
              {paidOrders.length === 0 ? (
                <p className="text-sm text-[var(--color-muted)] py-4 text-center">
                  Kosong
                </p>
              ) : (
                paidOrders.map((o) => (
                  <OrderCard key={o.id} order={o} />
                ))
              )}
            </div>
          </div>

          {/* Kolom Dimasak */}
          <div>
            <h2 className="font-heading font-bold text-lg mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Sedang Dimasak ({cookingOrders.length})
            </h2>
            <div className="space-y-3">
              {cookingOrders.length === 0 ? (
                <p className="text-sm text-[var(--color-muted)] py-4 text-center">
                  Kosong
                </p>
              ) : (
                cookingOrders.map((o) => (
                  <OrderCard key={o.id} order={o} />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}