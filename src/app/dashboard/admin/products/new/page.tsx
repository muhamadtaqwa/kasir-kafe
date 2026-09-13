import { prisma } from "@/lib/prisma";
import { createProduct } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
  });

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/admin/products"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-brand-600 mb-3 transition-colors"
        >
          <ArrowLeft size={16} /> Kembali
        </Link>
        <h1 className="font-heading text-2xl font-bold">Tambah Produk</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Isi data produk baru
        </p>
      </div>

      {/* Form */}
      <form
        action={createProduct}
        className="bg-[var(--color-surface)] p-5 md:p-6 rounded-2xl border border-[var(--color-border)] space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Nama Produk <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            required
            placeholder="Contoh: Es Kopi Gula Aren"
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-background)] text-[var(--color-foreground)]
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
              placeholder:text-[var(--color-muted)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Kategori <span className="text-red-500">*</span>
          </label>
          <select
            name="categoryId"
            required
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-background)] text-[var(--color-foreground)]
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            <option value="">Pilih kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Harga <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-muted)]">
              Rp
            </span>
            <input
              name="price"
              type="number"
              required
              min={0}
              placeholder="18000"
              className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[var(--color-border)]
                bg-[var(--color-background)] text-[var(--color-foreground)]
                focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                placeholder:text-[var(--color-muted)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Deskripsi</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Deskripsi singkat produk (opsional)"
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-background)] text-[var(--color-foreground)]
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
              placeholder:text-[var(--color-muted)] resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            URL Gambar (opsional)
          </label>
          <input
            name="image"
            placeholder="https://..."
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-background)] text-[var(--color-foreground)]
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
              placeholder:text-[var(--color-muted)]"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-brand-600 to-brand-700
              hover:from-brand-700 hover:to-brand-800
              text-white py-2.5 rounded-lg font-medium transition-all"
          >
            Simpan Produk
          </button>
          <Link
            href="/dashboard/admin/products"
            className="px-6 py-2.5 rounded-lg border border-[var(--color-border)]
              hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors text-center"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}