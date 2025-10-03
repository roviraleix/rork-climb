// Beautiful pastel color palette with green, orange, and coral
export const Colors = {
  // Primary colors - pastel palette
  primary: "#A8E6A3", // Soft pastel green
  secondary: "#FFB366", // Warm pastel orange
  accent: "#FF9999", // Soft coral
  tertiary: "#B8E6B8", // Light mint green
  
  // Background colors
  background: "#FEFEFE", // Pure white background
  surface: "#FFFFFF", // White surface
  surfaceSecondary: "#F8FDF8", // Very light green tint
  
  // Text colors
  text: "#2D4A2D", // Dark forest green
  textSecondary: "#6B8E6B", // Medium green
  textLight: "#FFFFFF", // Light text
  textMuted: "#9BB59B", // Muted green
  
  // Status colors
  success: "#A8E6A3",
  error: "#FF9999",
  warning: "#FFB366",
  info: "#B8E6B8",
  
  // Hold colors (LED colors)
  holds: {
    red: "#FF6B6B", // Soft coral for top/finish
    orange: "#FFB366", // Warm orange for feet
    blue: "#74C0FC", // Soft blue for hands
    green: "#A8E6A3", // Pastel green for start
  },
  
  // Additional pastel colors
  pastel: {
    lightGreen: "#E8F5E8",
    lightOrange: "#FFF2E6",
    lightCoral: "#FFE6E6",
    mint: "#F0FFF0",
  },
  
  // Border and divider colors
  border: "#E8F5E8",
  divider: "#D4E6D4",
  
  // Button colors
  button: {
    primary: "#A8E6A3",
    secondary: "#FFB366",
    accent: "#FF9999",
    disabled: "#E8F5E8",
  },
  
  // Dark theme colors (updated with pastel approach)
  darkTheme: {
    background: "#1A2E1A",
    surface: "#2D4A2D",
    surfaceVariant: "#3A5A3A",
    text: "#E8F5E8",
    textSecondary: "#B8E6B8",
    border: "#4A6B4A",
  }
} as const;

export type HoldColor = keyof typeof Colors.holds;