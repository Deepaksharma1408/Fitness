/* ==========================================================================
   ADMIN CMS DASHBOARD CONTROLLER
   Full dynamic management of branding, colors, hero, coaches, services, pricing, & FAQs
   ========================================================================== */

import { getSiteConfig, saveSiteConfig, resetSiteConfig, DEFAULT_SITE_CONFIG, applyBrandingToDOM, hexToHue } from './store.js';
import { showToast } from './toast.js';

let currentConfig = null;

const AUTH_STORAGE_KEY = "apex_admin_auth_user";

export function checkAuthentication() {
  const sessionUser = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
  return !!sessionUser;
}

export function initAdminAuth() {
  const authScreen = document.getElementById("admin-auth-screen");
  const dashboardWrapper = document.getElementById("admin-dashboard-wrapper");
  const loginForm = document.getElementById("admin-login-form");
  const emailInput = document.getElementById("login-email");
  const pwdInput = document.getElementById("login-password");
  const rememberCheckbox = document.getElementById("login-remember");
  const errorMsg = document.getElementById("login-error-msg");
  const togglePwdBtn = document.getElementById("btn-toggle-pwd");
  const autofillBtn = document.getElementById("btn-autofill-demo");
  const logoutBtn = document.getElementById("btn-admin-logout");

  // Show/Hide password toggle
  if (togglePwdBtn && pwdInput) {
    togglePwdBtn.addEventListener("click", () => {
      const isPwd = pwdInput.type === "password";
      pwdInput.type = isPwd ? "text" : "password";
      togglePwdBtn.textContent = isPwd ? "🙈" : "👁️";
    });
  }

  // Update demo hints from config
  const sec = (currentConfig && currentConfig.security) ? currentConfig.security : { adminEmail: "admin@apexfitness.com", adminPassword: "admin123" };
  const demoEmailHint = document.getElementById("demo-email-hint");
  const demoPwdHint = document.getElementById("demo-pwd-hint");
  if (demoEmailHint) demoEmailHint.textContent = sec.adminEmail || "admin@apexfitness.com";
  if (demoPwdHint) demoPwdHint.textContent = sec.adminPassword || "admin123";

  // Auto-fill demo credentials
  if (autofillBtn && emailInput && pwdInput) {
    autofillBtn.addEventListener("click", () => {
      const activeSec = (currentConfig && currentConfig.security) ? currentConfig.security : { adminEmail: "admin@apexfitness.com", adminPassword: "admin123" };
      emailInput.value = activeSec.adminEmail || "admin@apexfitness.com";
      pwdInput.value = activeSec.adminPassword || "admin123";
      if (errorMsg) errorMsg.style.display = "none";
      showToast("Credentials Auto-Filled", "Click 'Sign In' to enter CMS Studio", "info");
    });
  }

  // Logout handler
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to log out of CMS Studio?")) {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        if (dashboardWrapper) dashboardWrapper.style.display = "none";
        if (authScreen) authScreen.style.display = "flex";
        if (pwdInput) pwdInput.value = "";
        showToast("Logged Out", "You have signed out of CMS Studio", "info");
      }
    });
  }

  // Handle Login submission
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const enteredEmail = emailInput.value.trim().toLowerCase();
      const enteredPwd = pwdInput.value;
      const secConfig = (currentConfig && currentConfig.security) ? currentConfig.security : { adminEmail: "admin@apexfitness.com", adminPassword: "admin123" };

      const validEmail = (secConfig.adminEmail || "admin@apexfitness.com").trim().toLowerCase();
      const validPwd = secConfig.adminPassword || "admin123";

      // Verify credentials (matches active security config or default admin credentials)
      if (
        (enteredEmail === validEmail && enteredPwd === validPwd) ||
        (enteredEmail === "admin@apexfitness.com" && enteredPwd === "admin123")
      ) {
        if (errorMsg) errorMsg.style.display = "none";
        
        // Save auth session
        const authData = JSON.stringify({ email: enteredEmail, timestamp: Date.now() });
        sessionStorage.setItem(AUTH_STORAGE_KEY, authData);
        if (rememberCheckbox && rememberCheckbox.checked) {
          localStorage.setItem(AUTH_STORAGE_KEY, authData);
        }

        // Transition to dashboard
        if (authScreen) authScreen.style.display = "none";
        if (dashboardWrapper) dashboardWrapper.style.display = "block";
        showToast("Access Granted", `Welcome back, ${enteredEmail}!`, "success");
      } else {
        if (errorMsg) {
          errorMsg.textContent = "Invalid email or password. Please verify your credentials.";
          errorMsg.style.display = "block";
        }
      }
    });
  }

  // Check initial authentication state
  if (checkAuthentication()) {
    if (authScreen) authScreen.style.display = "none";
    if (dashboardWrapper) dashboardWrapper.style.display = "block";
  } else {
    if (authScreen) authScreen.style.display = "flex";
    if (dashboardWrapper) dashboardWrapper.style.display = "none";
  }
}

export function initAdminDashboard() {
  currentConfig = getSiteConfig();

  // Initialize Authentication Gate
  initAdminAuth();

  // Tab switching
  const tabBtns = document.querySelectorAll(".admin-nav-item");
  const tabPanes = document.querySelectorAll(".admin-tab-pane");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetTab = btn.getAttribute("data-tab");
      const targetPane = document.getElementById(`tab-${targetTab}`);
      if (targetPane) targetPane.classList.add("active");
    });
  });

  // Populate all tabs
  populateBrandingTab();
  populateHeroTab();
  populatePillarsTab();
  populateComparisonTab();
  populateCoachesTab();
  populateServicesTab();
  populatePricingTab();
  populateFaqsTab();
  populateBackupTab();

  // Save all triggers
  document.querySelectorAll(".btn-save-all").forEach(btn => {
    btn.addEventListener("click", () => {
      saveAllChanges();
    });
  });

  // Reset trigger
  const resetBtn = document.getElementById("btn-reset-defaults");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to restore all website content to factory defaults?")) {
        currentConfig = resetSiteConfig();
        location.reload();
      }
    });
  }

  // Backup / Import / Export
  initBackupHandlers();
}

/* ==========================================================================
   1. BRANDING & VISUALS TAB
   ========================================================================== */
function populateBrandingTab() {
  const b = currentConfig.branding || {};
  
  const nameInput = document.getElementById("brand-input-name");
  const letterInput = document.getElementById("brand-input-letter");
  const taglineInput = document.getElementById("brand-input-tagline");
  const colorPicker = document.getElementById("brand-color-picker");
  const colorHexText = document.getElementById("brand-color-hex");
  const themeSelect = document.getElementById("brand-default-theme");
  const copyrightInput = document.getElementById("brand-copyright");

  if (nameInput) nameInput.value = b.name || "Apex Fitness";
  if (letterInput) letterInput.value = b.logoLetter || (b.name ? b.name.charAt(0).toUpperCase() : "A");
  if (taglineInput) taglineInput.value = b.tagline || "";
  if (colorPicker) colorPicker.value = b.primaryColor || "#FF3B30";
  if (colorHexText) colorHexText.value = b.primaryColor || "#FF3B30";
  if (themeSelect) themeSelect.value = b.defaultTheme || "dark";
  if (copyrightInput) copyrightInput.value = b.copyrightText || "";

  // CMS Security Credentials
  const sec = currentConfig.security || {};
  const emailAuthInput = document.getElementById("admin-auth-email");
  const pwdAuthInput = document.getElementById("admin-auth-password");
  if (emailAuthInput) emailAuthInput.value = sec.adminEmail || "admin@apexfitness.com";
  if (pwdAuthInput) pwdAuthInput.value = sec.adminPassword || "admin123";

  // Color picker sync & real-time auto-saving
  if (colorPicker && colorHexText) {
    colorPicker.addEventListener("input", (e) => {
      const hex = e.target.value;
      colorHexText.value = hex;
      applyDynamicColor(hex);
    });

    colorHexText.addEventListener("input", (e) => {
      let hex = e.target.value.trim();
      if (!hex.startsWith('#') && hex.length === 6) hex = '#' + hex;
      if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        colorPicker.value = hex;
        applyDynamicColor(hex);
      }
    });

    colorHexText.addEventListener("change", (e) => {
      let hex = e.target.value.trim();
      if (!hex.startsWith('#')) hex = '#' + hex;
      if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        colorPicker.value = hex;
        colorHexText.value = hex;
        applyDynamicColor(hex);
      }
    });
  }

  // Quick Swatches
  document.querySelectorAll(".swatch-preset-btn").forEach(swatch => {
    swatch.addEventListener("click", () => {
      const hex = swatch.getAttribute("data-hex");
      const hue = swatch.getAttribute("data-hue");
      if (colorPicker) colorPicker.value = hex;
      if (colorHexText) colorHexText.value = hex;
      applyDynamicColor(hex, hue);
    });
  });
}

function applyDynamicColor(hex, explicitHue = null) {
  if (!currentConfig.branding) currentConfig.branding = {};
  currentConfig.branding.primaryColor = hex;
  const hue = explicitHue !== null ? Number(explicitHue) : hexToHue(hex);
  currentConfig.branding.primaryHue = hue;
  
  // Apply immediately to current DOM
  applyBrandingToDOM(currentConfig.branding);
  
  // Persist immediately and broadcast across all open tabs via BroadcastChannel
  saveSiteConfig(currentConfig);
}

/* ==========================================================================
   2. HERO SECTION TAB
   ========================================================================== */
function populateHeroTab() {
  const h = currentConfig.hero || {};
  
  const pillInput = document.getElementById("hero-input-pill");
  const line1Input = document.getElementById("hero-input-line1");
  const line2Input = document.getElementById("hero-input-line2");
  const line3Input = document.getElementById("hero-input-line3");
  const descInput = document.getElementById("hero-input-desc");
  const ctaPrimaryInput = document.getElementById("hero-input-cta-primary");
  const ctaSecondaryInput = document.getElementById("hero-input-cta-secondary");
  const proofItemsInput = document.getElementById("hero-input-proof");

  if (pillInput) pillInput.value = h.pillText || "";
  if (line1Input) line1Input.value = h.titleLine1 || "";
  if (line2Input) line2Input.value = h.titleLine2 || "";
  if (line3Input) line3Input.value = h.titleLine3 || "";
  if (descInput) descInput.value = h.description || "";
  if (ctaPrimaryInput) ctaPrimaryInput.value = h.primaryCtaText || "";
  if (ctaSecondaryInput) ctaSecondaryInput.value = h.secondaryCtaText || "";
  if (proofItemsInput) proofItemsInput.value = (h.proofItems || []).join("\n");

  // Final CTA Box
  const fCta = currentConfig.finalCta || {};
  const fHead = document.getElementById("final-cta-input-heading");
  const fSub = document.getElementById("final-cta-input-subheading");
  const fBtn = document.getElementById("final-cta-input-btn");
  if (fHead) fHead.value = fCta.heading || "";
  if (fSub) fSub.value = fCta.subheading || "";
  if (fBtn) fBtn.value = fCta.buttonText || "";
}

/* ==========================================================================
   3. CORE PILLARS TAB
   ========================================================================== */
function populatePillarsTab() {
  const secH = currentConfig.sectionHeaders || {};
  const pillPill = document.getElementById("pillars-input-pill");
  const pillTitle = document.getElementById("pillars-input-title");
  const pillDesc = document.getElementById("pillars-input-desc");
  if (pillPill) pillPill.value = secH.pillarsPill || "";
  if (pillTitle) pillTitle.value = secH.pillarsTitle || "";
  if (pillDesc) pillDesc.value = secH.pillarsDesc || "";

  const container = document.getElementById("pillars-editor-container");
  if (!container) return;

  const pillars = currentConfig.pillars || [];
  container.innerHTML = pillars.map((p, idx) => `
    <div class="admin-card" style="margin-bottom: 1.5rem;">
      <div class="admin-card-title">Pillar ${idx + 1}: ${p.title}</div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Pillar Title</label>
          <input type="text" class="admin-input pillar-field-title" data-idx="${idx}" value="${p.title}" />
        </div>
        <div class="form-group">
          <label class="form-label">Badge Tag</label>
          <input type="text" class="admin-input pillar-field-badge" data-idx="${idx}" value="${p.badge || ''}" />
        </div>
        <div class="form-group form-grid-full">
          <label class="form-label">Short Description</label>
          <textarea class="admin-textarea pillar-field-desc" data-idx="${idx}">${p.description || ''}</textarea>
        </div>
        <div class="form-group form-grid-full">
          <label class="form-label">Checklist Bullet Points (One per line)</label>
          <textarea class="admin-textarea pillar-field-features" data-idx="${idx}">${(p.features || []).join('\n')}</textarea>
        </div>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   4. COMPARISON MATRIX TAB
   ========================================================================== */
function populateComparisonTab() {
  const secH = currentConfig.sectionHeaders || {};
  const compTitle = document.getElementById("comp-input-title");
  const compDesc = document.getElementById("comp-input-desc");
  if (compTitle) compTitle.value = secH.comparisonTitle || "";
  if (compDesc) compDesc.value = secH.comparisonDesc || "";

  const tbody = document.getElementById("comparison-table-body");
  if (!tbody) return;

  const rows = currentConfig.comparison || [];
  tbody.innerHTML = rows.map((r, idx) => `
    <tr>
      <td>
        <input type="text" class="admin-input comp-field-feature" data-idx="${idx}" value="${r.feature}" style="width: 100%;" />
      </td>
      <td>
        <input type="text" class="admin-input comp-field-typical" data-idx="${idx}" value="${r.typical}" style="width: 100%;" />
      </td>
      <td>
        <input type="text" class="admin-input comp-field-hybrid" data-idx="${idx}" value="${r.hybrid}" style="width: 100%;" />
      </td>
      <td style="text-align: right;">
        <button class="btn-action-icon btn-action-delete btn-delete-comp" data-idx="${idx}" title="Delete Row">✕</button>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll(".btn-delete-comp").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-idx"));
      currentConfig.comparison.splice(idx, 1);
      saveSiteConfig(currentConfig);
      populateComparisonTab();
      showToast("Comparison Row Removed", "Row deleted and synced", "info");
    });
  });

  const addBtn = document.getElementById("btn-add-comp-row");
  if (addBtn && !addBtn.dataset.bound) {
    addBtn.dataset.bound = "true";
    addBtn.addEventListener("click", () => {
      currentConfig.comparison.push({
        id: `comp-${Date.now()}`,
        feature: "New Capability",
        typical: "Standard generic app limitation",
        hybrid: "Custom bespoke coach feature"
      });
      saveSiteConfig(currentConfig);
      populateComparisonTab();
      showToast("Comparison Row Added", "New row added and synced", "success");
    });
  }
}

/* ==========================================================================
   5. COACHES DIRECTORY CRUD TAB
   ========================================================================== */
function populateCoachesTab() {
  const secH = currentConfig.sectionHeaders || {};
  const cTitle = document.getElementById("coaches-input-title");
  const cDesc = document.getElementById("coaches-input-desc");
  if (cTitle) cTitle.value = secH.coachesTitle || "";
  if (cDesc) cDesc.value = secH.coachesDesc || "";

  const container = document.getElementById("admin-coaches-list");
  if (!container) return;

  const coaches = currentConfig.coaches || [];
  container.innerHTML = coaches.map((c, idx) => `
    <div class="admin-card" style="display: flex; gap: 1.5rem; align-items: center; justify-content: space-between;">
      <div style="display: flex; gap: 1.25rem; align-items: center;">
        <img src="${c.image || '/assets/images/coach-marcus.jpg'}" alt="${c.name}" style="width: 64px; height: 64px; border-radius: 14px; object-fit: cover; border: 2px solid var(--primary);" />
        <div>
          <div style="font-size: 0.75rem; color: var(--primary); font-weight: 800; text-transform: uppercase;">${c.badge || 'Coach'} • $${c.priceMonthly}/mo</div>
          <h4 style="font-size: 1.2rem; font-weight: 800; margin: 0.15rem 0;">${c.name}</h4>
          <p style="font-size: 0.85rem; color: #9ca3af; margin: 0;">${c.title}</p>
        </div>
      </div>
      <div style="display: flex; gap: 0.6rem;">
        <button class="btn btn-secondary btn-sm btn-edit-coach" data-idx="${idx}">Edit Coach</button>
        <button class="btn-action-icon btn-action-delete btn-delete-coach" data-idx="${idx}" title="Delete Coach">✕</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll(".btn-delete-coach").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-idx"));
      if (confirm(`Delete coach ${coaches[idx].name}?`)) {
        coaches.splice(idx, 1);
        saveSiteConfig(currentConfig);
        populateCoachesTab();
        showToast("Coach Removed", "Coach deleted and synced across tabs", "info");
      }
    });
  });

  document.querySelectorAll(".btn-edit-coach").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-idx"));
      openCoachModal(coaches[idx], idx);
    });
  });

  const addCoachBtn = document.getElementById("btn-add-coach");
  if (addCoachBtn && !addCoachBtn.dataset.bound) {
    addCoachBtn.dataset.bound = "true";
    addCoachBtn.addEventListener("click", () => {
      const newCoach = {
        id: `coach-${Date.now()}`,
        name: "New Certified Trainer",
        title: "Strength & Conditioning Specialist",
        badge: "New Coach",
        rating: 5.0,
        reviewsCount: 1,
        experience: "5 yrs Exp",
        athletesCount: "25+ Athletes",
        priceMonthly: 129,
        categories: ["strength", "hypertrophy"],
        bio: "Dedicated athletic performance coach helping athletes achieve lasting body composition results.",
        tags: ["Hypertrophy", "Form Check"],
        image: "/assets/images/coach-marcus.jpg"
      };
      openCoachModal(newCoach, -1);
    });
  }
}

function openCoachModal(coach, editIdx) {
  const modal = document.getElementById("admin-coach-modal");
  if (!modal) return;

  const form = document.getElementById("admin-coach-form");
  form.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">Full Name</label>
        <input type="text" id="c-name" class="admin-input" value="${coach.name}" required />
      </div>
      <div class="form-group">
        <label class="form-label">Coach Specialty Title</label>
        <input type="text" id="c-title" class="admin-input" value="${coach.title}" required />
      </div>
      <div class="form-group">
        <label class="form-label">Monthly Rate ($)</label>
        <input type="number" id="c-price" class="admin-input" value="${coach.priceMonthly}" required />
      </div>
      <div class="form-group">
        <label class="form-label">Featured Badge</label>
        <input type="text" id="c-badge" class="admin-input" value="${coach.badge || 'Top Rated'}" />
      </div>
      <div class="form-group">
        <label class="form-label">Experience Slogan</label>
        <input type="text" id="c-exp" class="admin-input" value="${coach.experience || '10 yrs Exp'}" />
      </div>
      <div class="form-group">
        <label class="form-label">Athletes Count</label>
        <input type="text" id="c-athletes" class="admin-input" value="${coach.athletesCount || '100+ Athletes'}" />
      </div>
      <div class="form-group">
        <label class="form-label">Image Path / Asset</label>
        <select id="c-image" class="admin-select">
          <option value="/assets/images/coach-marcus.jpg" ${coach.image === '/assets/images/coach-marcus.jpg' ? 'selected' : ''}>Coach Marcus (Male Studio)</option>
          <option value="/assets/images/coach-elena.jpg" ${coach.image === '/assets/images/coach-elena.jpg' ? 'selected' : ''}>Coach Elena (Female Athletic)</option>
          <option value="/assets/images/coach-tariq.jpg" ${coach.image === '/assets/images/coach-tariq.jpg' ? 'selected' : ''}>Coach Tariq (Male Power Gym)</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Specialty Categories (comma separated)</label>
        <input type="text" id="c-categories" class="admin-input" value="${(coach.categories || []).join(', ')}" />
        <span class="form-hint">Options: strength, hypertrophy, fatloss, rehab</span>
      </div>
      <div class="form-group form-grid-full">
        <label class="form-label">Tags (comma separated)</label>
        <input type="text" id="c-tags" class="admin-input" value="${(coach.tags || []).join(', ')}" />
      </div>
      <div class="form-group form-grid-full">
        <label class="form-label">Bio Description</label>
        <textarea id="c-bio" class="admin-textarea">${coach.bio}</textarea>
      </div>
    </div>
    <div style="display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem;">
      <button type="button" class="btn btn-secondary modal-close-trigger">Cancel</button>
      <button type="submit" class="btn btn-primary">Save Coach Record</button>
    </div>
  `;

  modal.classList.add("active");

  form.onsubmit = (e) => {
    e.preventDefault();
    const updatedCoach = {
      ...coach,
      name: document.getElementById("c-name").value.trim(),
      title: document.getElementById("c-title").value.trim(),
      priceMonthly: Number(document.getElementById("c-price").value),
      badge: document.getElementById("c-badge").value.trim(),
      experience: document.getElementById("c-exp").value.trim(),
      athletesCount: document.getElementById("c-athletes").value.trim(),
      image: document.getElementById("c-image").value,
      categories: document.getElementById("c-categories").value.split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
      tags: document.getElementById("c-tags").value.split(',').map(s => s.trim()).filter(Boolean),
      bio: document.getElementById("c-bio").value.trim()
    };

    if (editIdx >= 0) {
      currentConfig.coaches[editIdx] = updatedCoach;
    } else {
      currentConfig.coaches.push(updatedCoach);
    }

    saveSiteConfig(currentConfig);
    modal.classList.remove("active");
    populateCoachesTab();
    showToast("Coach Saved", `${updatedCoach.name} has been updated in the database`, "success");
  };

  form.querySelector(".modal-close-trigger").onclick = () => {
    modal.classList.remove("active");
  };
}

/* ==========================================================================
   6. SERVICES & STORES TAB
   ========================================================================== */
function populateServicesTab() {
  const secH = currentConfig.sectionHeaders || {};
  const sTitle = document.getElementById("services-input-title");
  const sDesc = document.getElementById("services-input-desc");
  if (sTitle) sTitle.value = secH.servicesTitle || "";
  if (sDesc) sDesc.value = secH.servicesDesc || "";

  const container = document.getElementById("admin-services-list");
  if (!container) return;

  const services = currentConfig.services || [];
  container.innerHTML = services.map((s, idx) => `
    <div class="admin-card" style="display: flex; gap: 1.5rem; align-items: center; justify-content: space-between;">
      <div style="display: flex; gap: 1.25rem; align-items: center;">
        <img src="${s.image || '/assets/images/service-mealprep.jpg'}" alt="${s.title}" style="width: 64px; height: 64px; border-radius: 14px; object-fit: cover;" />
        <div>
          <div style="font-size: 0.75rem; color: var(--accent-amber); font-weight: 800;">${s.categoryLabel} • ${s.price}</div>
          <h4 style="font-size: 1.15rem; font-weight: 800; margin: 0.15rem 0;">${s.title}</h4>
          <p style="font-size: 0.85rem; color: #9ca3af; margin: 0;">${s.description}</p>
        </div>
      </div>
      <div style="display: flex; gap: 0.6rem;">
        <button class="btn btn-secondary btn-sm btn-edit-service" data-idx="${idx}">Edit Service</button>
        <button class="btn-action-icon btn-action-delete btn-delete-service" data-idx="${idx}" title="Delete Service">✕</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll(".btn-delete-service").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-idx"));
      if (confirm("Delete this partner store?")) {
        services.splice(idx, 1);
        saveSiteConfig(currentConfig);
        populateServicesTab();
        showToast("Service Removed", "Store deleted and synced", "info");
      }
    });
  });

  document.querySelectorAll(".btn-edit-service").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-idx"));
      openServiceModal(services[idx], idx);
    });
  });

  const addServiceBtn = document.getElementById("btn-add-service");
  if (addServiceBtn && !addServiceBtn.dataset.bound) {
    addServiceBtn.dataset.bound = "true";
    addServiceBtn.addEventListener("click", () => {
      const newService = {
        id: `service-${Date.now()}`,
        title: "New Partner Service",
        category: "nutrition",
        categoryLabel: "Specialized Store",
        rating: 5.0,
        reviews: 50,
        price: "$49.00",
        description: "Premium partner solution for athletes.",
        perks: ["Verified quality", "Exclusive member discount"],
        image: "/assets/images/service-mealprep.jpg"
      };
      openServiceModal(newService, -1);
    });
  }
}

function openServiceModal(service, editIdx) {
  const modal = document.getElementById("admin-service-modal");
  if (!modal) return;

  const form = document.getElementById("admin-service-form");
  form.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">Service Title</label>
        <input type="text" id="s-title" class="admin-input" value="${service.title}" required />
      </div>
      <div class="form-group">
        <label class="form-label">Category Filter Key</label>
        <select id="s-cat" class="admin-select">
          <option value="nutrition" ${service.category === 'nutrition' ? 'selected' : ''}>Nutrition (Meal Prep)</option>
          <option value="recovery" ${service.category === 'recovery' ? 'selected' : ''}>Recovery (Sports Therapy)</option>
          <option value="supplements" ${service.category === 'supplements' ? 'selected' : ''}>Supplements & Biohacking</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Display Category Label</label>
        <input type="text" id="s-catlabel" class="admin-input" value="${service.categoryLabel}" />
      </div>
      <div class="form-group">
        <label class="form-label">Price Tag</label>
        <input type="text" id="s-price" class="admin-input" value="${service.price}" />
      </div>
      <div class="form-group form-grid-full">
        <label class="form-label">Description</label>
        <textarea id="s-desc" class="admin-textarea">${service.description}</textarea>
      </div>
      <div class="form-group form-grid-full">
        <label class="form-label">Perks List (comma separated)</label>
        <input type="text" id="s-perks" class="admin-input" value="${(service.perks || []).join(', ')}" />
      </div>
    </div>
    <div style="display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem;">
      <button type="button" class="btn btn-secondary modal-close-trigger">Cancel</button>
      <button type="submit" class="btn btn-primary">Save Service</button>
    </div>
  `;

  modal.classList.add("active");

  form.onsubmit = (e) => {
    e.preventDefault();
    const updatedService = {
      ...service,
      title: document.getElementById("s-title").value.trim(),
      category: document.getElementById("s-cat").value,
      categoryLabel: document.getElementById("s-catlabel").value.trim(),
      price: document.getElementById("s-price").value.trim(),
      description: document.getElementById("s-desc").value.trim(),
      perks: document.getElementById("s-perks").value.split(',').map(s => s.trim()).filter(Boolean)
    };

    if (editIdx >= 0) {
      currentConfig.services[editIdx] = updatedService;
    } else {
      currentConfig.services.push(updatedService);
    }

    saveSiteConfig(currentConfig);
    modal.classList.remove("active");
    populateServicesTab();
    showToast("Service Saved", `${updatedService.title} has been updated`, "success");
  };

  form.querySelector(".modal-close-trigger").onclick = () => {
    modal.classList.remove("active");
  };
}

/* ==========================================================================
   7. PRICING PLANS TAB
   ========================================================================== */
function populatePricingTab() {
  const secH = currentConfig.sectionHeaders || {};
  const b2b = currentConfig.b2b || {};
  const pTitle = document.getElementById("pricing-input-title");
  const pDesc = document.getElementById("pricing-input-desc");
  const b2bHead = document.getElementById("b2b-input-heading");
  const b2bSub = document.getElementById("b2b-input-subheading");
  if (pTitle) pTitle.value = secH.pricingTitle || "";
  if (pDesc) pDesc.value = secH.pricingDesc || "";
  if (b2bHead) b2bHead.value = b2b.heading || "";
  if (b2bSub) b2bSub.value = b2b.subheading || "";

  const container = document.getElementById("admin-pricing-list");
  if (!container) return;

  const tiers = currentConfig.pricing || [];
  container.innerHTML = tiers.map((tier, idx) => `
    <div class="admin-card">
      <div class="admin-card-title">Tier ${idx + 1}: ${tier.name}</div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Plan Name</label>
          <input type="text" class="admin-input pricing-field-name" data-idx="${idx}" value="${tier.name}" />
        </div>
        <div class="form-group">
          <label class="form-label">Badge Tag</label>
          <input type="text" class="admin-input pricing-field-badge" data-idx="${idx}" value="${tier.badge || ''}" />
        </div>
        <div class="form-group">
          <label class="form-label">Monthly Rate ($)</label>
          <input type="number" class="admin-input pricing-field-m" data-idx="${idx}" value="${tier.priceMonthly}" />
        </div>
        <div class="form-group">
          <label class="form-label">Quarterly Rate ($/mo)</label>
          <input type="number" class="admin-input pricing-field-q" data-idx="${idx}" value="${tier.priceQuarterly || Math.round(tier.priceMonthly * 0.85)}" />
        </div>
        <div class="form-group">
          <label class="form-label">Annual Rate ($/mo)</label>
          <input type="number" class="admin-input pricing-field-a" data-idx="${idx}" value="${tier.priceAnnual || Math.round(tier.priceMonthly * 0.70)}" />
        </div>
        <div class="form-group">
          <label class="form-label">Highlight as Most Popular?</label>
          <select class="admin-select pricing-field-featured" data-idx="${idx}">
            <option value="false" ${!tier.isFeatured ? 'selected' : ''}>Standard Card</option>
            <option value="true" ${tier.isFeatured ? 'selected' : ''}>Featured / Most Popular</option>
          </select>
        </div>
        <div class="form-group form-grid-full">
          <label class="form-label">Short Description</label>
          <input type="text" class="admin-input pricing-field-desc" data-idx="${idx}" value="${tier.description || ''}" />
        </div>
        <div class="form-group form-grid-full">
          <label class="form-label">Included Feature Checkmarks (One per line)</label>
          <textarea class="admin-textarea pricing-field-features" data-idx="${idx}">${(tier.features || []).join('\n')}</textarea>
        </div>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   8. FAQS MANAGER TAB
   ========================================================================== */
function populateFaqsTab() {
  const secH = currentConfig.sectionHeaders || {};
  const fTitle = document.getElementById("faqs-input-title");
  const fDesc = document.getElementById("faqs-input-desc");
  if (fTitle) fTitle.value = secH.faqsTitle || "";
  if (fDesc) fDesc.value = secH.faqsDesc || "";

  const container = document.getElementById("admin-faqs-list");
  if (!container) return;

  const faqs = currentConfig.faqs || [];
  container.innerHTML = faqs.map((f, idx) => `
    <div class="admin-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <span style="font-weight: 800; font-size: 0.85rem; color: var(--primary);">Question #${idx + 1}</span>
        <button class="btn-action-icon btn-action-delete btn-delete-faq" data-idx="${idx}" title="Delete FAQ">✕</button>
      </div>
      <div class="form-group" style="margin-bottom: 0.75rem;">
        <label class="form-label">Question Text</label>
        <input type="text" class="admin-input faq-field-q" data-idx="${idx}" value="${f.q}" />
      </div>
      <div class="form-group">
        <label class="form-label">Answer Text</label>
        <textarea class="admin-textarea faq-field-a" data-idx="${idx}">${f.a}</textarea>
      </div>
    </div>
  `).join('');

  document.querySelectorAll(".btn-delete-faq").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-idx"));
      faqs.splice(idx, 1);
      saveSiteConfig(currentConfig);
      populateFaqsTab();
      showToast("FAQ Removed", "Question deleted and synced", "info");
    });
  });

  const addFaqBtn = document.getElementById("btn-add-faq");
  if (addFaqBtn && !addFaqBtn.dataset.bound) {
    addFaqBtn.dataset.bound = "true";
    addFaqBtn.addEventListener("click", () => {
      faqs.push({
        id: `faq-${Date.now()}`,
        q: "New Frequently Asked Question?",
        a: "Provide a comprehensive answer regarding coaching, pricing, or training telemetry."
      });
      saveSiteConfig(currentConfig);
      populateFaqsTab();
      showToast("FAQ Added", "New question added and synced", "success");
    });
  }
}

/* ==========================================================================
   9. BACKUP, EXPORT & IMPORT TAB
   ========================================================================== */
function populateBackupTab() {
  const jsonView = document.getElementById("backup-json-textarea");
  if (jsonView) {
    jsonView.value = JSON.stringify(currentConfig, null, 2);
  }
}

function initBackupHandlers() {
  const exportBtn = document.getElementById("btn-export-json");
  const importBtn = document.getElementById("btn-import-json");
  const fileInput = document.getElementById("import-file-input");

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      saveAllChanges();
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentConfig, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `fitness_cms_config_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Configuration Exported", "File downloaded successfully", "success");
    });
  }

  if (importBtn && fileInput) {
    importBtn.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (imported.branding && imported.coaches) {
            currentConfig = imported;
            saveSiteConfig(imported);
            showToast("Import Successful", "Reloading with imported configuration...", "success");
            setTimeout(() => location.reload(), 1000);
          } else {
            alert("Invalid configuration JSON structure.");
          }
        } catch (err) {
          alert("Error parsing JSON file: " + err.message);
        }
      };
      reader.readAsText(file);
    });
  }
}

/* ==========================================================================
   SAVE ALL CHANGES TO PERSISTENT STORE
   ========================================================================== */
export function saveAllChanges() {
  // 1. Branding
  const nameInput = document.getElementById("brand-input-name");
  const letterInput = document.getElementById("brand-input-letter");
  const taglineInput = document.getElementById("brand-input-tagline");
  const colorPicker = document.getElementById("brand-color-picker");
  const themeSelect = document.getElementById("brand-default-theme");
  const copyrightInput = document.getElementById("brand-copyright");

  if (nameInput) currentConfig.branding.name = nameInput.value.trim();
  if (letterInput) currentConfig.branding.logoLetter = letterInput.value.trim().toUpperCase() || (currentConfig.branding.name ? currentConfig.branding.name.charAt(0).toUpperCase() : "A");
  if (taglineInput) currentConfig.branding.tagline = taglineInput.value.trim();
  if (colorPicker) {
    currentConfig.branding.primaryColor = colorPicker.value;
    currentConfig.branding.primaryHue = hexToHue(colorPicker.value);
  }
  if (themeSelect) currentConfig.branding.defaultTheme = themeSelect.value;
  if (copyrightInput) currentConfig.branding.copyrightText = copyrightInput.value.trim();

  // CMS Security Credentials
  if (!currentConfig.security) currentConfig.security = {};
  const emailAuthInput = document.getElementById("admin-auth-email");
  const pwdAuthInput = document.getElementById("admin-auth-password");
  if (emailAuthInput && emailAuthInput.value.trim()) {
    currentConfig.security.adminEmail = emailAuthInput.value.trim();
  }
  if (pwdAuthInput && pwdAuthInput.value) {
    currentConfig.security.adminPassword = pwdAuthInput.value;
  }

  // 2. Hero
  const pillInput = document.getElementById("hero-input-pill");
  const line1Input = document.getElementById("hero-input-line1");
  const line2Input = document.getElementById("hero-input-line2");
  const line3Input = document.getElementById("hero-input-line3");
  const descInput = document.getElementById("hero-input-desc");
  const ctaPrimaryInput = document.getElementById("hero-input-cta-primary");
  const ctaSecondaryInput = document.getElementById("hero-input-cta-secondary");
  const proofItemsInput = document.getElementById("hero-input-proof");

  if (pillInput) currentConfig.hero.pillText = pillInput.value.trim();
  if (line1Input) currentConfig.hero.titleLine1 = line1Input.value.trim();
  if (line2Input) currentConfig.hero.titleLine2 = line2Input.value.trim();
  if (line3Input) currentConfig.hero.titleLine3 = line3Input.value.trim();
  if (descInput) currentConfig.hero.description = descInput.value.trim();
  if (ctaPrimaryInput) currentConfig.hero.primaryCtaText = ctaPrimaryInput.value.trim();
  if (ctaSecondaryInput) currentConfig.hero.secondaryCtaText = ctaSecondaryInput.value.trim();
  if (proofItemsInput) {
    currentConfig.hero.proofItems = proofItemsInput.value.split('\n').map(s => s.trim()).filter(Boolean);
  }

  // Final CTA Box
  if (!currentConfig.finalCta) currentConfig.finalCta = {};
  const fHead = document.getElementById("final-cta-input-heading");
  const fSub = document.getElementById("final-cta-input-subheading");
  const fBtn = document.getElementById("final-cta-input-btn");
  if (fHead) currentConfig.finalCta.heading = fHead.value.trim();
  if (fSub) currentConfig.finalCta.subheading = fSub.value.trim();
  if (fBtn) currentConfig.finalCta.buttonText = fBtn.value.trim();

  // Section Headers
  if (!currentConfig.sectionHeaders) currentConfig.sectionHeaders = {};
  const pillPill = document.getElementById("pillars-input-pill");
  const pillTitle = document.getElementById("pillars-input-title");
  const pillDesc = document.getElementById("pillars-input-desc");
  if (pillPill) currentConfig.sectionHeaders.pillarsPill = pillPill.value.trim();
  if (pillTitle) currentConfig.sectionHeaders.pillarsTitle = pillTitle.value.trim();
  if (pillDesc) currentConfig.sectionHeaders.pillarsDesc = pillDesc.value.trim();

  const compTitle = document.getElementById("comp-input-title");
  const compDesc = document.getElementById("comp-input-desc");
  if (compTitle) currentConfig.sectionHeaders.comparisonTitle = compTitle.value.trim();
  if (compDesc) currentConfig.sectionHeaders.comparisonDesc = compDesc.value.trim();

  const cTitle = document.getElementById("coaches-input-title");
  const cDesc = document.getElementById("coaches-input-desc");
  if (cTitle) currentConfig.sectionHeaders.coachesTitle = cTitle.value.trim();
  if (cDesc) currentConfig.sectionHeaders.coachesDesc = cDesc.value.trim();

  const sTitle = document.getElementById("services-input-title");
  const sDesc = document.getElementById("services-input-desc");
  if (sTitle) currentConfig.sectionHeaders.servicesTitle = sTitle.value.trim();
  if (sDesc) currentConfig.sectionHeaders.servicesDesc = sDesc.value.trim();

  const pTitle = document.getElementById("pricing-input-title");
  const pDesc = document.getElementById("pricing-input-desc");
  if (pTitle) currentConfig.sectionHeaders.pricingTitle = pTitle.value.trim();
  if (pDesc) currentConfig.sectionHeaders.pricingDesc = pDesc.value.trim();

  const fTitle = document.getElementById("faqs-input-title");
  const fDesc = document.getElementById("faqs-input-desc");
  if (fTitle) currentConfig.sectionHeaders.faqsTitle = fTitle.value.trim();
  if (fDesc) currentConfig.sectionHeaders.faqsDesc = fDesc.value.trim();

  // B2B Platform
  if (!currentConfig.b2b) currentConfig.b2b = {};
  const b2bHead = document.getElementById("b2b-input-heading");
  const b2bSub = document.getElementById("b2b-input-subheading");
  if (b2bHead) currentConfig.b2b.heading = b2bHead.value.trim();
  if (b2bSub) currentConfig.b2b.subheading = b2bSub.value.trim();

  // 3. Pillars
  document.querySelectorAll(".pillar-field-title").forEach(input => {
    const idx = Number(input.getAttribute("data-idx"));
    if (currentConfig.pillars[idx]) currentConfig.pillars[idx].title = input.value.trim();
  });
  document.querySelectorAll(".pillar-field-badge").forEach(input => {
    const idx = Number(input.getAttribute("data-idx"));
    if (currentConfig.pillars[idx]) currentConfig.pillars[idx].badge = input.value.trim();
  });
  document.querySelectorAll(".pillar-field-desc").forEach(input => {
    const idx = Number(input.getAttribute("data-idx"));
    if (currentConfig.pillars[idx]) currentConfig.pillars[idx].description = input.value.trim();
  });
  document.querySelectorAll(".pillar-field-features").forEach(input => {
    const idx = Number(input.getAttribute("data-idx"));
    if (currentConfig.pillars[idx]) {
      currentConfig.pillars[idx].features = input.value.split('\n').map(s => s.trim()).filter(Boolean);
    }
  });

  // 4. Comparison
  document.querySelectorAll(".comp-field-feature").forEach(input => {
    const idx = Number(input.getAttribute("data-idx"));
    if (currentConfig.comparison[idx]) currentConfig.comparison[idx].feature = input.value.trim();
  });
  document.querySelectorAll(".comp-field-typical").forEach(input => {
    const idx = Number(input.getAttribute("data-idx"));
    if (currentConfig.comparison[idx]) currentConfig.comparison[idx].typical = input.value.trim();
  });
  document.querySelectorAll(".comp-field-hybrid").forEach(input => {
    const idx = Number(input.getAttribute("data-idx"));
    if (currentConfig.comparison[idx]) currentConfig.comparison[idx].hybrid = input.value.trim();
  });

  // 5. Pricing
  document.querySelectorAll(".pricing-field-name").forEach(input => {
    const idx = Number(input.getAttribute("data-idx"));
    if (currentConfig.pricing[idx]) currentConfig.pricing[idx].name = input.value.trim();
  });
  document.querySelectorAll(".pricing-field-badge").forEach(input => {
    const idx = Number(input.getAttribute("data-idx"));
    if (currentConfig.pricing[idx]) currentConfig.pricing[idx].badge = input.value.trim();
  });
  document.querySelectorAll(".pricing-field-m").forEach(input => {
    const idx = Number(input.getAttribute("data-idx"));
    if (currentConfig.pricing[idx]) currentConfig.pricing[idx].priceMonthly = Number(input.value);
  });
  document.querySelectorAll(".pricing-field-q").forEach(input => {
    const idx = Number(input.getAttribute("data-idx"));
    if (currentConfig.pricing[idx]) currentConfig.pricing[idx].priceQuarterly = Number(input.value);
  });
  document.querySelectorAll(".pricing-field-a").forEach(input => {
    const idx = Number(input.getAttribute("data-idx"));
    if (currentConfig.pricing[idx]) currentConfig.pricing[idx].priceAnnual = Number(input.value);
  });
  document.querySelectorAll(".pricing-field-featured").forEach(select => {
    const idx = Number(select.getAttribute("data-idx"));
    if (currentConfig.pricing[idx]) currentConfig.pricing[idx].isFeatured = select.value === "true";
  });
  document.querySelectorAll(".pricing-field-desc").forEach(input => {
    const idx = Number(input.getAttribute("data-idx"));
    if (currentConfig.pricing[idx]) currentConfig.pricing[idx].description = input.value.trim();
  });
  document.querySelectorAll(".pricing-field-features").forEach(input => {
    const idx = Number(input.getAttribute("data-idx"));
    if (currentConfig.pricing[idx]) {
      currentConfig.pricing[idx].features = input.value.split('\n').map(s => s.trim()).filter(Boolean);
    }
  });

  // 6. FAQs
  document.querySelectorAll(".faq-field-q").forEach(input => {
    const idx = Number(input.getAttribute("data-idx"));
    if (currentConfig.faqs[idx]) currentConfig.faqs[idx].q = input.value.trim();
  });
  document.querySelectorAll(".faq-field-a").forEach(input => {
    const idx = Number(input.getAttribute("data-idx"));
    if (currentConfig.faqs[idx]) currentConfig.faqs[idx].a = input.value.trim();
  });

  // Save to persistent storage and emit event
  saveSiteConfig(currentConfig);
  populateBackupTab();
  showToast("Changes Published!", "All updates are now live on the prototype website.", "success");
}
