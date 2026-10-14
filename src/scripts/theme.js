/* ==========================================================================
   THEME, COLOR ACCENT & DYNAMIC BRAND ENGINE
   ========================================================================== */

import { showToast } from './toast.js';
import { getSiteConfig, saveSiteConfig, applyBrandingToDOM, subscribeToConfigUpdates } from './store.js';

export const COLOR_HUES = {
  crimson: { hue: 5, hex: "#FF3B30" },
  cyan: { hue: 221, hex: "#2563EB" },
  emerald: { hue: 160, hex: "#059669" },
  amber: { hue: 37, hex: "#D97706" },
  violet: { hue: 262, hex: "#7C3AED" }
};

export function initTheme() {
  const html = document.documentElement;
  const config = getSiteConfig();

  // Apply initial branding
  applyBrandingToDOM(config.branding);

  // 1. Initial Theme Mode (Dark / Light)
  const savedTheme = localStorage.getItem("apex_theme") || config.branding.defaultTheme || "dark";
  setThemeMode(savedTheme);

  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const current = html.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      setThemeMode(next);
    });
  }

  // 2. Brand Accent Color Dots (if present in customizer bar)
  const colorDots = document.querySelectorAll(".color-dot");
  colorDots.forEach(dot => {
    dot.addEventListener("click", () => {
      const colorKey = dot.getAttribute("data-color");
      const palette = COLOR_HUES[colorKey];
      if (palette) {
        const currentConfig = getSiteConfig();
        currentConfig.branding.accentPalette = colorKey;
        currentConfig.branding.primaryHue = palette.hue;
        currentConfig.branding.primaryColor = palette.hex;
        saveSiteConfig(currentConfig);
        showToast("Color Accent Applied", `Primary brand color changed to ${palette.hex}`, "success");
      }
    });
  });

  // 3. Brand Identity Select in prototype bar (if present)
  const brandSelect = document.getElementById("brand-name-select");
  if (brandSelect) {
    brandSelect.value = config.branding.name;

    brandSelect.addEventListener("change", (e) => {
      const newName = e.target.value;
      const currentConfig = getSiteConfig();
      currentConfig.branding.name = newName;
      saveSiteConfig(currentConfig);
      showToast("Brand Name Updated", `Prototype rebranded to "${newName}"`, "success");
    });
  }

  // Subscribe to real-time cross-tab CMS updates
  subscribeToConfigUpdates((updated) => {
    if (updated && updated.branding) {
      applyBrandingToDOM(updated.branding);
      if (brandSelect && updated.branding.name) {
        brandSelect.value = updated.branding.name;
      }
    }
  });
}

export function setThemeMode(mode) {
  const html = document.documentElement;
  html.setAttribute("data-theme", mode);
  localStorage.setItem("apex_theme", mode);
  
  const icon = document.getElementById("theme-icon");
  if (icon) {
    icon.innerHTML = mode === "dark" 
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
  }
}

export function setBrandColor(colorKey) {
  const palette = COLOR_HUES[colorKey];
  const hue = palette ? palette.hue : 5;
  document.documentElement.style.setProperty("--primary-hue", hue);
  if (palette) {
    document.documentElement.style.setProperty("--primary-custom", palette.hex);
  }

  document.querySelectorAll(".color-dot").forEach(dot => {
    dot.classList.toggle("active", dot.getAttribute("data-color") === colorKey);
  });
}
