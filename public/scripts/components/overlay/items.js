import { formatWithDots } from "../../utils/number.js";
import { closeOverlay, showOverlay } from "./overlay-manager.js";

export function showPurchasedOverlay(itemsData) {
  document.querySelectorAll(".js-purchased-items").forEach((item) => {
    const newItem = item.cloneNode(true);
    item.parentNode.replaceChild(newItem, item);

    newItem.addEventListener("click", async () => {
      const overlay = await showOverlay("purchased-item");
      const itemId = parseInt(item.dataset.itemId);
      renderOverlay(itemId, itemsData, overlay);

      overlay
        .querySelector(".js-close-button")
        .addEventListener("click", () => {
          closeOverlay("purchased-item");
        });
    });
  });
}

function renderOverlay(itemId, itemsData, overlay) {
  const item = itemsData.find((item) => item.id === parseInt(itemId));
  overlay.querySelector(".js-item-name").textContent = item.itemName;
  overlay.querySelector(".js-item-image").src = item.productImage;
  overlay.querySelector(".js-item-image").alt = item.itemName;
  overlay.querySelector(".js-item-date").textContent = item.date;
  overlay.querySelector(".js-item-type").textContent = item.type;
  overlay.querySelector(".js-item-weight").textContent = `${item.weight} gr`;
  overlay.querySelector(".js-item-gold").textContent = `${item.goldPurity}%`;
  overlay.querySelector(".js-item-price").textContent = `Rp.${formatWithDots(
    item.sellingPrice
  )}`;
}
