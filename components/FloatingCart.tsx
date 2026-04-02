"use client";

import Link from "next/link";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { usePathname } from "next/navigation";

export default function FloatingCart() {
  const { count, total } = useCart();
  const pathname = usePathname();

  // Don't show on order page or kitchen page
  if (count === 0 || pathname === "/order" || pathname === "/kitchen") return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
      <Link
        href="/order"
        className="flex items-center justify-between w-full bg-brand-gold text-brand-black px-5 py-4 shadow-2xl hover:bg-brand-gold-light transition-all duration-200 active:scale-95"
        style={{ boxShadow: "0 8px 40px rgba(212,160,23,0.5)" }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-black text-brand-gold text-[9px] font-black flex items-center justify-center rounded-full">
              {count}
            </span>
          </div>
          <div>
            <p className="font-black text-sm leading-none">View Order</p>
            <p className="text-brand-black/60 text-[11px] mt-0.5">{count} item{count !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-black text-lg">₹{total.toFixed(0)}</span>
          <ChevronRight className="w-5 h-5" />
        </div>
      </Link>
    </div>
  );
}
