import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import staticProducts from '../data/products';

const ProductsContext = createContext(null);

const DISCOUNT_OPTIONS = [0, 10, 20, 30, 40, 50];

function createProductId() {
  return `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: replace with a real API call, e.g. GET /api/products
    // Seeds from the existing static file, adding the two new admin-managed
    // fields (quantity, discountPercent) that weren't there before.
    const loadProducts = async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const seeded = staticProducts.map((product) => ({
        ...product,
        quantity: product.inStock ? 20 : 0,
        discountPercent: 0,
      }));
      setProducts(seeded);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  const addProduct = useCallback((productData) => {
    // TODO: replace with a real API call, e.g. POST /api/products
    const newProduct = {
      ...productData,
      id: createProductId(),
      dateAdded: new Date().toISOString().slice(0, 10),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct.id;
  }, []);

  const updateProduct = useCallback((productId, productData) => {
    // TODO: replace with a real API call, e.g. PATCH /api/products/:id
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, ...productData, id: productId } : product
      )
    );
  }, []);

  const deleteProduct = useCallback((productId) => {
    // TODO: replace with a real API call, e.g. DELETE /api/products/:id
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  }, []);

  const getProductById = useCallback(
    (productId) => products.find((product) => product.id === productId) || null,
    [products]
  );

  const lowStockProducts = useMemo(
    () => products.filter((product) => product.quantity > 0 && product.quantity <= 5),
    [products]
  );

  const outOfStockProducts = useMemo(
    () => products.filter((product) => product.quantity <= 0),
    [products]
  );

  const value = useMemo(
    () => ({
      products,
      isLoading,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById,
      lowStockProducts,
      outOfStockProducts,
      discountOptions: DISCOUNT_OPTIONS,
    }),
    [products, isLoading, addProduct, updateProduct, deleteProduct, getProductById, lowStockProducts, outOfStockProducts]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used inside a <ProductsProvider>');
  }
  return context;
}