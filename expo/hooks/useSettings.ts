import { useState, useEffect, useCallback, useMemo } from "react";
import { Platform, NativeModules } from "react-native";
import createContextHook from "@nkzw/create-context-hook";
import type { GradeSystem } from "@/utils/gradeConversion";
import type { Language } from "@/utils/i18n";

const SETTINGS_STORAGE_KEY = "app_settings";

// Storage utility
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    return AsyncStorage.default.getItem(key);
  },
  
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    return AsyncStorage.default.setItem(key, value);
  }
};

interface AppSettings {
  gradeSystem: GradeSystem;
  language: Language;
}

const getDeviceLanguage = (): Language => {
  let deviceLanguage = "en";
  
  if (Platform.OS === 'web') {
    deviceLanguage = navigator.language.split('-')[0];
  } else {
    const locales = NativeModules.SettingsManager?.settings?.AppleLocale ||
                    NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
                    NativeModules.I18nManager?.localeIdentifier;
    
    if (locales) {
      deviceLanguage = locales.split('_')[0].split('-')[0];
    }
  }
  
  const supportedLanguages: Language[] = ["en", "es", "ca", "fr", "de"];
  return supportedLanguages.includes(deviceLanguage as Language) 
    ? (deviceLanguage as Language) 
    : "en";
};

const defaultSettings: AppSettings = {
  gradeSystem: "french",
  language: getDeviceLanguage()
};

export const [SettingsProvider, useSettings] = createContextHook(() => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const stored = await storage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  }, []);

  const saveSettings = useCallback(async (newSettings: Partial<AppSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  }, [settings]);

  const setGradeSystem = useCallback((gradeSystem: GradeSystem) => {
    saveSettings({ gradeSystem });
  }, [saveSettings]);

  const setLanguage = useCallback((language: Language) => {
    saveSettings({ language });
  }, [saveSettings]);

  return useMemo(() => ({
    settings,
    setGradeSystem,
    setLanguage,
  }), [settings, setGradeSystem, setLanguage]);
});