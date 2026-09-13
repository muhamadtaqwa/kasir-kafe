import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MenuClient } from "./menu-client";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ qrCode: string }>;
}) {
  const { qrCode } = await params;

  const table = await prisma.table.findUnique({
    where: { qrCode },
  });

  if (!table || !table.isActive) notFound();

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isAvailable: true },
      include: { category: true },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({ where: { isActive: true } }),
  ]);

  return (
    <MenuClient
      table={{ id: table.id, name: table.name }}
      products={products}
      categories={categories}
    />
  );
}