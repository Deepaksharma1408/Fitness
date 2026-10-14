/* ==========================================================================
   HERO SMARTPHONE APP SIMULATOR
   Interactive live workout tracker, rest timer, macros ring, and video consultation
   ========================================================================== */

import { showToast } from './toast.js';

export function initAppSimulator() {
  const tabs = document.querySelectorAll(".phone-tab-btn");
  const tabWorkout = document.getElementById("phone-tab-workout");
  const tabNutrition = document.getElementById("phone-tab-nutrition");
  const tabVideo = document.getElementById("phone-tab-video");
  const tabTelemetry = document.getElementById("phone-tab-telemetry");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const target = tab.getAttribute("data-tab");
      if (tabWorkout) tabWorkout.style.display = target === "workout" ? "flex" : "none";
      if (tabNutrition) tabNutrition.style.display = target === "nutrition" ? "flex" : "none";
      if (tabVideo) tabVideo.style.display = target === "video" ? "flex" : "none";
      if (tabTelemetry) tabTelemetry.style.display = target === "telemetry" ? "flex" : "none";
    });
  });

  // Calendar Day Clicker
  document.querySelectorAll(".cal-day").forEach(day => {
    day.addEventListener("click", () => {
      document.querySelectorAll(".cal-day").forEach(d => d.classList.remove("active"));
      day.classList.add("active");
    });
  });

  // 1. Rest Timer State
  let timerSeconds = 30;
  let timerInterval = null;
  let isTimerRunning = false;
  const timerDisplay = document.getElementById("rest-timer-display");
  const timerToggleBtn = document.getElementById("timer-toggle-btn");
  const timerResetBtn = document.getElementById("timer-reset-btn");

  function updateTimerText() {
    if (!timerDisplay) return;
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  if (timerToggleBtn) {
    timerToggleBtn.addEventListener("click", () => {
      if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        timerToggleBtn.textContent = "Resume";
      } else {
        isTimerRunning = true;
        timerToggleBtn.textContent = "Pause";
        timerInterval = setInterval(() => {
          if (timerSeconds > 0) {
            timerSeconds--;
            updateTimerText();
          } else {
            clearInterval(timerInterval);
            isTimerRunning = false;
            timerToggleBtn.textContent = "Start";
            timerDisplay.classList.add("pulsing-timer");
            showToast("Rest Period Complete!", "Time for Set 3! Get under the bar.", "success");
            setTimeout(() => timerDisplay.classList.remove("pulsing-timer"), 1000);
          }
        }, 1000);
      }
    });
  }

  if (timerResetBtn) {
    timerResetBtn.addEventListener("click", () => {
      clearInterval(timerInterval);
      isTimerRunning = false;
      timerSeconds = 45;
      updateTimerText();
      if (timerToggleBtn) timerToggleBtn.textContent = "Start";
    });
  }

  // 2. Set Logger & Weight Counter
  let currentReps = 10;
  let currentWeight = 225;
  const repsVal = document.getElementById("app-reps-val");
  const weightVal = document.getElementById("app-weight-val");
  const logSetBtn = document.getElementById("app-log-set-btn");

  const repPlus = document.getElementById("rep-plus");
  const repMinus = document.getElementById("rep-minus");
  if (repPlus) {
    repPlus.addEventListener("click", () => {
      currentReps++;
      if (repsVal) repsVal.textContent = `${currentReps} reps`;
    });
  }
  if (repMinus) {
    repMinus.addEventListener("click", () => {
      if (currentReps > 1) currentReps--;
      if (repsVal) repsVal.textContent = `${currentReps} reps`;
    });
  }

  if (logSetBtn) {
    logSetBtn.addEventListener("click", () => {
      showToast("Set 2 Logged!", `${currentWeight} lbs x ${currentReps} reps saved to cloud telemetry`, "success");
      // Auto-start 30s rest timer
      timerSeconds = 30;
      updateTimerText();
      if (timerToggleBtn && !isTimerRunning) timerToggleBtn.click();
    });
  }

  // 3. Nutrition Interactive Log Button
  let loggedProtein = 195;
  let loggedCals = 2450;
  const logMealBtn = document.getElementById("app-log-meal-btn");
  const proteinVal = document.getElementById("app-protein-val");
  const calsVal = document.getElementById("app-cals-val");

  if (logMealBtn) {
    logMealBtn.addEventListener("click", () => {
      loggedProtein += 25;
      loggedCals += 180;
      if (proteinVal) proteinVal.textContent = `${loggedProtein}g`;
      if (calsVal) calsVal.textContent = `${loggedCals} kcal`;
      showToast("Post-Workout Shake Logged!", "+25g Whey Isolate, +180 kcal updated", "success");
    });
  }

  // 4. Video Call Mute & Switch Controls
  const videoMuteBtn = document.getElementById("video-mute-btn");
  if (videoMuteBtn) {
    let muted = false;
    videoMuteBtn.addEventListener("click", () => {
      muted = !muted;
      videoMuteBtn.style.background = muted ? "rgba(239, 68, 68, 0.4)" : "rgba(255, 255, 255, 0.1)";
    });
  }
}
