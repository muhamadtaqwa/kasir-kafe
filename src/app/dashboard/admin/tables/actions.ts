"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTable(formData: FormData) {
  const name = formData.get("name") as string;
  const qrCode = formData.get("qrCode") as string;

  await prisma.table.create({
    data: {
      name,
      qrCode,
    },
  });

  revalidatePath("/dashboard/admin/tables");
  redirect("/dashboard/admin/tables");
}

export async function updateTable(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const qrCode = formData.get("qrCode") as string;

  await prisma.table.update({
    where: { id },
    data: {
      name,
      qrCode,
    },
  });

  revalidatePath("/dashboard/admin/tables");
  redirect("/dashboard/admin/tables");
}

export async function deleteTable(id: string) {
  await prisma.table.delete({ where: { id } });
  revalidatePath("/dashboard/admin/tables");
  redirect("/dashboard/admin/tables");
}