/**
 * Design tokens for MaxSec UI
 * Centralized theme configuration
 */

export const colors = {
  primary: {
    light: "#3d4563",
    main: "#2B2D42",
    dark: "#1f2031",
  },
  secondary: {
    light: "#a8b3cc",
    main: "#8D99AE",
    dark: "#616d88",
  },
  background: {
    light: "#fafbfc",
    main: "#EDF2F4",
    dark: "#f5f7f9",
  },
  alert: {
    light: "#f5afba",
    main: "#EF233C",
    dark: "#c4182d",
  },
  critical: {
    light: "#f98e99",
    main: "#D90429",
    dark: "#a2021e",
  },
  success: "#16A34A",
  warning: "#F59E0B",
  info: "#3B82F6",
};

export const typography = {
  fontFamily: {
    sans: '"Inter", system-ui, -apple-system, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
  },
  fontSize: {
    xs: "12px",
    sm: "13px",
    base: "15px",
    lg: "16px",
    xl: "18px",
    "2xl": "20px",
    "3xl": "22px",
    "4xl": "28px",
  },
};

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
  "3xl": "48px",
};

export const borderRadius = {
  xs: "8px",
  sm: "10px",
  base: "12px",
  lg: "14px",
  xl: "16px",
};

export const shadows = {
  soft: "0 2px 8px rgba(11, 15, 30, 0.08)",
  medium: "0 4px 16px rgba(11, 15, 30, 0.12)",
  elevated: "0 8px 24px rgba(11, 15, 30, 0.16)",
  focus: "0 0 0 3px rgba(61, 69, 99, 0.1)",
};

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
};
