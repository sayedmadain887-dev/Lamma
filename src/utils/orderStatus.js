// Central place for everything related to an order's status:
// label, color, and which "bucket" (current vs past) it belongs to.
// Add a new status here once and every component that renders a
// status badge or groups orders will pick it up automatically.
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_CONFIG = {
  [ORDER_STATUS.PENDING]: { label: 'قيد الانتظار', color: '#C9924A', bucket: 'current' },
  [ORDER_STATUS.PROCESSING]: { label: 'قيد التجهيز', color: '#2E5C8A', bucket: 'current' },
  [ORDER_STATUS.SHIPPED]: { label: 'تم الشحن', color: '#6A3D7A', bucket: 'current' },
  [ORDER_STATUS.DELIVERED]: { label: 'تم التوصيل', color: '#2E7D4F', bucket: 'past' },
  [ORDER_STATUS.CANCELLED]: { label: 'ملغي', color: '#A13D2E', bucket: 'past' },
};

export function getOrderStatusConfig(status) {
  return ORDER_STATUS_CONFIG[status] || { label: status, color: '#6B6B6B', bucket: 'current' };
}