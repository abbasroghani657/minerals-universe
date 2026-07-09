'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  img: string;
}

interface CartContextType {
  cartItems: CartItem[];
  wishlist: Set<number>;
  toast: string | null;
  isCartOpen: boolean;
  cartCount: number; // derived from cartItems
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: number) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  wishlist: new Set(),
  toast: null,
  isCartOpen: false,
  cartCount: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  toggleWishlist: () => {},
  openCart: () => {},
  closeCart: () => {},
});

const defaultCartItems: CartItem[] = [
  {
    id: 1,
    name: 'Natural Aquamarine Emerald Cut — 4.8 Cts',
    price: 385,
    quantity: 1,
    img: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80'
  },
  {
    id: 3,
    name: 'Pink Tourmaline Cushion Cut — 6.1 Cts',
    price: 740,
    quantity: 2,
    img: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=400&q=80'
  }
];

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(defaultCartItems);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Rehydrate on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('minerals_universe_cart');
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        if (parsed && parsed.length > 0) {
          setCartItems(parsed);
        }
      }
      
      const storedWishlist = localStorage.getItem('minerals_universe_wishlist');
      if (storedWishlist) {
        setWishlist(new Set(JSON.parse(storedWishlist)));
      }
    } catch (e) {
      console.error('Failed to load cart/wishlist from localStorage', e);
    }
    setIsHydrated(true);
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('minerals_universe_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isHydrated]);

  // Sync wishlist to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('minerals_universe_wishlist', JSON.stringify(Array.from(wishlist)));
    }
  }, [wishlist, isHydrated]);

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const qtyToAdd = item.quantity || 1;
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + qtyToAdd } : i);
      }
      return [...prev, { ...item, quantity: qtyToAdd }];
    });
    setToast(`"${item.name}" added to cart!`);
    setTimeout(() => setToast(null), 2500);
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleWishlist = (id: number) => {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setToast('Removed from wishlist');
      } else {
        next.add(id);
        setToast('Added to wishlist ♥');
      }
      setTimeout(() => setToast(null), 2000);
      return next;
    });
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, wishlist, toast, isCartOpen, cartCount,
      addToCart, removeFromCart, updateQuantity, clearCart, toggleWishlist, openCart, closeCart
    }}>
      {children}
      {/* Global Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '100px', right: '28px', zIndex: 1000,
          background: 'var(--teal-dark)', color: '#fff', padding: '12px 20px',
          borderRadius: '8px', fontSize: '13px', fontFamily: "'Poppins', sans-serif",
          fontWeight: 500, boxShadow: '0 6px 24px rgba(15,92,83,.35)',
          animation: 'fadeInUp 0.3s ease',
          display: 'flex', alignItems: 'center', gap: '8px',
          maxWidth: '280px',
        }}>
          ✦ {toast}
        </div>
      )}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
