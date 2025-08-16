import { closeOverlay, showOverlay } from "./overlay-manager.js";

export function showAddOverlay() {
  document
    .querySelector(".js-add-button")
    .addEventListener("click", async () => {
      const overlay = await showOverlay("add-item");

      overlay
        .querySelector(".js-close-button")
        .addEventListener("click", closeOverlay);

      overlay.addEventListener("click", (e) => {
        if (!e.target.closest(".js-overlay-wrapper")) {
          closeOverlay();
        }
      });
    });
}

function renderAddOverlay() {}
