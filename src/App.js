import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './Context/CartContext';
import { AuthProvider } from './Context/AuthContext';
import { ToastProvider } from './Context/ToastContext';
import { WishlistProvider } from './Context/WishlistContext';
import { SettingsProvider } from './Context/settings';
import { AddressesProvider } from './Context/Addresses';
import { OrdersProvider } from './Context/Orders';
import { ProductsProvider } from './Context/ProductsContext';
import { UsersProvider } from './Context/UsersContext';
import Navbar from './Components/Navbar/Navbar';
import ToastContainer from './Components/Toast/ToastContainer';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import Products from './Pages/Products/Products';
import ProductDetails from './Pages/ProductDetails/ProductDetails';
import Profile from './Pages/Profile/Profile';
import Cart from './Pages/Cart/Cart';
import Wishlist from './Pages/Wishlist/Wishlist';
import Checkout from './Pages/Checkout/Checkout';
import AdminLayout from './Pages/Admin/AdminLayout';
import AdminDashboard from './Pages/Admin/Dashboard/AdminDashboard';
import AdminProducts from './Pages/Admin/Products/AdminProducts';
import AdminOrders from './Pages/Admin/Orders/AdminOrders';
import AdminUser from './Pages/Admin/Users/AdminUser';
import './Styles/variables.css';

// Pages where the main site Navbar should NOT show (auth pages get their
// own full-screen layout instead, and Admin pages get the Admin sidebar).
const NAVBAR_HIDDEN_PATHS = ['/login', '/register', '/forgot-password'];

// Needs to live INSIDE <BrowserRouter> because useLocation() only works
// within the router's context - that's why this is split out from App.
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const shouldShowNavbar = !NAVBAR_HIDDEN_PATHS.includes(location.pathname) && !isAdminRoute;

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Admin panel - AdminLayout itself guards access (isAdmin check) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUser />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        {/* Addresses/Orders live above CartProvider so a future checkout
            flow can read saved addresses and past orders too, not just Profile. */}
        <AddressesProvider>
          <OrdersProvider>
            <ProductsProvider>
              <UsersProvider>
                <CartProvider>
                  <WishlistProvider>
                    <ToastProvider>
                      <BrowserRouter>
                        <AppContent />
                      </BrowserRouter>
                    </ToastProvider>
                  </WishlistProvider>
                </CartProvider>
              </UsersProvider>
            </ProductsProvider>
          </OrdersProvider>
        </AddressesProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;