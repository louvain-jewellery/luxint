import { generateInitials } from "../../utils/initials-generator.js";
import { mapItemCount } from "../../utils/item-count.js";

function renderMoreOverlayData(customerId) {
  const moreOverlay = document.querySelector(".js-more-overlay");
  const moreOverlayIcon = moreOverlay.querySelector(".js-overlay-icon");
  const moreOverlayName = moreOverlay.querySelector(".js-overlay-name");
  const moreOverlayCount = moreOverlay.querySelector(".js-overlay-count");

  Promise.all([
    fetch("data/customers.json").then((response) => response.json()),
    fetch("data/purchased-items.json").then((response) => response.json()),
  ]).then(([customersData, itemsData]) => {
    const customer = customersData.find(
      (customer) => customer.id === customerId
    );

    const itemCountMap = mapItemCount(itemsData);
    const itemCount = itemCountMap[customer.id] || 0;
    const itemText = itemCount <= 1 ? "item" : "items";

    moreOverlayIcon.textContent = generateInitials(customer.name);
    moreOverlayName.textContent = customer.name;
    moreOverlayCount.textContent = `${itemCount} ${itemText}`;
  });
}

export function showMoreOverlay() {
  const moreOverlay = document.querySelector(".js-more-overlay");

  document.querySelectorAll(".js-more-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const { customerId } = button.dataset;
      moreOverlay.classList.add("active");
      document.body.style.overflow = "hidden";

      renderMoreOverlayData(customerId);
    });
  });
}

export function hideMoreOverlay() {
  const moreOverlay = document.querySelector(".js-more-overlay");
  moreOverlay.addEventListener("click", (e) => {
    if (!e.target.closest(".js-selected-item") && !e.target.closest(".menu")) {
      moreOverlay.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });
}
