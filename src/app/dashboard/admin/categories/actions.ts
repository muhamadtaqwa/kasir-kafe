"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const icon = formData.get("icon") as string;

  await prisma.category.create({
    data: {
      name,
      icon: icon || null,
    },
  });

  revalidatePath("/dashboard/admin/categories");
  redirect("/dashboard/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const icon = formData.get("icon") as string;

  await prisma.category.update({
    where: { id },
    data: {
      name,
      icon: icon || null,
    },
  });

  revalidatePath("/dashboard/admin/categories");
  redirect("/dashboard/admin/categories");
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/dashboard/admin/categories");
  redirect("/dashboard/admin/categories");
}