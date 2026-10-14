/* ==========================================================================
   INTERACTIVE FAQ ACCORDION WITH LIVE SEARCH (CMS REACTIVE)
   ========================================================================== */

import { getFaqsData } from './data.js';
import { subscribeToConfigUpdates } from './store.js';

export function initFAQ() {
  const container = document.getElementById("faq-accordion-container");
  const searchInput = document.getElementById("faq-search-input");

  function renderFAQ(items) {
    if (!container) return;

    if (!items || items.length === 0) {
      container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No questions found matching your query.</p>`;
      return;
    }

    container.innerHTML = items.map((item, idx) => `
      <div class="faq-item ${idx === 0 ? 'active' : ''}">
        <button class="faq-question">
          <span>${item.q}</span>
          <span class="faq-icon-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </span>
        </button>
        <div class="faq-answer">
          <p>${item.a}</p>
        </div>
      </div>
    `).join('');

    container.querySelectorAll(".faq-question").forEach(qBtn => {
      qBtn.addEventListener("click", () => {
        const item = qBtn.parentElement;
        const isActive = item.classList.contains("active");

        container.querySelectorAll(".faq-item").forEach(i => i.classList.remove("active"));
        if (!isActive) {
          item.classList.add("active");
        }
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      const allFaqs = getFaqsData();
      const filtered = allFaqs.filter(item => 
        item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
      );
      renderFAQ(filtered);
    });
  }

  subscribeToConfigUpdates(() => {
    renderFAQ(getFaqsData());
  });

  renderFAQ(getFaqsData());
}
