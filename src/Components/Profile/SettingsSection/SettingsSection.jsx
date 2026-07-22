import { useSettings } from '../../../Context/settings';
import styles from './SettingsSection.module.css';

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className={styles.row}>
      <div className={styles.rowText}>
        <span className={styles.rowLabel}>{label}</span>
        {description && <span className={styles.rowDescription}>{description}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.toggleThumb} />
      </button>
    </div>
  );
}

function SettingsSection() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>الإعدادات</h2>

      <div className={styles.group}>
        <span className={styles.groupTitle}>اللغة</span>
        <div className={styles.languagePicker}>
          <button
            type="button"
            className={`${styles.languageOption} ${
              settings.language === 'ar' ? styles.languageOptionActive : ''
            }`}
            onClick={() => updateSettings({ language: 'ar' })}
          >
            العربية
          </button>
          <button
            type="button"
            className={`${styles.languageOption} ${
              settings.language === 'en' ? styles.languageOptionActive : ''
            }`}
            onClick={() => updateSettings({ language: 'en' })}
          >
            English
          </button>
        </div>
      </div>

      <div className={styles.group}>
        <ToggleRow
          label="الوضع الليلي"
          description="تفعيل مظهر داكن لكامل الموقع"
          checked={settings.isDarkMode}
          onChange={(value) => updateSettings({ isDarkMode: value })}
        />
        <ToggleRow
          label="الإشعارات"
          description="إشعارات الطلبات والعروض"
          checked={settings.notificationsEnabled}
          onChange={(value) => updateSettings({ notificationsEnabled: value })}
        />
      </div>
    </div>
  );
}

export default SettingsSection;