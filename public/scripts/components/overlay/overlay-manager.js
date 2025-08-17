export async function showOverlay(overlayName) {
  try {
    const response = await fetch(`overlays/${overlayName}.html`);
    const html = await response.text();
    document.body.insertAdjacentHTML("beforeend", html);

    const overlay = document.querySelector(`.js-${overlayName}-overlay`);
    requestAnimationFrame(() => {
      overlay.classList.add("show");
    });
    document.body.style.overflow = "hidden";

    overlay.dataset.originalState = JSON.stringify(history.state);
    history.pushState({ overlay: overlayName }, "", window.location.href);

    const handlePopState = (event) => {
      if (
        !event.state?.overlay &&
        document.querySelector(`.js-${overlayName}-overlay`)
      ) {
        closeOverlay(overlayName, false);
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

export function closeOverlay(overlayName, shouldGoBack = true) {
  const overlay = document.querySelector(`.js-${overlayName}-overlay`);
  if (!overlay) return;

  overlay.classList.remove("show");
  document.body.style.overflow = "auto";

  const handler = overlay.dataset.popstateHandler;
  if (handler === "attached") {
    overlay.dataset.popstateHandler = "removed";
  }

  if (shouldGoBack && history.state?.overlay === overlayName) {
    history.back();
  }

  setTimeout(() => overlay.remove(), 300);
}
