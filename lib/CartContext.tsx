"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { MenuItem } from "@/lib/database.types";

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, qty: number) => void;
  updateNotes: (itemId: number, notes: string) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "amva_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Save cart to localStorage on every change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart, hydrated]);

  const addToCart = useCallback((item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { item, quantity: 1, notes: "" }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: number) => {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: number, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((c) => c.item.id !== itemId));
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.item.id === itemId ? { ...c, quantity: qty } : c))
    );
  }, []);

  const updateNotes = useCallback((itemId: number, notes: string) => {
    setCart((prev) =>
      prev.map((c) => (c.item.id === itemId ? { ...c, notes } : c))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const total = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const count = cart.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, updateNotes, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
