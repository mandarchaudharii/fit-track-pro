import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useFitness } from "@/contexts/FitnessContext";

export function AppThemeSync() {
  const { settings } = useFitness();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(settings.darkMode);
  }, [settings.darkMode, setTheme]);

  return null;
}
