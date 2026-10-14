/* ==========================================================================
   UNIVERSAL MODAL MANAGER & COACH APPLICATION FORM
   ========================================================================== */

import { showToast } from './toast.js';

export function initModals() {
  // Close triggers
  document.querySelectorAll(".modal-close").forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal-overlay");
      if (modal) modal.classList.remove("active");
    });
  });

  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("active");
      }
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay.active").forEach(m => m.classList.remove("active"));
    }
  });

  // Coach Application Modal Triggers
  document.querySelectorAll(".btn-open-coach-apply").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const modal = document.getElementById("coach-apply-modal");
      if (modal) modal.classList.add("active");
    });
  });

  const coachForm = document.getElementById("coach-application-form");
  if (coachForm) {
    coachForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const modal = document.getElementById("coach-apply-modal");
      if (modal) modal.classList.remove("active");
      showToast("Coach Application Received!", "Our athletic onboarding director will review your certifications and reply within 24 hours.", "success");
      coachForm.reset();
    });
  }

  // Newsletter form in footer
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Subscribed!", "You're now on our high-performance weekly research newsletter.", "success");
      newsletterForm.reset();
    });
  }
}
