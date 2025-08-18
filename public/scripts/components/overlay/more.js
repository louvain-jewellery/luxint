import { generateInitials } from "../../utils/initials-generator.js";
import { closeOverlay, showOverlay } from "./overlay-manager.js";

export function showMoreOverlay() {
  document.querySelectorAll(".js-more-button").forEach((button) => {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    newButton.addEventListener("click", async (e) => {
      e.stopPropagation();
      const overlay = await showOverlay("more");

      const { customerId } = button.dataset;
      renderOverlayData(customerId, overlay);

      overlay.addEventListener("click", (e) => {
        if (
          !e.target.closest(".js-selected-item") &&
          !e.target.closest(".menu")
        ) {
          closeOverlay("more");
        }
      });
    });
  });
}

async function renderOverlayData(customerId, overlay) {
  const overlayIcon = overlay.querySelector(".js-overlay-icon");
  const overlayName = overlay.querySelector(".js-overlay-name");
  const overlayCount = overlay.querySelector(".js-overlay-count");
  try {
    const response = await fetch("/api/customers");
    const customers = await response.json();
    const customer = customers.find((c) => c.id === parseInt(customerId));

    overlayIcon.textContent = generateInitials(customer.name);
    overlayName.textContent = customer.name;
    overlayCount.textContent = `??? items`;
  } catch (err) {
    console.error("failed to fetch overlay: ", err);

    overlayIcon.textContent = "!";
    overlayName.textContent = "Error loading customer";
    overlayCount.textContent = "Unable to load items";
  }
}
