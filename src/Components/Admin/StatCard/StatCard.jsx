import styles from './StatCard.module.css';

function StatCard({ icon, label, value, tone = 'default' }) {
  return (
    <div className={`${styles.card} ${styles[tone]}`}>
      <span className={styles.icon}>{icon}</span>
      <div className={styles.text}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  );
}

export default StatCard;