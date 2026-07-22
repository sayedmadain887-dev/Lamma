export const ADDRESS_LABEL_OPTIONS = [
  { value: 'home', label: 'المنزل' },
  { value: 'work', label: 'العمل' },
  { value: 'other', label: 'أخرى' },
];

export function getAddressLabelText(label) {
  return ADDRESS_LABEL_OPTIONS.find((option) => option.value === label)?.label || 'عنوان';
}

// One-line summary used anywhere space is tight (e.g. inside an order card).
export function formatAddressLine(address) {
  if (!address) return '';
  return [address.area, address.city].filter(Boolean).join('، ');
}

// Fuller, multi-part summary used on the address's own card.
export function formatAddressDetails(address) {
  if (!address) return '';
  return [address.street, address.building && `مبنى ${address.building}`, address.apartment && `شقة ${address.apartment}`]
    .filter(Boolean)
    .join('، ');
}