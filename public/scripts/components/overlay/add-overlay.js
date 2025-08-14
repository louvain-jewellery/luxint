import { closeOverlay, showOverlay } from "./overlay-manager.js";

export function showAddOverlay() {
  document
    .querySelector(".js-add-button")
    .addEventListener("click", async () => {
      if (document.querySelector(".js-overlay")) return;
      const overlay = await showOverlay("add-item");

      const closeButton = overlay.querySelector(".js-close-button");
      closeButton.addEventListener("click", closeOverlay);
      overlay.addEventListener("click", (e) => {
        if (!e.target.closest(".js-add-overlay-wrapper")) {
          closeOverlay();
        }
      });
    });
}
