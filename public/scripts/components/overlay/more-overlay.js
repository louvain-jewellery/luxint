import { generateInitials } from "../../utils/initials-generator.js";
import { closeOverlay, showOverlay } from "./overlay-manager.js";

async function renderOverlayData(customerId) {
  const overlay = document.querySelector(".js-overlay");
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

export function showMoreOverlay() {
  document.querySelectorAll(".js-more-button").forEach((button) => {
    button.addEventListener("click", async (e) => {
      if (document.querySelector(".js-overlay")) return;
      e.stopPropagation();
      const overlay = await showOverlay("more");

      const { customerId } = button.dataset;
      renderOverlayData(customerId);

      overlay.addEventListener("click", (e) => {
        if (
          !e.target.closest(".js-selected-item") &&
          !e.target.closest(".menu")
        ) {
          closeOverlay();
        }
      });
    });
  });
}
