/* ==========================================================================
   MAIN APPLICATION ENTRY POINT (DYNAMIC CMS REACTIVE)
   ========================================================================== */

import { initTheme } from './theme.js';
import { initAppSimulator } from './app-simulator.js';
import { initCoachQuiz } from './coach-quiz.js';
import { initCoachesDirectory } from './coaches.js';
import { initServicesMarketplace } from './services.js';
import { initBeforeAfterSlider } from './before-after.js';
import { initPricing } from './pricing.js';
import { initFAQ } from './faq.js';
import { initModals } from './modals.js';
import { getSiteConfig, applyBrandingToDOM, subscribeToConfigUpdates } from './store.js';

export function applyDynamicContent(config) {
  config = config || getSiteConfig();

  // 1. Core Branding & Solid Colors
  if (config.branding) {
    applyBrandingToDOM(config.branding);
  }

  // 2. Hero Content
  if (config.hero) {
    const pill = document.querySelector(".hero-content .pill-tag span");
    if (pill && config.hero.pillText) pill.textContent = config.hero.pillText;

    const titleLine1 = document.getElementById("hero-title-line-1");
    if (titleLine1 && config.hero.titleLine1) titleLine1.textContent = config.hero.titleLine1;

    const titleLine2 = document.getElementById("hero-title-line-2");
    if (titleLine2 && config.hero.titleLine2) titleLine2.textContent = config.hero.titleLine2;

    const titleLine3 = document.getElementById("hero-title-line-3");
    if (titleLine3 && config.hero.titleLine3) titleLine3.textContent = config.hero.titleLine3;

    const heroDesc = document.querySelector(".hero-description");
    if (heroDesc && config.hero.description) {
      heroDesc.innerHTML = `<span class="dynamic-brand-name">${config.branding.name}</span> ${config.hero.description.replace(/^(Apex Fitness|Sic Fitness|Titan Athletic)\s*/i, '')}`;
    }

    const ctaPrimaryBtn = document.getElementById("hero-btn-primary");
    if (ctaPrimaryBtn && config.hero.primaryCtaText) {
      const span = ctaPrimaryBtn.querySelector("span");
      if (span) span.textContent = config.hero.primaryCtaText;
    }

    const ctaSecondaryBtn = document.getElementById("hero-btn-secondary");
    if (ctaSecondaryBtn && config.hero.secondaryCtaText) {
      const span = ctaSecondaryBtn.querySelector("span");
      if (span) span.textContent = config.hero.secondaryCtaText;
    }

    if (config.hero.proofItems && config.hero.proofItems.length > 0) {
      const proofBar = document.querySelector(".hero-proof-bar");
      if (proofBar) {
        proofBar.innerHTML = config.hero.proofItems.map(item => `
          <div class="proof-item">
            <span class="proof-icon">✓</span>
            <span>${item}</span>
          </div>
        `).join('');
      }
    }
  }

  // 3. Section Headers
  const h = config.sectionHeaders || {};
  const pillarsPill = document.getElementById("pillars-section-pill");
  if (pillarsPill && h.pillarsPill) pillarsPill.innerHTML = h.pillarsPill.replace(/Apex Fitness/g, `<span class="dynamic-brand-name">${config.branding.name}</span>`);

  const pillarsTitle = document.getElementById("pillars-section-title");
  if (pillarsTitle && h.pillarsTitle) pillarsTitle.textContent = h.pillarsTitle;

  const pillarsDesc = document.getElementById("pillars-section-desc");
  if (pillarsDesc && h.pillarsDesc) pillarsDesc.textContent = h.pillarsDesc;

  const compTitle = document.getElementById("comp-section-title");
  if (compTitle && h.comparisonTitle) compTitle.innerHTML = h.comparisonTitle;

  const compDesc = document.getElementById("comp-section-desc");
  if (compDesc && h.comparisonDesc) compDesc.textContent = h.comparisonDesc;

  const coachesTitle = document.getElementById("coaches-section-title");
  if (coachesTitle && h.coachesTitle) coachesTitle.textContent = h.coachesTitle;

  const coachesDesc = document.getElementById("coaches-section-desc");
  if (coachesDesc && h.coachesDesc) coachesDesc.textContent = h.coachesDesc;

  const servicesTitle = document.getElementById("services-section-title");
  if (servicesTitle && h.servicesTitle) servicesTitle.textContent = h.servicesTitle;

  const servicesDesc = document.getElementById("services-section-desc");
  if (servicesDesc && h.servicesDesc) servicesDesc.textContent = h.servicesDesc;

  const pricingTitle = document.getElementById("pricing-section-title");
  if (pricingTitle && h.pricingTitle) pricingTitle.textContent = h.pricingTitle;

  const pricingDesc = document.getElementById("pricing-section-desc");
  if (pricingDesc && h.pricingDesc) pricingDesc.textContent = h.pricingDesc;

  const faqsTitle = document.getElementById("faqs-section-title");
  if (faqsTitle && h.faqsTitle) faqsTitle.textContent = h.faqsTitle;

  const faqsDesc = document.getElementById("faqs-section-desc");
  if (faqsDesc && h.faqsDesc) faqsDesc.textContent = h.faqsDesc;

  // 4. Pillars Cards
  if (config.pillars && config.pillars.length > 0) {
    const pillarCards = document.querySelectorAll(".pillar-card");
    config.pillars.forEach((pillar, idx) => {
      const card = pillarCards[idx];
      if (card) {
        const titleEl = card.querySelector("h3");
        if (titleEl) titleEl.textContent = pillar.title;

        const badgeEl = card.querySelector(".pill-tag");
        if (badgeEl) badgeEl.textContent = pillar.badge;

        const descEl = card.querySelector("p");
        if (descEl) descEl.textContent = pillar.description;

        const listEl = card.querySelector(".feature-checklist");
        if (listEl && pillar.features) {
          listEl.innerHTML = pillar.features.map(f => `
            <li class="feature-check-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              <span>${f}</span>
            </li>
          `).join('');
        }
      }
    });
  }

  // 5. Comparison Matrix
  if (config.comparison && config.comparison.length > 0) {
    const compWrapper = document.querySelector(".comparison-table-wrapper");
    if (compWrapper) {
      const headerHtml = `
        <div class="comp-row comp-header">
          <div>Core Capability</div>
          <div>Typical Fitness Apps ❌</div>
          <div class="comp-col-highlight" style="border-top: 3px solid var(--primary);"><span class="dynamic-brand-name">${config.branding.name}</span> Hybrid Edge ⚡</div>
        </div>
      `;
      const rowsHtml = config.comparison.map(row => `
        <div class="comp-row">
          <div><strong>${row.feature}</strong></div>
          <div style="color: var(--text-muted);">${row.typical}</div>
          <div class="comp-col-highlight">${row.hybrid}</div>
        </div>
      `).join('');
      compWrapper.innerHTML = headerHtml + rowsHtml;
    }
  }

  // 6. B2B / For Coaches Platform
  if (config.b2b) {
    const b2bHeading = document.getElementById("b2b-heading");
    if (b2bHeading && config.b2b.heading) b2bHeading.textContent = config.b2b.heading;

    const b2bSubheading = document.getElementById("b2b-subheading");
    if (b2bSubheading && config.b2b.subheading) b2bSubheading.textContent = config.b2b.subheading;
  }

  // 7. Final High-Impact CTA
  if (config.finalCta) {
    const finalHeading = document.getElementById("final-cta-heading");
    if (finalHeading && config.finalCta.heading) finalHeading.textContent = config.finalCta.heading;

    const finalSubheading = document.getElementById("final-cta-desc");
    if (finalSubheading && config.finalCta.subheading) finalSubheading.textContent = config.finalCta.subheading;

    const finalBtn = document.getElementById("final-cta-btn");
    if (finalBtn && config.finalCta.buttonText) finalBtn.textContent = config.finalCta.buttonText;
  }

  // 8. Footer Copyright
  if (config.branding && config.branding.copyrightText) {
    const copyrightEl = document.querySelector(".footer-bottom div:first-child");
    if (copyrightEl) copyrightEl.textContent = config.branding.copyrightText;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Core Systems
  initTheme();
  applyDynamicContent();
  initAppSimulator();
  initCoachQuiz();
  initCoachesDirectory();
  initServicesMarketplace();
  initBeforeAfterSlider();
  initPricing();
  initFAQ();
  initModals();

  // Listen for live cross-tab CMS updates
  subscribeToConfigUpdates((cfg) => {
    applyDynamicContent(cfg);
  });

  // Mobile Menu Drawer
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileDrawer = document.getElementById("mobile-drawer");
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileDrawer.classList.toggle("active");
    });

    mobileDrawer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileDrawer.classList.remove("active");
      });
    });
  }

  // Smooth scroll offset for sticky header
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetElem.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  console.log("Apex Hybrid Fitness Prototype initialized with CMS store reactivity.");
});
