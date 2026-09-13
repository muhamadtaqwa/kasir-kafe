"use client";

import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function PrintButton() {
  return (
    <div className="flex gap-2">
      <Link
        href="/dashboard/kasir"
        className="flex-1 py-2.5 rounded-lg border border-gray-300 text-center text-sm hover:bg-gray-50"
      >
        <ArrowLeft size={14} className="inline mr-1" />
        Kembali
      </Link>
      <button
        onClick={() => window.print()}
        className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-brand-600 to-brand-700
          hover:from-brand-700 hover:to-brand-800 text-white text-sm font-medium
          flex items-center justify-center gap-2"
      >
        <Printer size={14} />
        Cetak Struk
      </button>
    </div>
  );
}