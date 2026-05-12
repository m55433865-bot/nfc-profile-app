(function () {
  const defaultTheme = {
    mode: "dark",
    preset: "midnight",
    accent: "#00c896"
  };

  const themePresets = {
    "midnight": {
      label: "Midnight",
      dark: { bg: "#0f0f0f", card: "#1f1f1f", surface: "#202020", surfaceHover: "#292929", text: "#ffffff", muted: "#aaa", border: "#333", input: "#141414" },
      light: { bg: "#f5f5f7", card: "#ffffff", surface: "#f8f8fa", surfaceHover: "#ededf1", text: "#171717", muted: "#666", border: "#dedee4", input: "#ffffff" }
    },
    "ocean": {
      label: "Ocean",
      dark: { bg: "#071317", card: "#102026", surface: "#142a32", surfaceHover: "#1a3640", text: "#f2fbff", muted: "#9fb8c2", border: "#24434d", input: "#0b1b21" },
      light: { bg: "#eefaff", card: "#ffffff", surface: "#f3fbff", surfaceHover: "#e2f4fb", text: "#102027", muted: "#58727d", border: "#c8e4ed", input: "#ffffff" }
    },
    "purple": {
      label: "Purple",
      dark: { bg: "#120e1f", card: "#1d1830", surface: "#28213f", surfaceHover: "#33294f", text: "#fbf8ff", muted: "#b6aacd", border: "#3d3357", input: "#181228" },
      light: { bg: "#faf7ff", card: "#ffffff", surface: "#f7f1ff", surfaceHover: "#efe4ff", text: "#21172f", muted: "#746482", border: "#e0d4ef", input: "#ffffff" }
    },
    "gold": {
      label: "Gold",
      dark: { bg: "#17130a", card: "#241d10", surface: "#2d2515", surfaceHover: "#382f1c", text: "#fffaf0", muted: "#c6b790", border: "#4a3c20", input: "#1d170d" },
      light: { bg: "#fff9ec", card: "#ffffff", surface: "#fff6df", surfaceHover: "#f7edcf", text: "#261e0f", muted: "#7a6a46", border: "#ead9aa", input: "#ffffff" }
    },
    "forest": {
      label: "Forest",
      dark: { bg: "#0d160f", card: "#17251b", surface: "#1d2f23", surfaceHover: "#253b2c", text: "#f3fff6", muted: "#a4bda9", border: "#304b38", input: "#101d14" },
      light: { bg: "#f2fbf4", card: "#ffffff", surface: "#f4fbf5", surfaceHover: "#e6f2e9", text: "#142216", muted: "#5d725f", border: "#cfe0d2", input: "#ffffff" }
    },
    "minimal-white": {
      label: "Minimal White",
      dark: { bg: "#151515", card: "#222", surface: "#2a2a2a", surfaceHover: "#343434", text: "#ffffff", muted: "#b8b8b8", border: "#3a3a3a", input: "#1b1b1b" },
      light: { bg: "#ffffff", card: "#ffffff", surface: "#f7f7f7", surfaceHover: "#eeeeee", text: "#111111", muted: "#666666", border: "#dddddd", input: "#ffffff" }
    },
    "neon": {
      label: "Neon",
      dark: { bg: "#080a12", card: "#111525", surface: "#171d33", surfaceHover: "#202844", text: "#f6f8ff", muted: "#9aa6ce", border: "#2c3558", input: "#0c1020" },
      light: { bg: "#f6f8ff", card: "#ffffff", surface: "#f1f4ff", surfaceHover: "#e7ecff", text: "#12182a", muted: "#637099", border: "#d4daf1", input: "#ffffff" }
    }
  };

  const accentColors = [
    { label: "Blue", value: "#3b82f6" },
    { label: "Purple", value: "#7c3aed" },
    { label: "Green", value: "#00c896" },
    { label: "Gold", value: "#d6a83f" },
    { label: "Red", value: "#ef4444" },
    { label: "Pink", value: "#ec4899" }
  ];

  window.YourTeckThemeOptions = {
    defaultTheme,
    themePresets,
    accentColors
  };
})();
