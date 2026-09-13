"use client";

import { useState, useTransition } from "react";
import { ChefHat, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { updateOrderStatus } from "./actions";

type OrderCardProps = {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    customerName: string | null;
    createdAt: Date;
    orderType: string;
    table: { name: string } | null;
    items: {
      id: string;
      qty: number;
      notes: string | null;
      product: { name: string };
    }[];
  };
};

export function OrderCard({ order }: OrderCardProps) {
  const [isPending, startTransition] = useTransition();

  const timeAgo = (date: Date) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (diff < 1) return "baru saja";
    return `${diff} menit lalu`;
  };

  function handleUpdate(status: "DIMASAK" | "SELESAI") {
    startTransition(() => {
      updateOrderStatus(order.id, status);
    });
  }

  const isCooking = order.status === "DIMASAK";

  return (
    <div
      className={`bg-[var(--color-surface)] rounded-2xl border-2 overflow-hidden ${
        isCooking
          ? "border-orange-400 dark:border-orange-600"
          : "border-[var(--color-border)]"
      }`}
    >
      {/* Header */}
      <div
        className={`p-3 border-b border-[var(--color-border)] flex justify-between items-start gap-2 ${
          isCooking
            ? "bg-orange-50 dark:bg-orange-950/30"
            : "bg-yellow-50 dark:bg-yellow-950/20"
        }`}
      >
        <div className="min-w-0">
          <h3 className="font-heading font-bold">{order.orderNumber}</h3>
          <p className="text-xs text-[var(--color-muted)] mt-0.5 flex items-center gap-1">
            <Clock size={11} /> {timeAgo(order.createdAt)}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="inline-block px-2 py-0.5 rounded-md bg-[var(--color-surface)] text-xs font-medium">
            {order.orderType === "DINE_IN"
              ? order.table?.name || "Dine In"
              : "Takeaway"}
          </span>
          {order.customerName && (
            <p className="text-xs text-[var(--color-muted)] mt-1 truncate max-w-[120px]">
              {order.customerName}
            </p>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="p-3 space-y-2">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 text-sm border-b border-[var(--color-border)] last:border-0 pb-2 last:pb-0"
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-bold flex-shrink-0">
              {item.qty}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{item.product.name}</p>
              {item.notes && (
                <p className="text-xs text-brand-600 dark:text-brand-400 mt-0.5 italic">
                  📝 {item.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action */}
      <div className="p-3 border-t border-[var(--color-border)]">
        {order.status === "PAID" && (
          <button
            onClick={() => handleUpdate("DIMASAK")}
            disabled={isPending}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600
              hover:from-orange-600 hover:to-orange-700 text-white font-medium text-sm
              flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ChefHat size={16} />
            )}
            Mulai Masak
          </button>
        )}

        {order.status === "DIMASAK" && (
          <button
            onClick={() => handleUpdate("SELESAI")}
            disabled={isPending}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600
              hover:from-green-600 hover:to-green-700 text-white font-medium text-sm
              flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCircle2 size={16} />
            )}
            Selesai
          </button>
        )}
      </div>
    </div>
  );
}