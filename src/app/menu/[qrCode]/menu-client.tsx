"use client";

import { useState } from "react";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  X,
  Search,
  Coffee,
  Loader2,
} from "lucide-react";
import { createQrOrder } from "./actions";
import { QrisPayment } from "./qris-payment";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  categoryId: string;
  category: { id: string; name: string };
};

type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  notes: string;
};

export function MenuClient({
  table,
  products,
  categories,
}: {
  table: { id: string; name: string };
  products: Product[];
  categories: { id: string; name: string }[];
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [qrData, setQrData] = useState<{
    orderNumber: string;
    orderId: string;
    qrUrl: string | null;
    qrString: string | null;
    total: number;
  } | null>(null);

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

  async function handleSubmit() {
    if (cart.length === 0) return;
    setSubmitting(true);

    try {
      const result = await createQrOrder({
        tableId: table.id,
        customerName: customerName || null,
        items: cart,
      });
      setQrData(result);
      setCart([]);
      setCartOpen(false);
    } catch (e: any) {
      alert(e.message || "Gagal membuat QRIS");
    } finally {
      setSubmitting(false);
    }
  }

  // QRIS Payment screen
  if (qrData) {
    return <QrisPayment data={qrData} onClose={() => setQrData(null)} />;
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-gradient-to-r from-brand-600 to-brand-700 text-white">
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Coffee size={20} />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg leading-tight">
              Kasir Kafe
            </h1>
            <p className="text-xs text-white/80">{table.name}</p>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
          />
          <input
            placeholder="Cari menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--color-border)]
              bg-[var(--color-surface)] text-[var(--color-foreground)]
              focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Kategori */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-3">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
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
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeCategory === c.id
                ? "bg-brand-600 text-white"
                : "bg-[var(--color-surface)] border border-[var(--color-border)]"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Grid Produk */}
      <div className="px-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-muted)] text-sm">
            Tidak ada menu
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]
                  p-3 text-left hover:border-brand-500 hover:shadow-md transition-all"
              >
                <div className="aspect-square rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-800 dark:to-brand-900 mb-2 flex items-center justify-center overflow-hidden">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">☕</span>
                  )}
                </div>
                <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem]">
                  {p.name}
                </h3>
                <p className="text-brand-600 dark:text-brand-400 font-bold text-sm mt-1">
                  Rp {p.price.toLocaleString("id-ID")}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-4 left-4 right-4 z-30
            bg-gradient-to-r from-brand-600 to-brand-700 text-white
            px-5 py-3.5 rounded-2xl shadow-2xl flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-white text-brand-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            </div>
            <span className="font-medium">Lihat Keranjang</span>
          </div>
          <span className="font-bold">Rp {total.toLocaleString("id-ID")}</span>
        </button>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setCartOpen(false)}
          />
          <div className="relative w-full sm:max-w-md bg-[var(--color-surface)] rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center">
              <h2 className="font-heading font-bold text-lg">
                Keranjang ({cart.length})
              </h2>
              <button onClick={() => setCartOpen(false)} className="p-1">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="bg-[var(--color-background)] rounded-xl p-3 border border-[var(--color-border)]"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-xs text-[var(--color-muted)] mt-0.5">
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-500 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.productId, -1)}
                        className="w-8 h-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.productId, 1)}
                        className="w-8 h-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center"
                      >
                        <Plus size={14} />
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
                    className="w-full mt-2 px-2 py-1.5 text-xs rounded border border-[var(--color-border)]
                      bg-[var(--color-surface)] focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              ))}

              <input
                placeholder="Nama kamu (opsional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)]
                  bg-[var(--color-background)] text-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

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

              <button
                onClick={handleSubmit}
                disabled={submitting || cart.length === 0}
                className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700
                  hover:from-brand-700 hover:to-brand-800 text-white font-medium
                  disabled:opacity-60 flex items-center justify-center gap-2 transition-all"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Membuat QRIS...
                  </>
                ) : (
                  "Bayar & Pesan"
                )}
              </button>

              <p className="text-xs text-center text-[var(--color-muted)]">
                Bayar via QRIS, pesanan langsung masuk dapur
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}