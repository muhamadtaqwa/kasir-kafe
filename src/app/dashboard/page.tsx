import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Package,
  UtensilsCrossed,
  Table as TableIcon,
  Users,
  BarChart3,
  ShoppingCart,
  ChefHat,
  ArrowRight,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const role = (session.user as any).role;

  const adminCards = [
    {
      href: "/dashboard/admin/products",
      label: "Produk",
      desc: "Kelola menu & harga",
      icon: Package,
    },
    {
      href: "/dashboard/admin/categories",
      label: "Kategori",
      desc: "Kelola kategori menu",
      icon: UtensilsCrossed,
    },
    {
      href: "/dashboard/admin/tables",
      label: "Meja",
      desc: "Kelola meja & QR code",
      icon: TableIcon,
    },
    {
      href: "/dashboard/admin/users",
      label: "User",
      desc: "Kelola kasir & dapur",
      icon: Users,
    },
    {
      href: "/dashboard/admin/reports",
      label: "Laporan",
      desc: "Lihat penjualan",
      icon: BarChart3,
    },
  ];

  const kasirCards = [
    {
      href: "/dashboard/kasir",
      label: "Kasir",
      desc: "Input pesanan & pembayaran",
      icon: ShoppingCart,
    },
  ];

  const dapurCards = [
    {
      href: "/dashboard/dapur",
      label: "Dapur",
      desc: "Antrian pesanan",
      icon: ChefHat,
    },
  ];

  const cards =
    role === "ADMIN" ? adminCards : role === "KASIR" ? kasirCards : dapurCards;

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold">
          Halo, {session.user?.name} 
        </h1>
        <p className="text-[var(--color-muted)] mt-1 text-sm">
          Role: <span className="font-medium text-brand-600 dark:text-brand-400">{role}</span>
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group bg-[var(--color-surface)] p-5 rounded-2xl
                border border-[var(--color-border)]
                hover:border-brand-500 hover:shadow-lg
                transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                  <Icon size={22} className="text-white" />
                </div>
                <ArrowRight
                  size={18}
                  className="text-[var(--color-muted)] group-hover:text-brand-600 group-hover:translate-x-1 transition-all"
                />
              </div>
              <h3 className="font-heading font-bold text-lg mt-4">
                {card.label}
              </h3>
              <p className="text-sm text-[var(--color-muted)] mt-1">
                {card.desc}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}