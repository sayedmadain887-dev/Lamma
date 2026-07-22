import f1 from '../assets/products/f1.jpg';
import f2 from '../assets/products/f2.jpg';
import f3 from '../assets/products/f3.jpg';
import f4 from '../assets/products/f4.jpg';
import f5 from '../assets/products/f5.jpg';
import f6 from '../assets/products/f6.jpg';

// Static placeholder products for now.
// Later, this will come from something like GET /api/products, which
// should return items in this exact shape:
// [{ id, name, price, rating, image, badge, inStock, category, dateAdded }, ...]
// `badge` is one of: 'new', 'sale', or null.
// `category` matches a slug from src/data/categories.jsx.
// `dateAdded` (ISO string) powers the "Newest" sort option.

const products = [
  {
    id: 'p1',
    name: 'Classic Tee',
    price: 249,
    rating: 4.5,
    image: f1,
    badge: 'new',
    inStock: true,
    category: 'fashion',
    dateAdded: '2026-07-10',
  },
  {
    id: 'p2',
    name: 'Urban Fit Shirt',
    price: 299,
    rating: 4.2,
    image: f2,
    badge: 'sale',
    inStock: true,
    category: 'fashion',
    dateAdded: '2026-06-02',
  },
  {
    id: 'p3',
    name: 'Essential Crew',
    price: 279,
    rating: 4.8,
    image: f3,
    badge: null,
    inStock: true,
    category: 'fashion',
    dateAdded: '2026-05-20',
  },
  {
    id: 'p4',
    name: 'Relaxed Hoodie',
    price: 449,
    rating: 4.0,
    image: f4,
    badge: null,
    inStock: false,
    category: 'fashion',
    dateAdded: '2026-07-01',
  },
  {
    id: 'p5',
    name: 'Summer Shirt',
    price: 329,
    rating: 3.9,
    image: f5,
    badge: 'sale',
    inStock: true,
    category: 'fashion',
    dateAdded: '2026-04-15',
  },
  {
    id: 'p6',
    name: 'Everyday Polo',
    price: 259,
    rating: 4.6,
    image: f6,
    badge: 'new',
    inStock: true,
    category: 'fashion',
    dateAdded: '2026-07-15',
  },
];

export default products;