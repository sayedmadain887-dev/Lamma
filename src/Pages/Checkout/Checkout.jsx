import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../Context/CartContext';
import { useAddresses } from '../../Context/Addresses';
import { useOrders, SHIPPING_FEE } from '../../Context/Orders';
import { useAuth } from '../../Context/AuthContext';
import { useToast } from '../../Context/ToastContext';
import { isValidEmail, isValidEgyptianPhone } from '../../utils/Validators';
import AddressOption from '../../Components/Checkout/AddressOption';
import AddressForm from '../../Components/Profile/AddressesSection/AddressForm';
import styles from './Checkout.module.css';

function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { addresses, isLoading: addressesLoading, addAddress } = useAddresses();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });
  const [customerErrors, setCustomerErrors] = useState({});

  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || null
  );
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const total = subtotal + SHIPPING_FEE;

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <p>Your cart is empty. Add items before checking out.</p>
          <Link to="/products" className={styles.browseButton}>Browse Products</Link>
        </div>
      </div>
    );
  }

  const handleCustomerFieldChange = (field) => (event) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validateCustomerInfo = () => {
    const errors = {};
    if (!customerInfo.name.trim()) errors.name = 'Name is required';
    if (!isValidEgyptianPhone(customerInfo.phone)) errors.phone = 'Enter a valid Egyptian phone number';
    if (!isValidEmail(customerInfo.email)) errors.email = 'Enter a valid email';
    setCustomerErrors(errors);
    return Object.keys(errors).length === 0;
  };

 const handleAddNewAddress = async (values) => {
  const newAddressId = addAddress(values);
  setSelectedAddressId(newAddressId);
  setIsAddingAddress(false);
  showSuccess('Address added');
};

  const handlePlaceOrder = async () => {
    if (!validateCustomerInfo()) return;
    if (!selectedAddressId) {
      showError('Please select a shipping address');
      return;
    }

    setIsPlacingOrder(true);
    // TODO: replace with a real API call, e.g. POST /api/orders
    await new Promise((resolve) => setTimeout(resolve, 800));

    addOrder({
      addressId: selectedAddressId,
      items: items.map((item) => ({
        id: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      customerInfo,
      paymentMethod: 'cash_on_delivery',
    });

    clearCart();
    setIsPlacingOrder(false);
    showSuccess('Order placed successfully');
    navigate('/profile');
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Checkout</h1>

        <div className={styles.layout}>
          <div className={styles.mainColumn}>
            {/* Customer Info */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Customer Information</h2>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Full Name</label>
                  <input
                    className={styles.input}
                    value={customerInfo.name}
                    onChange={handleCustomerFieldChange('name')}
                  />
                  {customerErrors.name && <span className={styles.fieldError}>{customerErrors.name}</span>}
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Phone Number</label>
                  <input
                    type="tel"
                    className={styles.input}
                    value={customerInfo.phone}
                    onChange={handleCustomerFieldChange('phone')}
                    placeholder="01xxxxxxxxx"
                  />
                  {customerErrors.phone && <span className={styles.fieldError}>{customerErrors.phone}</span>}
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Email Address</label>
                <input
                  type="email"
                  className={styles.input}
                  value={customerInfo.email}
                  onChange={handleCustomerFieldChange('email')}
                />
                {customerErrors.email && <span className={styles.fieldError}>{customerErrors.email}</span>}
              </div>
            </section>

            {/* Shipping Address */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Shipping Address</h2>
                {!isAddingAddress && (
                  <button type="button" className={styles.addAddressLink} onClick={() => setIsAddingAddress(true)}>
                    + Add New Address
                  </button>
                )}
              </div>

              {isAddingAddress && (
                <AddressForm onSubmit={handleAddNewAddress} onCancel={() => setIsAddingAddress(false)} />
              )}

              {addressesLoading ? (
                <p className={styles.emptyState}>Loading addresses...</p>
              ) : addresses.length === 0 && !isAddingAddress ? (
                <p className={styles.emptyState}>No saved addresses yet — add one above.</p>
              ) : (
                <div className={styles.addressList}>
                  {addresses.map((address) => (
                    <AddressOption
                      key={address.id}
                      address={address}
                      isSelected={selectedAddressId === address.id}
                      onSelect={setSelectedAddressId}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Payment Method */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Payment Method</h2>
              <label className={styles.paymentOption}>
                <input type="radio" name="payment-method" checked readOnly />
                <span>Cash on Delivery</span>
              </label>
              <p className={styles.paymentNote}>More payment methods will be added soon.</p>
            </section>
          </div>

          {/* Order Summary */}
          <aside className={styles.summaryColumn}>
            <div className={styles.summaryCard}>
              <h2 className={styles.sectionTitle}>Order Summary</h2>

              <div className={styles.itemsList}>
                {items.map((item) => (
                  <div key={item.productId} className={styles.summaryItem}>
                    <span className={styles.itemName}>{item.name} ×{item.quantity}</span>
                    <span className={styles.itemPrice}>{item.price * item.quantity} EGP</span>
                  </div>
                ))}
              </div>

              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{subtotal} EGP</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{SHIPPING_FEE} EGP</span>
              </div>
              <div className={styles.summaryTotalRow}>
                <span>Total</span>
                <span>{total} EGP</span>
              </div>

              <button
                type="button"
                className={styles.placeOrderButton}
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || !selectedAddressId}
              >
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Checkout;