import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PrintButton } from "./print-button";

export default async function StrukPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true } },
      payment: true,
      table: true,
      kasir: true,
    },
  });

  if (!order) notFound();

  const tanggal = new Date(order.createdAt).toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      <div className="max-w-xs mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow-lg print:shadow-none p-4 text-xs font-mono">
          {/* Header */}
          <div className="text-center border-b border-dashed border-gray-400 pb-3 mb-3">
            <h1 className="font-bold text-base">KASIR KAFE</h1>
            <p className="text-[10px] mt-0.5">Jl. Contoh No. 123</p>
            <p className="text-[10px]">Telp: 021-1234567</p>
          </div>

          {/* Info Order */}
          <div className="border-b border-dashed border-gray-400 pb-3 mb-3 space-y-0.5">
            <div className="flex justify-between">
              <span>No. Order</span>
              <span className="font-bold">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Tanggal</span>
              <span>{tanggal}</span>
            </div>
            {order.table && (
              <div className="flex justify-between">
                <span>Meja</span>
                <span>{order.table.name}</span>
              </div>
            )}
            {order.customerName && (
              <div className="flex justify-between">
                <span>Pelanggan</span>
                <span>{order.customerName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Kasir</span>
              <span>{order.kasir?.name ?? "-"}</span>
            </div>
          </div>

          {/* Items */}
          <div className="border-b border-dashed border-gray-400 pb-3 mb-3 space-y-2">
            {order.items.map((item) => (
              <div key={item.id}>
                <div className="font-medium">{item.product.name}</div>
                <div className="flex justify-between text-[10px]">
                  <span>
                    {item.qty} x Rp {item.price.toLocaleString("id-ID")}
                  </span>
                  <span>
                    Rp {(item.qty * item.price).toLocaleString("id-ID")}
                  </span>
                </div>
                {item.notes && (
                  <div className="text-[10px] italic text-gray-600">
                    * {item.notes}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-b border-dashed border-gray-400 pb-3 mb-3 space-y-0.5">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rp {order.subtotal.toLocaleString("id-ID")}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span>Diskon</span>
                <span>- Rp {order.discount.toLocaleString("id-ID")}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Pajak</span>
              <span>Rp {order.tax.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-1 border-t border-gray-400 mt-1">
              <span>TOTAL</span>
              <span>Rp {order.total.toLocaleString("id-ID")}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="border-b border-dashed border-gray-400 pb-3 mb-3 space-y-0.5">
            <div className="flex justify-between">
              <span>Metode</span>
              <span>{order.payment?.method ?? "-"}</span>
            </div>
            {order.payment?.method === "CASH" && order.payment?.paidAmount && (
              <>
                <div className="flex justify-between">
                  <span>Tunai</span>
                  <span>
                    Rp {order.payment.paidAmount.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Kembalian</span>
                  <span>
                    Rp{" "}
                    {(order.payment.changeAmount ?? 0).toLocaleString("id-ID")}
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <span>Status</span>
              <span className="font-bold">
                {order.payment?.status === "SUCCESS" ? "LUNAS" : "BELUM BAYAR"}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-[10px] pt-2">
            <p className="font-medium">Terima Kasih 🙏</p>
            <p className="mt-1">Selamat menikmati</p>
          </div>
        </div>

        {/* Tombol Print */}
        <div className="mt-4 print:hidden">
          <PrintButton />
        </div>
      </div>
    </div>
  );
}
