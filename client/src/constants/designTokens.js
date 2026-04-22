/**
 * Design System Tokens
 * Central source of truth for all design values used throughout the app
 */

export const COLORS = {
  primary: {
    main: "#285ccc", // Mid Blue
    light: "#5aa3ff",
    lighter: "#9ed3ff",
    dark: "#1e47a0",
    darker: "#0c1a50",
  },
  secondary: {
    main: "#fff2bd", // Buttermilk
    light: "#fffde0",
    dark: "#ffd54f",
  },
  neutral: {
    white: "#ffffff",
    black: "#000000",
    bg: "#f9fafb",
    light: "#f3f4f6",
    border: "#e5e7eb",
    text: "#1f2937",
    textLight: "#6b7280",
  },
  status: {
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  },
};

export const ANIMATIONS = {
  // Timing
  duration: {
    fast: 150,
    base: 300,
    slow: 500,
    slower: 700,
  },
  // Easing functions
  easing: {
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    smooth: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    bounce: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
  // Variants for Framer Motion
  variants: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
      transition: { duration: 0.4 },
    },
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.4 },
    },
    slideLeft: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
      transition: { duration: 0.4 },
    },
    slideRight: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
      transition: { duration: 0.4 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.3 },
    },
    staggerContainer: {
      animate: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1,
        },
      },
    },
  },
  // Hover effects
  hover: {
    scale: 1.02,
    shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
};

export const SPACING = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "2.5rem",
  "3xl": "3rem",
  "4xl": "4rem",
};

export const TYPOGRAPHY = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const BREAKPOINTS = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
  ultraWide: 1536,
};

export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

export const SHADOWS = {
  xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
  elevation: "0 10px 25px -5px rgba(40, 92, 204, 0.1)",
  hover: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
};

export const BORDER_RADIUS = {
  xs: "0.25rem",
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.5rem",
  "3xl": "2rem",
  full: "9999px",
};
