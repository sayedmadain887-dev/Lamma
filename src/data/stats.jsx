// Static placeholder stats for now.
// Later, these values can come from:
// GET /api/stats
// Example response:
// [
//   { id: 'products', value: '1200+', label: 'Products Available' },
//   { id: 'orders', value: '25K+', label: 'Orders Delivered' },
//   { id: 'customers', value: '15K+', label: 'Happy Customers' },
//   { id: 'rating', value: '4.9/5', label: 'Customer Rating' },
// ]

const stats = [
  {
    id: 'products',
    value: '1200+',
    label: 'Products Available',
  },
  {
    id: 'orders',
    value: '25K+',
    label: 'Orders Delivered',
  },
  {
    id: 'customers',
    value: '15K+',
    label: 'Happy Customers',
  },
  {
    id: 'rating',
    value: '4.9/5',
    label: 'Customer Rating',
  },
];

export default stats;