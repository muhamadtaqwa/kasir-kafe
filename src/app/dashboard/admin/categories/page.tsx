import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, UtensilsCrossed } from "lucide-react";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Kategori</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            {categories.length} kategori terdaftar
          </p>
        </div>
        <Link
          href="/dashboard/admin/categories/new"
          className="inline-flex items-center justify-center gap-2
            bg-gradient-to-r from-brand-600 to-brand-700
            hover:from-brand-700 hover:to-brand-800
            text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
        >
          <Plus size={16} /> Tambah Kategori
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-800 flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed size={28} className="text-brand-600 dark:text-brand-400" />
          </div>
          <h3 className="font-heading font-bold text-lg">Belum ada kategori</h3>
          <p className="text-sm text-[var(--color-muted)] mt-1 mb-4">
            Tambahkan kategori untuk mengelompokkan produk
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/dashboard/admin/categories/${c.id}`}
              className="group bg-[var(--color-surface)] p-5 rounded-2xl border border-[var(--color-border)]
                hover:border-brand-500 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                  <UtensilsCrossed size={20} className="text-white" />
                </div>
                <Pencil
                  size={16}
                  className="text-[var(--color-muted)] group-hover:text-brand-600 transition-colors"
                />
              </div>
              <h3 className="font-heading font-bold text-lg mt-4">{c.name}</h3>
              <p className="text-sm text-[var(--color-muted)] mt-1">
                {c._count.products} produk
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}