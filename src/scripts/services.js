/* ==========================================================================
   PARTNER SERVICES & STORES MARKETPLACE (DYNAMIC CMS REACTIVE)
   ========================================================================== */

import { getServicesData } from './data.js';
import { showToast } from './toast.js';
import { subscribeToConfigUpdates } from './store.js';

export function initServicesMarketplace() {
  const container = document.getElementById("services-grid-container");
  const filterBtns = document.querySelectorAll(".service-filter-btn");

  let activeCategory = "all";

  function renderServices() {
    if (!container) return;

    const servicesList = getServicesData();
    const filtered = servicesList.filter(service => {
      return activeCategory === "all" || service.category === activeCategory;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <p>No partner services available in this category.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(service => `
      <div class="service-card">
        <div class="service-img-box">
          <img src="${service.image || '/assets/images/service-mealprep.jpg'}" alt="${service.title}" loading="lazy" />
          <div style="position: absolute; top: 1rem; left: 1rem;">
            <span class="pill-tag" style="background: rgba(10,10,14,0.85); backdrop-filter: blur(8px); border-color: rgba(255,255,255,0.15); color: #fff;">
              ${service.categoryLabel || 'Partner Service'}
            </span>
          </div>
        </div>
        <div class="service-card-body">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
              <span style="font-size: 0.75rem; color: #f59e0b; font-weight: 800;">★ ${(service.rating || 5.0).toFixed(1)} (${service.reviews || 100})</span>
              <strong style="color: var(--primary); font-size: 0.95rem;">${service.price}</strong>
            </div>
            <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 0.5rem;">${service.title}</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1rem;">${service.description}</p>
            <ul style="list-style: none; font-size: 0.775rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.35rem;">
              ${(service.perks || []).map(p => `<li>✓ ${p}</li>`).join('')}
            </ul>
          </div>
          <div style="margin-top: 1.25rem;">
            <button class="btn btn-secondary btn-full btn-service-order" data-title="${service.title}">
              View Provider & Order →
            </button>
          </div>
        </div>
      </div>
    `).join('');

    document.querySelectorAll(".btn-service-order").forEach(btn => {
      btn.addEventListener("click", () => {
        const title = btn.getAttribute("data-title");
        console.log(`Connecting to partner portal for ${title}...`);
      });
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.getAttribute("data-category");
      renderServices();
    });
  });

  subscribeToConfigUpdates(() => {
    renderServices();
  });

  renderServices();
}
