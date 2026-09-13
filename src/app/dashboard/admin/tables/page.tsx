import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Table as TableIcon } from "lucide-react";

export default async function TablesPage() {
  const tables = await prisma.table.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Meja</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            {tables.length} meja terdaftar
          </p>
        </div>
        <Link
          href="/dashboard/admin/tables/new"
          className="inline-flex items-center justify-center gap-2
            bg-gradient-to-r from-brand-600 to-brand-700
            hover:from-brand-700 hover:to-brand-800
            text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
        >
          <Plus size={16} /> Tambah Meja
        </Link>
      </div>

      {tables.length === 0 ? (
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-800 flex items-center justify-center mx-auto mb-4">
            <TableIcon size={28} className="text-brand-600 dark:text-brand-400" />
          </div>
          <h3 className="font-heading font-bold text-lg">Belum ada meja</h3>
          <p className="text-sm text-[var(--color-muted)] mt-1 mb-4">
            Tambahkan meja dan QR code untuk pelanggan
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((t) => (
            <Link
              key={t.id}
              href={`/dashboard/admin/tables/${t.id}`}
              className="group bg-[var(--color-surface)] p-5 rounded-2xl border border-[var(--color-border)]
                hover:border-brand-500 hover:shadow-lg transition-all text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto">
                <TableIcon size={24} className="text-white" />
              </div>
              <h3 className="font-heading font-bold text-lg mt-3">{t.name}</h3>
              <p className="text-xs text-[var(--color-muted)] mt-1">{t.qrCode}</p>
              <Pencil
                size={14}
                className="mx-auto mt-2 text-[var(--color-muted)] group-hover:text-brand-600 transition-colors"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}