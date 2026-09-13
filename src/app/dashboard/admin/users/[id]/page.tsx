import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateUser } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DeleteUserButton } from "./delete-button";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) notFound();

  const updateWithId = updateUser.bind(null, user.id);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/admin/users"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-brand-600 mb-3 transition-colors"
        >
          <ArrowLeft size={16} /> Kembali
        </Link>
        <div className="flex justify-between items-start gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold">Edit User</h1>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              Ubah data user
            </p>
          </div>
          <DeleteUserButton id={user.id} />
        </div>
      </div>

      <form
        action={updateWithId}
        className="bg-[var(--color-surface)] p-5 md:p-6 rounded-2xl border border-[var(--color-border)] space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Nama <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            required
            defaultValue={user.name}
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-background)] text-[var(--color-foreground)]
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            defaultValue={user.email}
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-background)] text-[var(--color-foreground)]
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Password Baru
          </label>
          <input
            name="password"
            type="password"
            minLength={6}
            placeholder="Kosongkan kalau tidak ingin ganti"
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-background)] text-[var(--color-foreground)]
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
              placeholder:text-[var(--color-muted)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            name="role"
            required
            defaultValue={user.role}
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-background)] text-[var(--color-foreground)]
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            <option value="KASIR">KASIR</option>
            <option value="DAPUR">DAPUR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            defaultChecked={user.isActive}
            className="w-4 h-4 accent-brand-600"
          />
          <label htmlFor="isActive" className="text-sm">
            Aktif
          </label>
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
            href="/dashboard/admin/users"
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