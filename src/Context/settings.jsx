import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const SettingsContext = createContext(null);

const STORAGE_KEY = 'lamma_settings';

const DEFAULT_SETTINGS = {
  language: 'ar', // 'ar' | 'en'
  isDarkMode: false,
  notificationsEnabled: true,
};

function loadStoredSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (error) {
    console.error('Failed to read stored settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadStoredSettings);

  // Reflect settings on <html> so dark mode / text direction apply
  // app-wide, not just inside the Settings tab.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.isDarkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('dir', settings.language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', settings.language);
  }, [settings.isDarkMode, settings.language]);

  useEffect(() => {
    // TODO: once a real backend exists, also PATCH /api/users/me/settings
    // so preferences follow the user across devices instead of just this browser.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((partialSettings) => {
    setSettings((prev) => ({ ...prev, ...partialSettings }));
  }, []);

  const value = useMemo(() => ({ settings, updateSettings }), [settings, updateSettings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used inside a <SettingsProvider>');
  }
  return context;
}