"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(
  orderId: string,
  status: "DIMASAK" | "SELESAI"
) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/dashboard/dapur");
  revalidatePath("/dashboard/kasir");
  revalidatePath("/dashboard/kasir/riwayat");
}