import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const AddressesContext = createContext(null);

// Placeholder data so the UI has something to show before a real
// backend exists. Shape matches what /api/users/me/addresses should
// return once it's built.
const MOCK_ADDRESSES = [
  {
    id: 'addr-1',
    label: 'home',
    fullName: 'مدين السيد',
    phone: '01012345678',
    city: 'القاهرة',
    area: 'مدينة نصر',
    street: 'شارع مصطفى النحاس',
    building: '12',
    apartment: '5',
    notes: '',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'work',
    fullName: 'مدين السيد',
    phone: '01098765432',
    city: 'الجيزة',
    area: 'الشيخ زايد',
    street: 'المحور المركزي',
    building: 'برج 3',
    apartment: '',
    notes: 'الاستلام من الاستقبال',
    isDefault: false,
  },
];

function createId() {
  return `addr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function AddressesProvider({ children }) {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: replace with a real API call, e.g. GET /api/users/me/addresses
    const loadAddresses = async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setAddresses(MOCK_ADDRESSES);
      setIsLoading(false);
    };
    loadAddresses();
  }, []);

  const addAddress = useCallback((addressData) => {
  // TODO: replace with a real API call, e.g. POST /api/users/me/addresses
  const newId = createId();
  setAddresses((prev) => {
    const newAddress = { ...addressData, id: newId };
    const shouldBeDefault = newAddress.isDefault || prev.length === 0;
    const withoutDefault = shouldBeDefault
      ? prev.map((address) => ({ ...address, isDefault: false }))
      : prev;
    return [...withoutDefault, { ...newAddress, isDefault: shouldBeDefault }];
  });
  return newId;
}, []);

  const updateAddress = useCallback((addressId, addressData) => {
    // TODO: replace with a real API call, e.g. PATCH /api/users/me/addresses/:id
    setAddresses((prev) => {
      const next = prev.map((address) =>
        address.id === addressId ? { ...address, ...addressData, id: addressId } : address
      );
      if (addressData.isDefault) {
        return next.map((address) => ({ ...address, isDefault: address.id === addressId }));
      }
      return next;
    });
  }, []);

  const deleteAddress = useCallback((addressId) => {
    // TODO: replace with a real API call, e.g. DELETE /api/users/me/addresses/:id
    setAddresses((prev) => {
      const remaining = prev.filter((address) => address.id !== addressId);
      const removedWasDefault = prev.find((a) => a.id === addressId)?.isDefault;
      if (removedWasDefault && remaining.length > 0) {
        remaining[0] = { ...remaining[0], isDefault: true };
      }
      return remaining;
    });
  }, []);

  const setDefaultAddress = useCallback((addressId) => {
    // TODO: replace with a real API call, e.g. PATCH /api/users/me/addresses/:id/default
    setAddresses((prev) =>
      prev.map((address) => ({ ...address, isDefault: address.id === addressId }))
    );
  }, []);

  const getAddressById = useCallback(
    (addressId) => addresses.find((address) => address.id === addressId) || null,
    [addresses]
  );

  const value = useMemo(
    () => ({
      addresses,
      isLoading,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
      getAddressById,
    }),
    [addresses, isLoading, addAddress, updateAddress, deleteAddress, setDefaultAddress, getAddressById]
  );

  return <AddressesContext.Provider value={value}>{children}</AddressesContext.Provider>;
}

export function useAddresses() {
  const context = useContext(AddressesContext);
  if (!context) {
    throw new Error('useAddresses must be used inside an <AddressesProvider>');
  }
  return context;
}