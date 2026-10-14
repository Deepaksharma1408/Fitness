/* ==========================================================================
   INTERACTIVE ONBOARDING & COACH MATCHING QUIZ
   ========================================================================== */

import { getCoachesData } from './data.js';
import { showToast } from './toast.js';

export function initCoachQuiz() {
  const quizModal = document.getElementById("quiz-modal");
  const openQuizBtns = document.querySelectorAll(".btn-open-quiz");
  const quizNextBtn = document.getElementById("quiz-next-btn");
  const quizPrevBtn = document.getElementById("quiz-prev-btn");

  let currentStep = 1;
  const totalSteps = 3;
  let userAnswers = {
    goal: "hypertrophy",
    gear: "gym",
    style: "video"
  };

  openQuizBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openQuiz();
    });
  });

  function openQuiz() {
    currentStep = 1;
    renderStep(1);
    if (quizModal) quizModal.classList.add("active");
  }

  // Option selection
  document.querySelectorAll(".quiz-option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const step = btn.closest(".quiz-step").getAttribute("data-step");
      const parent = btn.parentElement;
      parent.querySelectorAll(".quiz-option-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const val = btn.getAttribute("data-value");
      if (step === "1") userAnswers.goal = val;
      if (step === "2") userAnswers.gear = val;
      if (step === "3") userAnswers.style = val;
    });
  });

  if (quizNextBtn) {
    quizNextBtn.addEventListener("click", () => {
      if (currentStep < totalSteps) {
        currentStep++;
        renderStep(currentStep);
      } else {
        renderResults();
      }
    });
  }

  if (quizPrevBtn) {
    quizPrevBtn.addEventListener("click", () => {
      if (currentStep > 1) {
        currentStep--;
        renderStep(currentStep);
      }
    });
  }

  function renderStep(step) {
    document.querySelectorAll(".quiz-step").forEach(s => {
      s.style.display = s.getAttribute("data-step") === String(step) ? "block" : "none";
    });

    const stepIndicator = document.getElementById("quiz-step-indicator");
    if (stepIndicator) stepIndicator.textContent = `Step ${step} of ${totalSteps}`;

    const progressFill = document.getElementById("quiz-progress-fill");
    if (progressFill) progressFill.style.width = `${(step / totalSteps) * 100}%`;

    if (quizPrevBtn) quizPrevBtn.style.visibility = step === 1 ? "hidden" : "visible";
    if (quizNextBtn) quizNextBtn.textContent = step === totalSteps ? "Generate Coach Match →" : "Continue →";
  }

  function renderResults() {
    document.querySelectorAll(".quiz-step").forEach(s => s.style.display = "none");
    const resultsContainer = document.getElementById("quiz-results-container");
    if (resultsContainer) resultsContainer.style.display = "block";
    if (quizNextBtn) quizNextBtn.style.display = "none";
    if (quizPrevBtn) quizPrevBtn.style.display = "none";

    // Match Coach Algorithm
    const coachesList = getCoachesData();
    let matchedCoach = coachesList[0] || {};
    if (userAnswers.goal === "fatloss" && coachesList[1]) matchedCoach = coachesList[1];
    if ((userAnswers.goal === "rehab" || userAnswers.gear === "gym_power") && coachesList[2]) matchedCoach = coachesList[2];

    const matchCard = document.getElementById("quiz-matched-coach-card");
    if (matchCard) {
      matchCard.innerHTML = `
        <div style="display: flex; gap: 1.25rem; align-items: center; margin-bottom: 1.25rem;">
          <img src="${matchedCoach.image}" alt="${matchedCoach.name}" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary);" />
          <div>
            <div style="font-size: 0.75rem; font-weight: 800; color: var(--accent-emerald); text-transform: uppercase;">98.4% Compatibility Match</div>
            <h4 style="font-size: 1.3rem; font-weight: 800;">${matchedCoach.name}</h4>
            <div style="font-size: 0.825rem; color: var(--primary); font-weight: 700;">${matchedCoach.title}</div>
          </div>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1rem;">
          "${matchedCoach.bio}"
        </p>
        <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1rem; margin-bottom: 1.25rem;">
          <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--text-main); margin-bottom: 0.5rem;">Estimated 12-Week Trajectory:</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.8rem;">
            <div>⚡ <strong>Target:</strong> ${userAnswers.goal === "fatloss" ? "-18 lbs Fat Loss" : "+7-10 lbs Lean Mass"}</div>
            <div>💪 <strong>Cadence:</strong> 4 Sessions / Week</div>
            <div>🥗 <strong>Nutrition:</strong> Daily Custom Macros</div>
            <div>📹 <strong>Consults:</strong> Weekly 1-on-1 Video</div>
          </div>
        </div>
        <button id="claim-coach-match-btn" class="btn btn-primary btn-full">
          Claim Free Consultation with ${matchedCoach.name} →
        </button>
      `;

      const claimBtn = document.getElementById("claim-coach-match-btn");
      if (claimBtn) {
        claimBtn.addEventListener("click", () => {
          if (quizModal) quizModal.classList.remove("active");
          showToast("Match Confirmed!", `Consultation scheduled with ${matchedCoach.name}. Check your email for call credentials.`, "success");
        });
      }
    }
  }
}
