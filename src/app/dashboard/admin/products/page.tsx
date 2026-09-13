import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Package } from "lucide-react";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Produk</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            {products.length} produk terdaftar
          </p>
        </div>
        <Link
          href="/dashboard/admin/products/new"
          className="inline-flex items-center justify-center gap-2 
            bg-gradient-to-r from-brand-600 to-brand-700
            hover:from-brand-700 hover:to-brand-800
            text-white px-4 py-2.5 rounded-lg text-sm font-medium
            transition-all"
        >
          <Plus size={16} /> Tambah Produk
        </Link>
      </div>

      {/* Empty state */}
      {products.length === 0 ? (
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-800 flex items-center justify-center mx-auto mb-4">
            <Package size={28} className="text-brand-600 dark:text-brand-400" />
          </div>
          <h3 className="font-heading font-bold text-lg">Belum ada produk</h3>
          <p className="text-sm text-[var(--color-muted)] mt-1 mb-4">
            Mulai tambahkan menu kafe kamu
          </p>
          <Link
            href="/dashboard/admin/products/new"
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            <Plus size={16} /> Tambah Produk
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-brand-50 dark:bg-brand-900/40 border-b border-[var(--color-border)]">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Nama</th>
                  <th className="text-left px-4 py-3 font-medium">Kategori</th>
                  <th className="text-right px-4 py-3 font-medium">Harga</th>
                  <th className="text-center px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-[var(--color-border)] last:border-0 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{p.name}</div>
                      {p.description && (
                        <div className="text-xs text-[var(--color-muted)] mt-0.5 line-clamp-1">
                          {p.description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 rounded-md bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300 text-xs">
                        {p.category.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      Rp {p.price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.isAvailable ? (
                        <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Tersedia
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          Habis
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/admin/products/${p.id}`}
                        className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:text-brand-800 text-sm"
                      >
                        <Pencil size={14} /> Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/dashboard/admin/products/${p.id}`}
                className="block bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium truncate">{p.name}</h3>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300 text-xs">
                      {p.category.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      Rp {p.price.toLocaleString("id-ID")}
                    </div>
                    <div className="mt-1">
                      {p.isAvailable ? (
                        <span className="text-green-600 dark:text-green-400 text-xs">Tersedia</span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400 text-xs">Habis</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}