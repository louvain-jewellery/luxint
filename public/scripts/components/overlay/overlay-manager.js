export async function showOverlay(overlayName) {
  try {
    const response = await fetch(`overlays/${overlayName}.html`);
    const html = await response.text();
    document.body.insertAdjacentHTML("beforeend", html);

    const overlay = document.querySelector(".js-overlay");
    setTimeout(() => overlay.classList.add("show"), 10);
    document.body.style.overflow = "hidden";

    history.pushState({ overlayOpen: true }, "", location.href);

    function handleBackButton(event) {
      if (event.state && event.state.overlayOpen) {
        closeOverlay();
        window.removeEventListener("popstate", handleBackButton);
      }
    }

    window.addEventListener("popstate", handleBackButton);

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

  if (history.state && history.state.overlayOpen) {
    history.back();
  }
}
