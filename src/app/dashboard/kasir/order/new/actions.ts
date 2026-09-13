"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/../auth";
import { revalidatePath } from "next/cache";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  notes: string;
};

export async function createOrder(data: {
  tableId: string | null;
  customerName: string | null;
  orderType: string;
  items: CartItem[];
  paymentMethod: "CASH" | "QRIS";
  paidAmount?: number | null;
}) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const subtotal = data.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + tax;

  // Pakai timestamp biar unik
  const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;

  const paidAmount = data.paidAmount ?? total;
  const changeAmount = paidAmount - total;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      tableId: data.tableId,
      customerName: data.customerName,
      orderSource: "KASIR",
      orderType: data.orderType as "DINE_IN" | "TAKEAWAY",
      status: "PAID",
      subtotal,
      tax,
      total,
      createdBy: (session.user as any).id,
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
          method: data.paymentMethod,
          status: "SUCCESS",
          amount: total,
          paidAmount: data.paymentMethod === "CASH" ? paidAmount : null,
          changeAmount: data.paymentMethod === "CASH" ? changeAmount : null,
          paidAt: new Date(),
        },
      },
    },
  });

  revalidatePath("/dashboard/kasir");
  revalidatePath("/dashboard/dapur");

  return { orderId: order.id };
}