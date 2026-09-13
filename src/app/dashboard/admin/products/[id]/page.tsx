import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateProduct } from "../actions";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { DeleteProductButton } from "./delete-button";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ where: { isActive: true } }),
  ]);

  if (!product) notFound();

  const updateWithId = updateProduct.bind(null, product.id);

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
        <div className="flex justify-between items-start gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold">Edit Produk</h1>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              Ubah data produk
            </p>
          </div>
          <DeleteProductButton id={product.id} />
        </div>
      </div>

      {/* Form */}
      <form
        action={updateWithId}
        className="bg-[var(--color-surface)] p-5 md:p-6 rounded-2xl border border-[var(--color-border)] space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Nama Produk <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            required
            defaultValue={product.name}
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-background)] text-[var(--color-foreground)]
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Kategori <span className="text-red-500">*</span>
          </label>
          <select
            name="categoryId"
            required
            defaultValue={product.categoryId}
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-background)] text-[var(--color-foreground)]
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
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
              defaultValue={product.price}
              className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[var(--color-border)]
                bg-[var(--color-background)] text-[var(--color-foreground)]
                focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Deskripsi</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={product.description ?? ""}
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-background)] text-[var(--color-foreground)]
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
              resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            URL Gambar (opsional)
          </label>
          <input
            name="image"
            defaultValue={product.image ?? ""}
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-background)] text-[var(--color-foreground)]
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-brand-600 to-brand-700
              hover:from-brand-700 hover:to-brand-800
              text-white py-2.5 rounded-lg font-medium transition-all"
          >
            Simpan Perubahan
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