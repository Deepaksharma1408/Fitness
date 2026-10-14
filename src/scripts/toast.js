/* ==========================================================================
   TOAST NOTIFICATION UTILITY
   ========================================================================== */

export function showToast(title, description, type = "info") {
  // Only permit toasts within the admin control panel; suppress all popups on the website
  const isAdmin = typeof window !== "undefined" && window.location.pathname.includes("admin.html");
  if (!isAdmin) {
    return;
  }

  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  const icon = type === "success" ? "✓" : "⚡";

  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-desc">${description}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}
