/* ==========================================================================
   DYNAMIC PRICING & BILLING PERIOD MANAGER (CMS REACTIVE)
   ========================================================================== */

import { getPricingData } from './data.js';
import { showToast } from './toast.js';
import { subscribeToConfigUpdates } from './store.js';

export function initPricing() {
  const toggleBtns = document.querySelectorAll(".billing-toggle-btn");
  const billingNoteEl = document.getElementById("pricing-billing-note");
  const pricingContainer = document.querySelector(".pricing-grid");

  let currentPeriod = "monthly";

  const BILLING_NOTES = {
    monthly: "Billed monthly. Cancel anytime with 1 click.",
    quarterly: "Billed every 3 months. Save 15%.",
    annual: "Billed annually. Save 30% — Best Value."
  };

  function renderPricingCards() {
    if (!pricingContainer) return;

    const tiers = getPricingData();

    pricingContainer.innerHTML = tiers.map(tier => {
      let price = tier.priceMonthly;
      if (currentPeriod === "quarterly") price = tier.priceQuarterly || Math.round(tier.priceMonthly * 0.85);
      if (currentPeriod === "annual") price = tier.priceAnnual || Math.round(tier.priceMonthly * 0.70);

      const isFeatured = tier.isFeatured;
      const featuredBadge = isFeatured ? `
        <div style="position: absolute; top: -14px; left: 50%; transform: translateX(-50%);">
          <span class="badge-featured" style="padding: 0.35rem 1.25rem;">MOST POPULAR</span>
        </div>
      ` : '';

      return `
        <div class="pricing-card ${isFeatured ? 'featured' : ''}">
          ${featuredBadge}
          <div>
            <span class="pill-tag" ${isFeatured ? 'style="background: var(--primary); color: #fff;"' : ''}>${tier.badge || 'Plan'}</span>
            <h3 style="margin-top: 0.75rem;">${tier.name}</h3>
            <p style="font-size: 0.85rem; margin-top: 0.5rem;">${tier.description || ''}</p>
            <div class="pricing-amount" style="${isFeatured ? 'color: var(--primary);' : ''}">
              $${price}<span>/mo</span>
            </div>
            <ul class="feature-checklist" style="text-align: left; margin-top: 1.5rem;">
              ${(tier.features || []).map(f => `
                <li class="feature-check-item"><span>✓ ${f}</span></li>
              `).join('')}
            </ul>
          </div>
          <button class="btn ${isFeatured ? 'btn-primary' : 'btn-secondary'} btn-full btn-select-plan" data-plan="${tier.name}">
            ${isFeatured ? 'Start 7-Day Free Trial →' : `Select ${tier.name}`}
          </button>
        </div>
      `;
    }).join('');

    // Attach listeners
    pricingContainer.querySelectorAll(".btn-select-plan").forEach(btn => {
      btn.addEventListener("click", () => {
        const planName = btn.getAttribute("data-plan");
        openCheckoutModal(planName);
      });
    });
  }

  toggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      toggleBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentPeriod = btn.getAttribute("data-period");
      if (billingNoteEl) billingNoteEl.textContent = BILLING_NOTES[currentPeriod] || "";

      renderPricingCards();
    });
  });

  subscribeToConfigUpdates(() => {
    renderPricingCards();
  });

  renderPricingCards();
}

function openCheckoutModal(planName) {
  const modal = document.getElementById("checkout-modal");
  const modalBody = document.getElementById("checkout-modal-content");
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div style="text-align: center; margin-bottom: 1.5rem;">
      <span class="pill-tag">7-Day Free Trial</span>
      <h3 style="font-size: 1.6rem; margin-top: 0.5rem;">Activate ${planName}</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted);">Zero risk. You won't be charged for 7 days. Cancel anytime.</p>
    </div>

    <form id="checkout-form" style="display: flex; flex-direction: column; gap: 1rem;">
      <div>
        <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 0.35rem;">Full Name</label>
        <input type="text" required placeholder="Alex Johnson" style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; background: var(--bg-surface); border: 1px solid var(--border-medium); color: var(--text-main);" />
      </div>
      <div>
        <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 0.35rem;">Email Address</label>
        <input type="email" required placeholder="alex@athlete.com" style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; background: var(--bg-surface); border: 1px solid var(--border-medium); color: var(--text-main);" />
      </div>
      <div>
        <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 0.35rem;">Credit Card or Apple Pay</label>
        <div style="background: var(--bg-surface); border: 1px solid var(--border-medium); border-radius: 10px; padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between;">
          <span style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-main);">•••• •••• •••• 4242</span>
          <span style="font-size: 0.75rem; color: var(--accent-emerald); font-weight: 800;">🔒 256-Bit SSL Encrypted</span>
        </div>
      </div>
      <div style="font-size: 0.75rem; color: var(--text-dim); line-height: 1.4;">
        By continuing, you agree to our Terms of Service and Privacy Policy. Includes 7-day trial access.
      </div>
      <button type="submit" class="btn btn-primary btn-full" style="margin-top: 0.5rem;">
        Start 7-Day Free Trial →
      </button>
    </form>
  `;

  modal.classList.add("active");

  const form = document.getElementById("checkout-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      modal.classList.remove("active");
      showToast("Membership Activated!", `Welcome to ${planName}. Opening your onboarding portal...`, "success");
    });
  }
}
