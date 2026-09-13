"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";

import {
  LayoutDashboard,
  Package,
  UtensilsCrossed,
  Users,
  Table as TableIcon,
  BarChart3,
  Menu as MenuIcon,
  X,
  LogOut,
  Coffee,
  ShoppingCart,
  Receipt,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <p className="text-[var(--color-muted)]">Loading...</p>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const role = (session.user as any).role;

  const adminMenu = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/admin/products", label: "Produk", icon: Package },
    {
      href: "/dashboard/admin/categories",
      label: "Kategori",
      icon: UtensilsCrossed,
    },
    { href: "/dashboard/admin/tables", label: "Meja", icon: TableIcon },
    { href: "/dashboard/admin/users", label: "User", icon: Users },
    { href: "/dashboard/admin/reports", label: "Laporan", icon: BarChart3 },
  ];

  const kasirMenu = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/kasir", label: "Kasir", icon: ShoppingCart },
    { href: "/dashboard/kasir/riwayat", label: "Riwayat", icon: Receipt },
  ];

  const dapurMenu = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/dapur", label: "Dapur", icon: UtensilsCrossed },
  ];

  const menu =
    role === "ADMIN" ? adminMenu : role === "KASIR" ? kasirMenu : dapurMenu;

  return (
    <div className="min-h-screen flex bg-[var(--color-background)]">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)]
          flex flex-col
          transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Coffee size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg leading-tight">
                Kasir Kafe
              </h1>
              <p className="text-xs text-[var(--color-muted)]">{role}</p>
            </div>
          </div>
          <button
            className="md:hidden p-1"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                  text-[var(--color-foreground)]
                  hover:bg-brand-100 dark:hover:bg-brand-800
                  transition-colors"
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[var(--color-border)]">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full
              text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header
          className="sticky top-0 z-30 bg-[var(--color-surface)] 
            border-b border-[var(--color-border)] px-4 py-3
            flex items-center justify-between"
        >
          <button
            className="md:hidden p-2 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-800"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon size={20} />
          </button>

          <div className="hidden md:block text-sm text-[var(--color-muted)]">
            Selamat datang,{" "}
            <span className="font-medium text-[var(--color-foreground)]">
              {session.user?.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-medium">
              {session.user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
