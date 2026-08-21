import { useThemeStore } from "../../store/theme.store";

export interface ChartTheme {
  ink: string;
  inkSecondary: string;
  inkMuted: string;
  line: string;
  surface: string;
  brand: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
}

function readChartColors(): ChartTheme {
  const styles = getComputedStyle(document.documentElement);
  const read = (name: string) => styles.getPropertyValue(name).trim();

  return {
    ink: read("--ink"),
    inkSecondary: read("--ink-secondary"),
    inkMuted: read("--ink-muted"),
    line: read("--line"),
    surface: read("--surface"),
    brand: read("--brand"),
    success: read("--success"),
    warning: read("--warning"),
    danger: read("--danger"),
    info: read("--info"),
  };
}

export function useChartTheme(): ChartTheme {
  useThemeStore((state) => state.theme);

  return readChartColors();
}
