import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { saveSiteSettings, subscribeSiteSettings } from "../lib/firestore/siteContent";

type SiteSettingsContextValue = {
  maintenanceMode: boolean;
  settingsReady: boolean;
  setMaintenanceMode: (enabled: boolean) => void;
};

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [maintenanceMode, setMaintenanceModeState] = useState(false);
  const [settingsReady, setSettingsReady] = useState(false);

  useEffect(() => subscribeSiteSettings((settings) => {
    setMaintenanceModeState(Boolean(settings.maintenanceMode));
    setSettingsReady(true);
  }), []);

  const setMaintenanceMode = useCallback((enabled: boolean) => {
    setMaintenanceModeState(enabled);
    void saveSiteSettings({ maintenanceMode: enabled });
  }, []);

  const value = useMemo(
    () => ({
      maintenanceMode,
      settingsReady,
      setMaintenanceMode,
    }),
    [maintenanceMode, settingsReady, setMaintenanceMode],
  );

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings(): SiteSettingsContextValue {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  return ctx;
}
