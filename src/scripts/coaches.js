/* ==========================================================================
   COACHES DIRECTORY & BOOKING MODAL HANDLER (DYNAMIC CMS REACTIVE)
   ========================================================================== */

import { getCoachesData } from './data.js';
import { showToast } from './toast.js';
import { subscribeToConfigUpdates } from './store.js';

export function initCoachesDirectory() {
  const container = document.getElementById("coaches-grid-container");
  const filterBtns = document.querySelectorAll(".coach-filter-btn");
  const searchInput = document.getElementById("coach-search-input");

  let activeCategory = "all";
  let searchQuery = "";

  function renderCoaches() {
    if (!container) return;

    const coachesList = getCoachesData();
    const filtered = coachesList.filter(coach => {
      const matchesCat = activeCategory === "all" || (coach.categories && coach.categories.includes(activeCategory));
      const matchesQuery = searchQuery === "" || 
        coach.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        coach.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (coach.tags && coach.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCat && matchesQuery;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <p>No certified coaches found matching your criteria.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(coach => `
      <div class="coach-card">
        <div class="coach-photo-wrapper">
          <img src="${coach.image || '/assets/images/coach-marcus.jpg'}" alt="${coach.name}" loading="lazy" />
          <div class="coach-badge-top">
            <span class="badge-featured">${coach.badge || 'Verified Coach'}</span>
          </div>
          <div class="coach-rating-top">
            <span style="color: #f59e0b;">★</span>
            <span>${(coach.rating || 5.0).toFixed(1)} (${coach.reviewsCount || 50})</span>
          </div>
        </div>
        <div class="coach-card-body">
          <div class="coach-title">${coach.title}</div>
          <h3 class="coach-name">${coach.name}</h3>
          <p class="coach-bio">${coach.bio}</p>
          
          <div class="coach-tags">
            ${(coach.tags || []).map(t => `<span class="tag-pill">${t}</span>`).join('')}
          </div>

          <div class="coach-stats-row">
            <div>
              <strong style="color: var(--text-main);">${coach.experience || '8+ yrs'}</strong> • ${coach.athletesCount || '50+ Athletes'}
            </div>
            <div class="coach-price-tag">
              $${coach.priceMonthly}<span>/mo</span>
            </div>
          </div>

          <div class="coach-card-actions">
            <button class="btn btn-secondary btn-sm btn-coach-profile" data-coach-id="${coach.id}">
              Bio & Credentials
            </button>
            <button class="btn btn-primary btn-sm btn-coach-book" data-coach-id="${coach.id}">
              Book Consult
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach listeners
    attachCoachListeners(coachesList);
  }

  function attachCoachListeners(coachesList) {
    document.querySelectorAll(".btn-coach-book").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-coach-id");
        const coach = coachesList.find(c => c.id === id);
        if (coach) openBookingModal(coach);
      });
    });

    document.querySelectorAll(".btn-coach-profile").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-coach-id");
        const coach = coachesList.find(c => c.id === id);
        if (coach) openProfileModal(coach);
      });
    });
  }

  // Filter handlers
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.getAttribute("data-category");
      renderCoaches();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      renderCoaches();
    });
  }

  // Listen for real-time cross-tab CMS updates
  subscribeToConfigUpdates(() => {
    renderCoaches();
  });

  // Render initial
  renderCoaches();
}

function openBookingModal(coach) {
  const modal = document.getElementById("booking-modal");
  const modalBody = document.getElementById("booking-modal-content");
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem;">
      <img src="${coach.image}" alt="${coach.name}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary);" />
      <div>
        <h3 style="font-size: 1.25rem;">Book Video Consult: ${coach.name}</h3>
        <p style="font-size: 0.8rem; color: var(--text-muted);">${coach.title} • 1-on-1 Strategy Call</p>
      </div>
    </div>
    
    <div style="margin-bottom: 1.25rem;">
      <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 0.5rem;">Select Date:</label>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; text-align: center;">
        <button type="button" class="btn btn-secondary btn-sm slot-day active">Today</button>
        <button type="button" class="btn btn-secondary btn-sm slot-day">Tomorrow</button>
        <button type="button" class="btn btn-secondary btn-sm slot-day">Thursday</button>
        <button type="button" class="btn btn-secondary btn-sm slot-day">Friday</button>
      </div>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 0.5rem;">Select Available Time Window:</label>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; text-align: center;">
        <button type="button" class="btn btn-secondary btn-sm slot-time active">10:00 AM EST</button>
        <button type="button" class="btn btn-secondary btn-sm slot-time">2:30 PM EST</button>
        <button type="button" class="btn btn-secondary btn-sm slot-time">5:00 PM EST</button>
      </div>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 0.5rem;">Your Email & Phone:</label>
      <input type="email" placeholder="alex@athlete.com" style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; background: var(--bg-surface); border: 1px solid var(--border-medium); color: var(--text-main); margin-bottom: 0.5rem;" />
      <input type="tel" placeholder="+1 (555) 019-2834" style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; background: var(--bg-surface); border: 1px solid var(--border-medium); color: var(--text-main);" />
    </div>

    <button id="confirm-booking-btn" class="btn btn-primary btn-full">
      Confirm 1-on-1 Video Consultation →
    </button>
  `;

  modal.classList.add("active");

  const confirmBtn = document.getElementById("confirm-booking-btn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      modal.classList.remove("active");
      showToast("Consultation Confirmed!", `Your 1-on-1 session with ${coach.name} has been added to your calendar.`, "success");
    });
  }
}

function openProfileModal(coach) {
  const modal = document.getElementById("profile-modal");
  const modalBody = document.getElementById("profile-modal-content");
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div style="display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1.5rem;">
      <img src="${coach.image}" alt="${coach.name}" style="width: 90px; height: 90px; border-radius: 20px; object-fit: cover; border: 2px solid var(--primary);" />
      <div>
        <span class="badge-featured">${coach.badge || 'Verified Coach'}</span>
        <h3 style="font-size: 1.5rem; margin-top: 0.25rem;">${coach.name}</h3>
        <p style="font-size: 0.85rem; color: var(--primary); font-weight: 700;">${coach.title}</p>
        <p style="font-size: 0.8rem; color: var(--text-muted);">${coach.experience} • ${coach.athletesCount}</p>
      </div>
    </div>
    
    <div style="margin-bottom: 1.5rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-main);">
      <h4 style="font-size: 1rem; margin-bottom: 0.5rem;">About Coach</h4>
      <p style="color: var(--text-muted); margin-bottom: 1rem;">${coach.bio}</p>
      <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1rem;">
        <h5 style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; margin-bottom: 0.5rem;">Verified Certifications:</h5>
        <ul style="list-style: none; font-size: 0.8rem; color: var(--text-muted); display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem;">
          <li>✓ CSCS Certified Coach</li>
          <li>✓ Precision Nutrition Lv 2</li>
          <li>✓ Biomechanics Specialist</li>
          <li>✓ CPR / AED Certified</li>
        </ul>
      </div>
    </div>

    <button class="btn btn-primary btn-full" onclick="document.getElementById('profile-modal').classList.remove('active'); document.querySelector('[data-coach-id=\\'${coach.id}\\'].btn-coach-book').click();">
      Proceed to Video Consult with ${coach.name} ($${coach.priceMonthly}/mo)
    </button>
  `;

  modal.classList.add("active");
}
