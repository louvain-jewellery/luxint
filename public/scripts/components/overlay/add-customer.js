import { closeOverlay, showOverlay } from "./overlay-manager.js";

export function showAddCustomerOverlay() {
  document
    .querySelector(".js-add-customer-button")
    .addEventListener("click", async () => {
      const overlay = await showOverlay("add-customer");

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
