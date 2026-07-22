import f1 from '../assets/products/f1.jpg';
import f2 from '../assets/products/f2.jpg';
import f3 from '../assets/products/f3.jpg';
import f4 from '../assets/products/f4.jpg';
import f5 from '../assets/products/f5.jpg';
import f6 from '../assets/products/f6.jpg';
import n1 from '../assets/products/n1.jpg';
import n2 from '../assets/products/n2.jpg';
import n3 from '../assets/products/n3.jpg';
import n4 from '../assets/products/n4.jpg';
import n5 from '../assets/products/n5.jpg';
import n6 from '../assets/products/n6.jpg';

// Extra data used only on the Product Details page, keyed by product id.
// Kept separate from src/data/products.jsx (which powers the grid/cards)
// so the lighter list data doesn't have to carry this heavier detail
// payload around everywhere it's used.
//
// Later, this whole file is replaced by a call like
// GET /api/products/:id, which should return the same shape:
// { description, colors: [{ name, hex, images: [...] }], sizes: [...], reviews: [...] }

const productDetails = {
  p1: {
    description:
      'A soft, breathable everyday tee made from combed cotton. Relaxed fit, reinforced stitching, and a fabric that holds its shape wash after wash.',
    colors: [
      { name: 'White', hex: '#F4F1EC', images: [f1, n1] },
      { name: 'Black', hex: '#1C1C1E', images: [n2, f1] },
      { name: 'Blue', hex: '#2E5C8A', images: [n3, f1] },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    reviews: [
      { id: 'r1', author: 'Mona K.', rating: 5, comment: 'Great fit and quality!', date: '2026-06-20' },
      { id: 'r2', author: 'Ahmed S.', rating: 4, comment: 'Comfortable, runs slightly large.', date: '2026-06-28' },
    ],
  },
  p2: {
    description:
      'A tailored shirt built for the city - clean lines, a modern silhouette, and fabric that breathes through a long day.',
    colors: [
      { name: 'White', hex: '#F4F1EC', images: [f2, n4] },
      { name: 'Red', hex: '#A13D2E', images: [n5, f2] },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    reviews: [
      { id: 'r1', author: 'Sara M.', rating: 4, comment: 'Nice material, true to size.', date: '2026-06-10' },
    ],
  },
  p3: {
    description:
      'The essential crew neck - a wardrobe staple designed to pair with anything, in a fabric weight that works across seasons.',
    colors: [
      { name: 'White', hex: '#F4F1EC', images: [f3, n6] },
      { name: 'Black', hex: '#1C1C1E', images: [n1, f3] },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    reviews: [
      { id: 'r1', author: 'Youssef T.', rating: 5, comment: 'Best basic tee I own.', date: '2026-05-30' },
      { id: 'r2', author: 'Nour A.', rating: 5, comment: 'Perfect weight, not too thin.', date: '2026-06-05' },
    ],
  },
  p4: {
    description:
      'A relaxed, heavyweight hoodie for cooler days - brushed interior, kangaroo pocket, ribbed cuffs.',
    colors: [
      { name: 'Black', hex: '#1C1C1E', images: [f4, n2] },
      { name: 'Blue', hex: '#2E5C8A', images: [n3, f4] },
    ],
    sizes: ['M', 'L', 'XL'],
    reviews: [],
  },
  p5: {
    description:
      'Lightweight and airy, cut for warm weather - a breathable weave that keeps its shape without clinging.',
    colors: [
      { name: 'White', hex: '#F4F1EC', images: [f5, n4] },
      { name: 'Red', hex: '#A13D2E', images: [n5, f5] },
    ],
    sizes: ['S', 'M', 'L'],
    reviews: [
      { id: 'r1', author: 'Laila H.', rating: 3, comment: 'Good for summer, a bit thin.', date: '2026-04-22' },
    ],
  },
  p6: {
    description:
      'A refined polo for everyday wear - structured collar, breathable knit, and a fit that works from desk to dinner.',
    colors: [
      { name: 'White', hex: '#F4F1EC', images: [f6, n6] },
      { name: 'Black', hex: '#1C1C1E', images: [n1, f6] },
      { name: 'Blue', hex: '#2E5C8A', images: [n3, f6] },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    reviews: [
      { id: 'r1', author: 'Omar F.', rating: 5, comment: 'Looks more expensive than it is.', date: '2026-07-02' },
    ],
  },
};

export default productDetails;