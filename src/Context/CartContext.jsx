import { createContext, useContext, useState, useMemo, useCallback } from 'react';

// Why Context here: many components (Navbar, ProductCard, Cart page) need
// to read or update the cart. Keeping ONE source of truth avoids each
// component holding its own out-of-sync copy of the cart state.
const CartContext = createContext(null);

export function CartProvider({ children }) {
  // Each item: { productId, name, price, quantity, image }
  const [items, setItems] = useState([]);

  const addItem = useCallback((product, quantity = 1) => {
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.productId === product.id);

      if (existing) {
        // Product already in cart: bump quantity instead of duplicating the row
        return prevItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prevItems,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Derived values recomputed only when items change (not on every render)
  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  // Memoize the context value itself so consumers that only need e.g.
  // itemCount don't re-render unnecessarily when unrelated state changes.
  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook: components call useCart() instead of useContext(CartContext) directly.
// Throws a clear error if used outside the provider, instead of failing silently.
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside a <CartProvider>');
  }
  return context;
}