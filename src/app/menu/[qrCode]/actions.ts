"use server";

import { prisma } from "@/lib/prisma";
import { coreApi } from "@/lib/midtrans";
import { revalidatePath } from "next/cache";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  notes: string;
};

export async function createQrOrder(data: {
  tableId: string;
  customerName: string | null;
  items: CartItem[];
}) {
  const subtotal = data.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + tax;

  // Pakai timestamp biar unik selamanya
  const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      tableId: data.tableId,
      customerName: data.customerName,
      orderSource: "QR",
      orderType: "DINE_IN",
      status: "PENDING",
      subtotal,
      tax,
      total,
      items: {
        create: data.items.map((i) => ({
          productId: i.productId,
          qty: i.qty,
          price: i.price,
          notes: i.notes || null,
        })),
      },
      payment: {
        create: {
          method: "QRIS",
          status: "PENDING",
          amount: total,
        },
      },
    },
    include: { payment: true },
  });

  try {
    const qrisResponse = await coreApi.charge({
      payment_type: "qris",
      transaction_details: {
        order_id: order.orderNumber,
        gross_amount: total,
      },
      qris: {
        acquirer: "gopay",
      },
      customer_details: {
        first_name: data.customerName || "Pelanggan",
      },
    });

    const qrAction = qrisResponse.actions?.find(
      (a: any) => a.name === "generate-qr-code"
    );

    await prisma.payment.updateMany({
      where: { orderId: order.id },
      data: {
        midtransTransactionId: qrisResponse.transaction_id,
        midtransPaymentType: qrisResponse.payment_type,
        midtransQrUrl: qrAction?.url ?? null,
        midtransQrString: qrisResponse.qr_string ?? null,
      },
    });

    revalidatePath("/dashboard/kasir");
    revalidatePath("/dashboard/dapur");

    return {
      orderNumber: order.orderNumber,
      orderId: order.id,
      qrUrl: qrAction?.url ?? null,
      qrString: qrisResponse.qr_string ?? null,
      total,
    };
  } catch (error: any) {
    await prisma.payment.deleteMany({ where: { orderId: order.id } });
    await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
    await prisma.order.delete({ where: { id: order.id } });
    throw new Error(error.message || "Gagal membuat QRIS");
  }
}

export async function checkPaymentStatus(orderId: string) {
  const payment = await prisma.payment.findUnique({
    where: { orderId },
  });

  if (!payment) return { status: "NOT_FOUND" };

  if (payment.status === "PENDING" && payment.midtransTransactionId) {
    try {
      const statusResponse = await coreApi.transaction.status(
        payment.midtransTransactionId
      );

      const transactionStatus = statusResponse.transaction_status;
      const fraudStatus = statusResponse.fraud_status;

      if (
        transactionStatus === "capture" ||
        transactionStatus === "settlement"
      ) {
        if (fraudStatus === "accept" || !fraudStatus) {
          await prisma.payment.update({
            where: { orderId },
            data: { status: "SUCCESS", paidAt: new Date() },
          });
          await prisma.order.update({
            where: { id: orderId },
            data: { status: "PAID" },
          });

          revalidatePath("/dashboard/dapur");
          revalidatePath("/dashboard/kasir");

          return { status: "SUCCESS" };
        }
      }

      if (
        transactionStatus === "expire" ||
        transactionStatus === "cancel" ||
        transactionStatus === "deny"
      ) {
        await prisma.payment.update({
          where: { orderId },
          data: { status: "FAILED" },
        });
        return { status: "FAILED" };
      }

      return { status: "PENDING" };
    } catch (e) {
      return { status: "PENDING" };
    }
  }

  return { status: payment.status };
}