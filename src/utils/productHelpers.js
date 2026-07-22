// Central place for stock and discount logic, shared between the
// customer-facing pages and the Admin panel, so both always agree on
// what counts as "low stock" or how a discounted price is calculated.

export const LOW_STOCK_THRESHOLD = 5;

export function getStockStatus(quantity) {
  if (quantity <= 0) return 'out';
  if (quantity <= LOW_STOCK_THRESHOLD) return 'low';
  return 'in';
}

// Customer-facing label: never reveals the exact number, just a warning.
export function getStockBadgeLabel(quantity) {
  const status = getStockStatus(quantity);
  if (status === 'out') return 'Out of Stock';
  if (status === 'low') return 'Only a Few Left';
  return null; // no badge needed when stock is healthy
}

export function getDisplayPrice(product) {
  const discountPercent = product.discountPercent || 0;
  if (discountPercent <= 0) {
    return { hasDiscount: false, original: product.price, final: product.price };
  }
  const final = Math.round(product.price * (1 - discountPercent / 100));
  return { hasDiscount: true, original: product.price, final, discountPercent };
}