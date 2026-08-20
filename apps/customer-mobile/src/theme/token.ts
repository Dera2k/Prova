export const colors = {
  background: "#090F18",
  surface: "#121A24",
  surfaceElevated: "#192331",
  border: "#263241",
  text: "#F5F7FA",
  textMuted: "#A7B2C5",
  textSubtle: "#6F7D91",
  primary: "#2DD68F",
  primaryPressed: "#20B976",
  primarySoft: "#0D3E2C",
  danger: "#FF5C6C",
  warning: "#F6B73C",
  info: "#4FA8FF",
  white: "#FFFFFF",
  black: "#000000",
  success: "#2DD68F",
  successText: "#0D3E2C",
  warningText: "#49380F",
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999
} as const;

export const typography = {
  display: { fontSize: 36, fontWeight: "700" as const, lineHeight: 43 },
  h1: { fontSize: 28, fontWeight: "700" as const, lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: "700" as const, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: "600" as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: "500" as const, lineHeight: 24 },
  caption: { fontSize: 13, fontWeight: "400" as const, lineHeight: 18 },
  label: { fontSize: 14, fontWeight: "600" as const, lineHeight: 20 }
} as const;