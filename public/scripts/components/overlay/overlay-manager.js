export async function showOverlay(overlayName) {
  try {
    const response = await fetch(`overlays/${overlayName}.html`);
    const html = await response.text();
    document.body.insertAdjacentHTML("beforeend", html);

    const overlay = document.querySelector(".js-overlay");
    setTimeout(() => overlay.classList.add("show"), 10);
    document.body.style.overflow = "hidden";

    history.pushState({ overlay: overlayName }, "", window.location.href);

    if (!window.overlayBackHandler) {
      window.overlayBackHandler = true;
      window.addEventListener("popstate", (event) => {
        const currentOverlay = document.querySelector(".js-overlay");
        if (currentOverlay && !event.state?.overlay) {
          closeOverlay();
        }
      });
    }

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
