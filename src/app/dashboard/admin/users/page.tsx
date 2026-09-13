import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Users } from "lucide-react";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const roleBadge = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
      KASIR: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      DAPUR: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
    };
    return colors[role] || "bg-gray-100 text-gray-700";
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">User</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            {users.length} user terdaftar
          </p>
        </div>
        <Link
          href="/dashboard/admin/users/new"
          className="inline-flex items-center justify-center gap-2
            bg-gradient-to-r from-brand-600 to-brand-700
            hover:from-brand-700 hover:to-brand-800
            text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
        >
          <Plus size={16} /> Tambah User
        </Link>
      </div>

      {users.length === 0 ? (
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-800 flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-brand-600 dark:text-brand-400" />
          </div>
          <h3 className="font-heading font-bold text-lg">Belum ada user</h3>
          <p className="text-sm text-[var(--color-muted)] mt-1 mb-4">
            Tambahkan user kasir atau dapur
          </p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-brand-50 dark:bg-brand-900/40 border-b border-[var(--color-border)]">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Nama</th>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Role</th>
                  <th className="text-center px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-[var(--color-border)] last:border-0 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-[var(--color-muted)]">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${roleBadge(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {u.isActive ? (
                        <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/admin/users/${u.id}`}
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

          {/* Mobile */}
          <div className="md:hidden space-y-3">
            {users.map((u) => (
              <Link
                key={u.id}
                href={`/dashboard/admin/users/${u.id}`}
                className="block bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium truncate">{u.name}</h3>
                    <p className="text-xs text-[var(--color-muted)] truncate">{u.email}</p>
                    <span className={`inline-block mt-2 px-2 py-0.5 rounded-md text-xs font-medium ${roleBadge(u.role)}`}>
                      {u.role}
                    </span>
                  </div>
                  {u.isActive ? (
                    <span className="text-green-600 dark:text-green-400 text-xs">Aktif</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400 text-xs">Nonaktif</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}