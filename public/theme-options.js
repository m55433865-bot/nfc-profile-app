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
    "carbon": {
      label: "Carbon",
      dark: { bg: "#09090b", card: "#18181b", surface: "#202024", surfaceHover: "#2a2a30", text: "#fafafa", muted: "#a1a1aa", border: "#303036", input: "#111114" },
      light: { bg: "#f7f7f8", card: "#ffffff", surface: "#f1f1f3", surfaceHover: "#e7e7ea", text: "#18181b", muted: "#71717a", border: "#d9d9df", input: "#ffffff" }
    },
    "discord": {
      label: "Discord",
      dark: { bg: "#101116", card: "#1e1f2b", surface: "#292b3a", surfaceHover: "#34374a", text: "#f5f6ff", muted: "#b8bdd6", border: "#3b3f56", input: "#171924" },
      light: { bg: "#f5f6ff", card: "#ffffff", surface: "#eef0ff", surfaceHover: "#e4e7ff", text: "#202237", muted: "#686d8d", border: "#d7daf4", input: "#ffffff" }
    },
    "cyber": {
      label: "Cyber",
      dark: { bg: "#080b16", card: "#111729", surface: "#17213a", surfaceHover: "#1e2b4b", text: "#f4f8ff", muted: "#94a3c7", border: "#263757", input: "#0c1222" },
      light: { bg: "#f3f8ff", card: "#ffffff", surface: "#edf5ff", surfaceHover: "#e1ecfb", text: "#121b2d", muted: "#5f7193", border: "#d0def1", input: "#ffffff" }
    },
    "purple": {
      label: "Purple",
      dark: { bg: "#120e1f", card: "#1d1830", surface: "#28213f", surfaceHover: "#33294f", text: "#fbf8ff", muted: "#b6aacd", border: "#3d3357", input: "#181228" },
      light: { bg: "#faf7ff", card: "#ffffff", surface: "#f7f1ff", surfaceHover: "#efe4ff", text: "#21172f", muted: "#746482", border: "#e0d4ef", input: "#ffffff" }
    },
    "royal": {
      label: "Royal",
      dark: { bg: "#10091f", card: "#1c1232", surface: "#2a1d49", surfaceHover: "#35245d", text: "#fff9ff", muted: "#c2addd", border: "#49356d", input: "#160d28" },
      light: { bg: "#fbf7ff", card: "#ffffff", surface: "#f6efff", surfaceHover: "#eadcff", text: "#24143a", muted: "#755c91", border: "#dfcff2", input: "#ffffff" }
    },
    "gold": {
      label: "Gold",
      dark: { bg: "#17130a", card: "#241d10", surface: "#2d2515", surfaceHover: "#382f1c", text: "#fffaf0", muted: "#c6b790", border: "#4a3c20", input: "#1d170d" },
      light: { bg: "#fff9ec", card: "#ffffff", surface: "#fff6df", surfaceHover: "#f7edcf", text: "#261e0f", muted: "#7a6a46", border: "#ead9aa", input: "#ffffff" }
    },
    "sunset": {
      label: "Sunset",
      dark: { bg: "#1b0f12", card: "#2a171c", surface: "#3a2026", surfaceHover: "#4a2a31", text: "#fff7f4", muted: "#d1a9a0", border: "#5a3338", input: "#211216" },
      light: { bg: "#fff6f2", card: "#ffffff", surface: "#fff0e8", surfaceHover: "#ffe5d8", text: "#2d1712", muted: "#805f55", border: "#f0cec1", input: "#ffffff" }
    },
    "forest": {
      label: "Forest",
      dark: { bg: "#0d160f", card: "#17251b", surface: "#1d2f23", surfaceHover: "#253b2c", text: "#f3fff6", muted: "#a4bda9", border: "#304b38", input: "#101d14" },
      light: { bg: "#f2fbf4", card: "#ffffff", surface: "#f4fbf5", surfaceHover: "#e6f2e9", text: "#142216", muted: "#5d725f", border: "#cfe0d2", input: "#ffffff" }
    },
    "emerald": {
      label: "Emerald",
      dark: { bg: "#07140f", card: "#10231b", surface: "#163326", surfaceHover: "#1d4332", text: "#effff7", muted: "#9fc5b3", border: "#2b5742", input: "#0b1c15" },
      light: { bg: "#effaf5", card: "#ffffff", surface: "#eefbf5", surfaceHover: "#ddf3e9", text: "#11261c", muted: "#577667", border: "#c5dfd2", input: "#ffffff" }
    },
    "matrix": {
      label: "Matrix",
      dark: { bg: "#050806", card: "#0d150f", surface: "#142119", surfaceHover: "#1c2f23", text: "#effff1", muted: "#8fb99b", border: "#27432f", input: "#08100b" },
      light: { bg: "#f2fbf3", card: "#ffffff", surface: "#eef9ef", surfaceHover: "#e1f2e4", text: "#102114", muted: "#5f7663", border: "#c9dfcc", input: "#ffffff" }
    },
    "minimal-white": {
      label: "Minimal White",
      dark: { bg: "#151515", card: "#222", surface: "#2a2a2a", surfaceHover: "#343434", text: "#ffffff", muted: "#b8b8b8", border: "#3a3a3a", input: "#1b1b1b" },
      light: { bg: "#ffffff", card: "#ffffff", surface: "#f7f7f7", surfaceHover: "#eeeeee", text: "#111111", muted: "#666666", border: "#dddddd", input: "#ffffff" }
    },
    "cloud": {
      label: "Cloud",
      dark: { bg: "#101419", card: "#1b222b", surface: "#232c37", surfaceHover: "#2d3846", text: "#f8fbff", muted: "#aab7c7", border: "#374455", input: "#151b22" },
      light: { bg: "#f8fbff", card: "#ffffff", surface: "#f2f6fb", surfaceHover: "#e9eff7", text: "#17202b", muted: "#66788f", border: "#d8e1ec", input: "#ffffff" }
    },
    "rose": {
      label: "Rose",
      dark: { bg: "#180d13", card: "#271620", surface: "#351f2b", surfaceHover: "#432837", text: "#fff7fb", muted: "#cfabba", border: "#543246", input: "#1e1018" },
      light: { bg: "#fff7fb", card: "#ffffff", surface: "#fff0f7", surfaceHover: "#ffe5f0", text: "#2a151f", muted: "#806171", border: "#efcddd", input: "#ffffff" }
    },
    "neon": {
      label: "Neon",
      dark: { bg: "#080a12", card: "#111525", surface: "#171d33", surfaceHover: "#202844", text: "#f6f8ff", muted: "#9aa6ce", border: "#2c3558", input: "#0c1020" },
      light: { bg: "#f6f8ff", card: "#ffffff", surface: "#f1f4ff", surfaceHover: "#e7ecff", text: "#12182a", muted: "#637099", border: "#d4daf1", input: "#ffffff" }
    }
  };

  const accentColors = [
    { label: "Blue", value: "#3b82f6" },
    { label: "Cyan", value: "#22d3ee" },
    { label: "Purple", value: "#7c3aed" },
    { label: "Violet", value: "#a855f7" },
    { label: "Green", value: "#00c896" },
    { label: "Emerald", value: "#22c55e" },
    { label: "Gold", value: "#d6a83f" },
    { label: "Orange", value: "#f97316" },
    { label: "Red", value: "#ef4444" },
    { label: "Pink", value: "#ec4899" }
  ];

  window.YourTeckThemeOptions = {
    defaultTheme,
    themePresets,
    accentColors
  };
})();
