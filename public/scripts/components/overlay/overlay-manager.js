export async function showOverlay(overlayName) {
  try {
    const response = await fetch(`overlays/${overlayName}.html`);
    const html = await response.text();
    document.body.insertAdjacentHTML("beforeend", html);

    const overlay = document.querySelector(".js-overlay");
    requestAnimationFrame(() => {
      overlay.classList.add("show");
    });
    document.body.style.overflow = "hidden";
    return overlay;
  } catch (error) {
    throw new Error(`Failed to fetch overlay: ${error}`);
  }
}

export function closeOverlay() {
  const overlay = document.querySelector(".js-overlay");
  if (!overlay) return;

  overlay.classList.remove("show");
  document.body.style.overflow = "auto";
  setTimeout(() => overlay.remove(), 300);
}
