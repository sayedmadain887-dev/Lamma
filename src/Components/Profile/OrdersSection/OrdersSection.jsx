import { useState } from 'react';
import { useOrders } from '../../../Context/Orders';
import OrderCard from './OrderCard';
import styles from './OrdersSection.module.css';

const SUB_TABS = [
  { id: 'current', label: 'الطلبات الحالية' },
  { id: 'past', label: 'الطلبات السابقة' },
];

function OrdersSection() {
  const { currentOrders, pastOrders, isLoading } = useOrders();
  const [activeSubTab, setActiveSubTab] = useState('current');

  const visibleOrders = activeSubTab === 'current' ? currentOrders : pastOrders;

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>طلباتي</h2>

      <div className={styles.subTabs}>
        {SUB_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.subTabButton} ${
              activeSubTab === tab.id ? styles.subTabButtonActive : ''
            }`}
            onClick={() => setActiveSubTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className={styles.emptyState}>جاري تحميل الطلبات...</p>
      ) : visibleOrders.length === 0 ? (
        <p className={styles.emptyState}>
          {activeSubTab === 'current' ? 'لا يوجد طلبات حالية' : 'لا يوجد طلبات سابقة'}
        </p>
      ) : (
        <div className={styles.list}>
          {visibleOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersSection;