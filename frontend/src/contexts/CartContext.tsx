'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, Cart, CartItem } from '@/lib/api';

interface CartContextType {
  cart: Cart | null;
  cartItemCount: number;
  isLoading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Demo user ID - in production, get from auth context
  const userId = 'demo-user-1';

  const refreshCart = async () => {
    try {
      setIsLoading(true);
      const response = await api.getCart(userId);
      if (response.success) {
        setCart(response.cart);
        setCartItemCount(response.cart.summary.itemCount);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      setIsLoading(true);
      const response = await api.addToCart(userId, productId, quantity);
      if (response.success) {
        setCartItemCount(response.cartItemCount);
        await refreshCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      setIsLoading(true);
      const response = await api.updateCartItem(userId, itemId, quantity);
      if (response.success) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      setIsLoading(true);
      const response = await api.removeFromCart(userId, itemId);
      if (response.success) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      const response = await api.clearCart(userId);
      if (response.success) {
        setCart({ items: [], summary: { subtotal: 0, shipping: 0, tax: 0, total: 0, itemCount: 0 } });
        setCartItemCount(0);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{
      cart,
      cartItemCount,
      isLoading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
