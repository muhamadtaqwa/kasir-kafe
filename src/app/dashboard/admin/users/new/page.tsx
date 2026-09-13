import { createUser } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewUserPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/admin/users"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-brand-600 mb-3 transition-colors"
        >
          <ArrowLeft size={16} /> Kembali
        </Link>
        <h1 className="font-heading text-2xl font-bold">Tambah User</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Isi data user baru
        </p>
      </div>

      <form
        action={createUser}
        className="bg-[var(--color-surface)] p-5 md:p-6 rounded-2xl border border-[var(--color-border)] space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Nama <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            required
            placeholder="Contoh: Kasir 2"
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-background)] text-[var(--color-foreground)]
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
              placeholder:text-[var(--color-muted)]"
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
            placeholder="kasir2@kafe.id"
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-background)] text-[var(--color-foreground)]
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
              placeholder:text-[var(--color-muted)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Minimal 6 karakter"
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
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-background)] text-[var(--color-foreground)]
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            <option value="">Pilih role</option>
            <option value="KASIR">KASIR</option>
            <option value="DAPUR">DAPUR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-brand-600 to-brand-700
              hover:from-brand-700 hover:to-brand-800
              text-white py-2.5 rounded-lg font-medium transition-all"
          >
            Simpan User
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