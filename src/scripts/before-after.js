/* ==========================================================================
   INTERACTIVE BEFORE / AFTER SLIDER (FULLY RESPONSIVE)
   ========================================================================== */

export function initBeforeAfterSlider() {
  const container = document.getElementById("ba-slider-container");
  const afterWrapper = document.getElementById("ba-after-wrapper");
  const handle = document.getElementById("ba-handle");

  if (!container || !afterWrapper || !handle) return;

  const afterImg = afterWrapper.querySelector("img");

  function syncImageWidth() {
    if (!container || !afterImg) return;
    const width = container.offsetWidth;
    afterImg.style.width = `${width}px`;
    afterImg.style.maxWidth = "none";
  }

  window.addEventListener("resize", syncImageWidth);
  syncImageWidth();

  let isDragging = false;

  function updateSlider(xPos) {
    const rect = container.getBoundingClientRect();
    let x = xPos - rect.left;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percentage = (x / rect.width) * 100;
    afterWrapper.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  // Mouse Events
  handle.addEventListener("mousedown", (e) => {
    isDragging = true;
    e.preventDefault();
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  container.addEventListener("click", (e) => {
    updateSlider(e.clientX);
  });

  // Touch Events for Mobile & Tablets
  handle.addEventListener("touchstart", (e) => {
    isDragging = true;
  }, { passive: true });

  window.addEventListener("touchend", () => {
    isDragging = false;
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging || !e.touches[0]) return;
    updateSlider(e.touches[0].clientX);
  }, { passive: true });
}
