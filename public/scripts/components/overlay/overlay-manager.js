export async function showOverlay(overlayName) {
  try {
    const response = await fetch(`overlays/${overlayName}.html`);
    const html = await response.text();
    document.body.insertAdjacentHTML("beforeend", html);

    const overlay = document.querySelector(`.js-${overlayName}-overlay`);
    setTimeout(() => overlay.classList.add("show"), 10);
    document.body.style.overflow = "hidden";

    overlay.dataset.originalState = JSON.stringify(history.state);
    history.pushState({ overlay: overlayName }, "", window.location.href);

    const handlePopState = (event) => {
      if (!event.state?.overlay && document.querySelector(".js-overlay")) {
        closeOverlay();
        window.removeEventListener("popstate", handlePopState);
      }
    };

    window.addEventListener("popstate", handlePopState);
    overlay.dataset.popstateHandler = "attached";

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
