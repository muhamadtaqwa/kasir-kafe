"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  X,
  Search,
} from "lucide-react";
import { createOrder } from "./actions";
import { CashModal } from "./cash-modal";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  categoryId: string;
  category: { id: string; name: string };
};

type Category = { id: string; name: string };
type Table = { id: string; name: string } | null;

type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  notes: string;
};

export function OrderForm({
  products,
  categories,
  table,
  orderType,
}: {
  products: Product[];
  categories: Category[];
  table: Table;
  orderType: string;
}) {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [cashOpen, setCashOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const filtered = products.filter((p) => {
    const matchCat =
      activeCategory === "all" || p.categoryId === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  function addToCart(p: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === p.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === p.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        { productId: p.id, name: p.name, price: p.price, qty: 1, notes: "" },
      ];
    });
  }

  function updateQty(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((i) =>
          i.productId === productId ? { ...i, qty: i.qty + delta } : i
        )
        .filter((i) => i.qty > 0)
    );
  }

  function removeItem(productId: string) {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }

  function updateNotes(productId: string, notes: string) {
    setCart((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, notes } : i))
    );
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + tax;

  async function submitOrder(method: "CASH" | "QRIS", paidAmount?: number) {
    if (cart.length === 0) return;
    setSubmitting(true);

    try {
      const result = await createOrder({
        tableId: table?.id ?? null,
        customerName: customerName || null,
        orderType,
        items: cart,
        paymentMethod: method,
        paidAmount: paidAmount ?? null,
      });
      router.push(`/dashboard/kasir/struk/${result.orderId}`);
      router.refresh();
    } catch (e) {
      alert("Gagal membuat order");
      setSubmitting(false);
      setCashOpen(false);
    }
  }

  function handleSubmit(method: "CASH" | "QRIS") {
    if (method === "CASH") {
      setCashOpen(true);
    } else {
      submitOrder("QRIS");
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:h-[calc(100vh-8rem)]">
      {/* Kiri - Produk */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="mb-4">
          <Link
            href="/dashboard/kasir"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-brand-600 mb-2 transition-colors"
          >
            <ArrowLeft size={16} /> Kembali
          </Link>
          <h1 className="font-heading text-xl md:text-2xl font-bold">
            {table ? `Pesanan ${table.name}` : "Pesanan Takeaway"}
          </h1>
        </div>

        <div className="relative mb-3">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
          />
          <input
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-surface)] text-[var(--color-foreground)]
              focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeCategory === "all"
                ? "bg-brand-600 text-white"
                : "bg-[var(--color-surface)] border border-[var(--color-border)]"
            }`}
          >
            Semua
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                activeCategory === c.id
                  ? "bg-brand-600 text-white"
                  : "bg-[var(--color-surface)] border border-[var(--color-border)]"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-muted)] text-sm">
              Tidak ada produk
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]
                    p-3 text-left hover:border-brand-500 hover:shadow-md transition-all"
                >
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-800 dark:to-brand-900 mb-2 flex items-center justify-center overflow-hidden">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">☕</span>
                    )}
                  </div>
                  <h3 className="font-medium text-sm line-clamp-1">{p.name}</h3>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">
                    {p.category.name}
                  </p>
                  <p className="text-brand-600 dark:text-brand-400 font-bold text-sm mt-1">
                    Rp {p.price.toLocaleString("id-ID")}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Kanan - Cart Desktop */}
      <div className="hidden lg:flex lg:w-96 flex-col bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]">
        <CartContent
          cart={cart}
          customerName={customerName}
          setCustomerName={setCustomerName}
          updateQty={updateQty}
          removeItem={removeItem}
          updateNotes={updateNotes}
          subtotal={subtotal}
          tax={tax}
          total={total}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </div>

      {/* Mobile - Floating Button */}
      <button
        onClick={() => setCartOpen(true)}
        className="lg:hidden fixed bottom-20 right-4 z-30 
          bg-gradient-to-r from-brand-600 to-brand-700 text-white
          px-4 py-3 rounded-full shadow-xl flex items-center gap-2"
      >
        <ShoppingCart size={18} />
        <span className="font-medium">{cart.length}</span>
        {cart.length > 0 && (
          <span className="text-sm">· Rp {total.toLocaleString("id-ID")}</span>
        )}
      </button>

      {/* Mobile - Cart Drawer */}
      {cartOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/50"
            onClick={() => setCartOpen(false)}
          />
          <div className="w-full max-w-sm bg-[var(--color-surface)] flex flex-col">
            <button
              onClick={() => setCartOpen(false)}
              className="absolute top-4 right-4 p-2"
            >
              <X size={20} />
            </button>
            <CartContent
              cart={cart}
              customerName={customerName}
              setCustomerName={setCustomerName}
              updateQty={updateQty}
              removeItem={removeItem}
              updateNotes={updateNotes}
              subtotal={subtotal}
              tax={tax}
              total={total}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          </div>
        </div>
      )}

      {/* Cash Modal */}
      {cashOpen && (
        <CashModal
          total={total}
          submitting={submitting}
          onClose={() => setCashOpen(false)}
          onConfirm={(paid) => submitOrder("CASH", paid)}
        />
      )}
    </div>
  );
}

function CartContent({
  cart,
  customerName,
  setCustomerName,
  updateQty,
  removeItem,
  updateNotes,
  subtotal,
  tax,
  total,
  onSubmit,
  submitting,
}: any) {
  return (
    <>
      <div className="p-4 border-b border-[var(--color-border)]">
        <h2 className="font-heading font-bold text-lg flex items-center gap-2">
          <ShoppingCart size={18} />
          Keranjang ({cart.length})
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 ? (
          <p className="text-center text-sm text-[var(--color-muted)] py-8">
            Keranjang kosong
          </p>
        ) : (
          cart.map((item: CartItem) => (
            <div
              key={item.productId}
              className="bg-[var(--color-background)] rounded-lg p-3 border border-[var(--color-border)]"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-sm truncate">{item.name}</h3>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">
                    Rp {item.price.toLocaleString("id-ID")}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(item.productId, -1)}
                    className="w-7 h-7 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:bg-brand-50 dark:hover:bg-brand-900/30"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQty(item.productId, 1)}
                    className="w-7 h-7 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:bg-brand-50 dark:hover:bg-brand-900/30"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <span className="font-medium text-sm">
                  Rp {(item.price * item.qty).toLocaleString("id-ID")}
                </span>
              </div>

              <input
                placeholder="Catatan (opsional)"
                value={item.notes}
                onChange={(e) => updateNotes(item.productId, e.target.value)}
                className="w-full mt-2 px-2 py-1 text-xs rounded border border-[var(--color-border)]
                  bg-[var(--color-surface)] focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          ))
        )}

        {cart.length > 0 && (
          <input
            placeholder="Nama pelanggan (opsional)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-background)] text-sm
              focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        )}
      </div>

      {cart.length > 0 && (
        <div className="p-4 border-t border-[var(--color-border)] space-y-2">
          <div className="flex justify-between text-sm text-[var(--color-muted)]">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-sm text-[var(--color-muted)]">
            <span>Pajak (11%)</span>
            <span>Rp {tax.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-[var(--color-border)]">
            <span>Total</span>
            <span className="text-brand-600 dark:text-brand-400">
              Rp {total.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3">
            <button
              onClick={() => onSubmit("CASH")}
              disabled={submitting}
              className="py-2.5 rounded-lg bg-gradient-to-r from-brand-600 to-brand-700
                hover:from-brand-700 hover:to-brand-800 text-white font-medium text-sm
                disabled:opacity-60 transition-all"
            >
              Bayar Tunai
            </button>
            <button
              onClick={() => onSubmit("QRIS")}
              disabled={submitting}
              className="py-2.5 rounded-lg border-2 border-brand-600 text-brand-600
                dark:text-brand-400 dark:border-brand-400
                hover:bg-brand-50 dark:hover:bg-brand-900/30 font-medium text-sm
                disabled:opacity-60 transition-all"
            >
              Bayar QRIS
            </button>
          </div>
        </div>
      )}
    </>
  );
}