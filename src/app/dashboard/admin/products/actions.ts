"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseInt(formData.get("price") as string);
  const categoryId = formData.get("categoryId") as string;
  const image = formData.get("image") as string;

  await prisma.product.create({
    data: {
      name,
      description: description || null,
      price,
      categoryId,
      image: image || null,
    },
  });

  revalidatePath("/dashboard/admin/products");
  redirect("/dashboard/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseInt(formData.get("price") as string);
  const categoryId = formData.get("categoryId") as string;
  const image = formData.get("image") as string;

  await prisma.product.update({
    where: { id },
    data: {
      name,
      description: description || null,
      price,
      categoryId,
      image: image || null,
    },
  });

  revalidatePath("/dashboard/admin/products");
  redirect("/dashboard/admin/products");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/dashboard/admin/products");
  redirect("/dashboard/admin/products");
}