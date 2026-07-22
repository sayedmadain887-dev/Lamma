import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getOrderStatusConfig, ORDER_STATUS } from '../utils/orderStatus';

const OrdersContext = createContext(null);

export const SHIPPING_FEE = 50;

// Placeholder data so the UI has something to show before a real
// backend exists. Shape matches what /api/users/me/orders should
// return once it's built. addressId links back to AddressesContext.
// userId links back to UsersContext (used by the Admin Users page to
// count orders per user).
const MOCK_ORDERS = [
  {
    id: 'order-1',
    orderNumber: '#10234',
    createdAt: '2026-07-18T10:30:00.000Z',
    status: ORDER_STATUS.PROCESSING,
    addressId: 'addr-1',
    userId: 'user-1',
    items: [
      { id: 'item-1', name: 'قميص قطن كلاسيك', quantity: 2, price: 450 },
      { id: 'item-2', name: 'بنطلون جينز', quantity: 1, price: 620 },
    ],
  },
  {
    id: 'order-2',
    orderNumber: '#10198',
    createdAt: '2026-07-10T15:12:00.000Z',
    status: ORDER_STATUS.SHIPPED,
    addressId: 'addr-2',
    userId: 'user-2',
    items: [{ id: 'item-3', name: 'حذاء رياضي', quantity: 1, price: 980 }],
  },
  {
    id: 'order-3',
    orderNumber: '#09876',
    createdAt: '2026-06-02T09:00:00.000Z',
    status: ORDER_STATUS.DELIVERED,
    addressId: 'addr-1',
    userId: 'user-1',
    items: [
      { id: 'item-4', name: 'جاكيت شتوي', quantity: 1, price: 1250 },
      { id: 'item-5', name: 'قبعة صوف', quantity: 1, price: 180 },
    ],
  },
  {
    id: 'order-4',
    orderNumber: '#09650',
    createdAt: '2026-05-20T18:45:00.000Z',
    status: ORDER_STATUS.CANCELLED,
    addressId: 'addr-2',
    userId: 'user-3',
    items: [{ id: 'item-6', name: 'حقيبة ظهر', quantity: 1, price: 540 }],
  },
];

function getOrderTotal(order) {
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function createOrderId() {
  return `order-${Date.now()}`;
}

function createOrderNumber() {
  return `#${Math.floor(10000 + Math.random() * 89999)}`;
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: replace with a real API call, e.g. GET /api/users/me/orders
    const loadOrders = async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const sorted = [...MOCK_ORDERS].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sorted);
      setIsLoading(false);
    };
    loadOrders();
  }, []);

  // Creates a new order after checkout (Cash on Delivery only, for now).
  // `items` should already be in { id, name, quantity, price } shape.
  const addOrder = useCallback(({ addressId, items, customerInfo, paymentMethod }) => {
    // TODO: replace with a real API call, e.g. POST /api/orders
    const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder = {
      id: createOrderId(),
      orderNumber: createOrderNumber(),
      createdAt: new Date().toISOString(),
      status: ORDER_STATUS.PENDING,
      addressId,
      items,
      customerInfo,
      paymentMethod,
      shippingFee: SHIPPING_FEE,
      total: itemsTotal + SHIPPING_FEE,
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, []);

  // Used by the Admin Orders page to move an order through the
  // Pending -> Processing -> Shipped -> Delivered pipeline (or Cancelled).
  const updateOrderStatus = useCallback((orderId, newStatus) => {
    // TODO: replace with a real API call, e.g. PATCH /api/orders/:id/status
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
  }, []);

  const currentOrders = useMemo(
    () => orders.filter((order) => getOrderStatusConfig(order.status).bucket === 'current'),
    [orders]
  );

  const pastOrders = useMemo(
    () => orders.filter((order) => getOrderStatusConfig(order.status).bucket === 'past'),
    [orders]
  );

  const value = useMemo(
    () => ({
      orders,
      currentOrders,
      pastOrders,
      isLoading,
      getOrderTotal,
      addOrder,
      updateOrderStatus,
    }),
    [orders, currentOrders, pastOrders, isLoading, addOrder, updateOrderStatus]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used inside an <OrdersProvider>');
  }
  return context;
}