import { prisma } from "@/lib/prisma";
import { OrderForm } from "./order-form";

export default async function NewOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ tableId?: string; type?: string }>;
}) {
  const params = await searchParams;

  const [products, categories, table] = await Promise.all([
    prisma.product.findMany({
      where: { isAvailable: true },
      include: { category: true },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({ where: { isActive: true } }),
    params.tableId
      ? prisma.table.findUnique({ where: { id: params.tableId } })
      : null,
  ]);

  const orderType = params.type === "TAKEAWAY" ? "TAKEAWAY" : "DINE_IN";

  return (
    <OrderForm
      products={products}
      categories={categories}
      table={table}
      orderType={orderType}
    />
  );
}