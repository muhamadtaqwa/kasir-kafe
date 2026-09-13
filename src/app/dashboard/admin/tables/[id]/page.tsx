import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateTable } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DeleteTableButton } from "./delete-button";

export default async function EditTablePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const table = await prisma.table.findUnique({ where: { id } });

  if (!table) notFound();

  const updateWithId = updateTable.bind(null, table.id);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/admin/tables"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-brand-600 mb-3 transition-colors"
        >
          <ArrowLeft size={16} /> Kembali
        </Link>
        <div className="flex justify-between items-start gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold">Edit Meja</h1>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              Ubah data meja
            </p>
          </div>
          <DeleteTableButton id={table.id} />
        </div>
      </div>

      <form
        action={updateWithId}
        className="bg-[var(--color-surface)] p-5 md:p-6 rounded-2xl border border-[var(--color-border)] space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Nama Meja <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            required
            defaultValue={table.name}
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-background)] text-[var(--color-foreground)]
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Kode QR <span className="text-red-500">*</span>
          </label>
          <input
            name="qrCode"
            required
            defaultValue={table.qrCode}
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
            href="/dashboard/admin/tables"
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