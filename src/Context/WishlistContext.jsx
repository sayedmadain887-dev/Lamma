import { createContext, useContext, useState, useMemo, useCallback } from 'react';

const WishlistContext = createContext(null);

// Why this needs to be a context (not local state per card): the same
// product can appear in multiple places at once - the Home page, the
// Products grid, Related Products, and its own Details page. Without a
// shared source of truth, favoriting it in one place wouldn't reflect in
// another, and the Wishlist page would have nothing to read from at all.
export function WishlistProvider({ children }) {
  // Each entry is the full product object at the time it was added, so the
  // Wishlist page can render it without needing to re-fetch anything.
  const [items, setItems] = useState([]);

  const isInWishlist = useCallback(
    (productId) => items.some((item) => item.id === productId),
    [items]
  );

  const addItem = useCallback((product) => {
    setItems((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const toggleItem = useCallback(
    (product) => {
      if (isInWishlist(product.id)) {
        removeItem(product.id);
        return false; // now removed
      }
      addItem(product);
      return true; // now added
    },
    [isInWishlist, addItem, removeItem]
  );

  const itemCount = useMemo(() => items.length, [items]);

  const value = useMemo(
    () => ({ items, itemCount, isInWishlist, addItem, removeItem, toggleItem }),
    [items, itemCount, isInWishlist, addItem, removeItem, toggleItem]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used inside a <WishlistProvider>');
  }
  return context;
}