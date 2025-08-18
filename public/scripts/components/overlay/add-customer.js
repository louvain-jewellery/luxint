import { closeOverlay, showOverlay } from "./overlay-manager.js";

export function showAddCustomerOverlay() {
  const button = document.querySelector(".js-add-customer-button");

  const newButton = button.cloneNode(true);
  button.parentNode.replaceChild(newButton, button);

  newButton.addEventListener("click", async () => {
    const overlay = await showOverlay("add-customer");

    overlay
      .querySelector(".js-close-button")
      .addEventListener("click", () => closeOverlay("add-customer"));

    overlay.addEventListener("click", (e) => {
      if (!e.target.closest(".js-overlay-wrapper")) {
        closeOverlay("add-customer");
      }
    });
  });
}
