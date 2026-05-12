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
    "rose": {
      label: "Rose",
      dark: { bg: "#180d13", card: "#271620", surface: "#351f2b", surfaceHover: "#432837", text: "#fff7fb", muted: "#cfabba", border: "#543246", input: "#1e1018", preview: ["#fb7185", "#ec4899", "#be185d"] },
      light: { bg: "#fff7fb", card: "#ffffff", surface: "#fff0f7", surfaceHover: "#ffe5f0", text: "#2a151f", muted: "#806171", border: "#efcddd", input: "#ffffff", preview: ["#fb7185", "#f9a8d4", "#ffffff"] }
    },
    "neon": {
      label: "Neon",
      dark: { bg: "#080a12", card: "#111525", surface: "#171d33", surfaceHover: "#202844", text: "#f6f8ff", muted: "#9aa6ce", border: "#2c3558", input: "#0c1020" },
      light: { bg: "#f6f8ff", card: "#ffffff", surface: "#f1f4ff", surfaceHover: "#e7ecff", text: "#12182a", muted: "#637099", border: "#d4daf1", input: "#ffffff" }
    },
    "aurora": {
      label: "Aurora",
      dark: { bg: "linear-gradient(135deg, #051b1f 0%, #111827 46%, #26123f 100%)", card: "rgba(15, 23, 42, 0.92)", surface: "rgba(30, 41, 59, 0.9)", surfaceHover: "rgba(51, 65, 85, 0.92)", text: "#f8fbff", muted: "#a7b7c9", border: "rgba(125, 211, 252, 0.28)", input: "rgba(8, 13, 28, 0.86)", preview: ["#00c896", "#22d3ee", "#a855f7"] },
      light: { bg: "linear-gradient(135deg, #ecfeff 0%, #f5f3ff 52%, #fdf2f8 100%)", card: "rgba(255, 255, 255, 0.88)", surface: "rgba(248, 250, 252, 0.9)", surfaceHover: "rgba(241, 245, 249, 0.94)", text: "#172033", muted: "#64748b", border: "rgba(14, 165, 233, 0.22)", input: "rgba(255, 255, 255, 0.9)", preview: ["#22d3ee", "#a78bfa", "#f0abfc"] }
    },
    "galaxy": {
      label: "Galaxy",
      dark: { bg: "linear-gradient(140deg, #090a1f 0%, #24134f 45%, #083344 100%)", card: "rgba(18, 16, 42, 0.92)", surface: "rgba(34, 27, 68, 0.9)", surfaceHover: "rgba(45, 39, 86, 0.94)", text: "#fbfaff", muted: "#b7b0d5", border: "rgba(168, 85, 247, 0.32)", input: "rgba(12, 11, 30, 0.9)", preview: ["#6366f1", "#a855f7", "#22d3ee"] },
      light: { bg: "linear-gradient(140deg, #eef2ff 0%, #faf5ff 48%, #ecfeff 100%)", card: "rgba(255, 255, 255, 0.9)", surface: "rgba(248, 245, 255, 0.92)", surfaceHover: "rgba(239, 233, 255, 0.96)", text: "#211634", muted: "#71658f", border: "rgba(124, 58, 237, 0.2)", input: "rgba(255, 255, 255, 0.92)", preview: ["#6366f1", "#a855f7", "#06b6d4"] }
    },
    "sunset-gradient": {
      label: "Sunset",
      dark: { bg: "linear-gradient(135deg, #210b1a 0%, #4a1d2f 42%, #7c2d12 100%)", card: "rgba(45, 18, 31, 0.92)", surface: "rgba(72, 31, 45, 0.9)", surfaceHover: "rgba(93, 42, 52, 0.94)", text: "#fff7f4", muted: "#e3b4aa", border: "rgba(251, 146, 60, 0.3)", input: "rgba(30, 12, 22, 0.9)", preview: ["#ec4899", "#f97316", "#facc15"] },
      light: { bg: "linear-gradient(135deg, #fff1f2 0%, #ffedd5 50%, #fef3c7 100%)", card: "rgba(255, 255, 255, 0.9)", surface: "rgba(255, 247, 237, 0.92)", surfaceHover: "rgba(255, 237, 213, 0.96)", text: "#2b1513", muted: "#875f4f", border: "rgba(249, 115, 22, 0.22)", input: "rgba(255, 255, 255, 0.92)", preview: ["#fb7185", "#fb923c", "#fde047"] }
    },
    "candy": {
      label: "Candy",
      dark: { bg: "linear-gradient(135deg, #10172a 0%, #3b1d5c 52%, #831843 100%)", card: "rgba(25, 26, 55, 0.92)", surface: "rgba(49, 39, 85, 0.9)", surfaceHover: "rgba(70, 48, 105, 0.94)", text: "#fff7ff", muted: "#d8b8df", border: "rgba(236, 72, 153, 0.3)", input: "rgba(16, 18, 42, 0.9)", preview: ["#38bdf8", "#a855f7", "#ec4899"] },
      light: { bg: "linear-gradient(135deg, #eff6ff 0%, #faf5ff 48%, #fdf2f8 100%)", card: "rgba(255, 255, 255, 0.9)", surface: "rgba(250, 245, 255, 0.92)", surfaceHover: "rgba(245, 232, 255, 0.96)", text: "#24152d", muted: "#74617e", border: "rgba(236, 72, 153, 0.2)", input: "rgba(255, 255, 255, 0.92)", preview: ["#38bdf8", "#c084fc", "#f472b6"] }
    },
    "fire": {
      label: "Fire",
      dark: { bg: "linear-gradient(135deg, #1c0907 0%, #5c1b12 48%, #854d0e 100%)", card: "rgba(42, 16, 12, 0.92)", surface: "rgba(70, 28, 18, 0.9)", surfaceHover: "rgba(94, 39, 21, 0.94)", text: "#fff8ed", muted: "#dfb58f", border: "rgba(245, 158, 11, 0.32)", input: "rgba(29, 10, 7, 0.9)", preview: ["#ef4444", "#f97316", "#facc15"] },
      light: { bg: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 45%, #fef9c3 100%)", card: "rgba(255, 255, 255, 0.9)", surface: "rgba(255, 247, 237, 0.92)", surfaceHover: "rgba(254, 235, 200, 0.96)", text: "#2d170b", muted: "#805b34", border: "rgba(245, 158, 11, 0.24)", input: "rgba(255, 255, 255, 0.92)", preview: ["#ef4444", "#f97316", "#facc15"] }
    },
    "ice": {
      label: "Ice",
      dark: { bg: "linear-gradient(135deg, #061321 0%, #0f3b57 48%, #155e75 100%)", card: "rgba(10, 27, 43, 0.92)", surface: "rgba(18, 52, 75, 0.9)", surfaceHover: "rgba(26, 72, 99, 0.94)", text: "#f2fbff", muted: "#a8cad8", border: "rgba(125, 211, 252, 0.32)", input: "rgba(7, 20, 32, 0.9)", preview: ["#e0f2fe", "#38bdf8", "#2563eb"] },
      light: { bg: "linear-gradient(135deg, #ffffff 0%, #e0f2fe 45%, #dbeafe 100%)", card: "rgba(255, 255, 255, 0.9)", surface: "rgba(240, 249, 255, 0.94)", surfaceHover: "rgba(224, 242, 254, 0.96)", text: "#102336", muted: "#5e7890", border: "rgba(14, 165, 233, 0.22)", input: "rgba(255, 255, 255, 0.92)", preview: ["#ffffff", "#7dd3fc", "#3b82f6"] }
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
