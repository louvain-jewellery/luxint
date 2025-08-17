import { formatWithDots } from "../../utils/number.js";
import { closeOverlay, showOverlay } from "./overlay-manager.js";

export function showPurchasedOverlay() {
  document.querySelectorAll(".js-purchased-items").forEach((item) => {
    item.addEventListener("click", async () => {
      const overlay = await showOverlay("purchased-item");
      const itemId = parseInt(item.dataset.itemId);
      renderPurchasedOverlay(itemId, overlay);

      overlay
        .querySelector(".js-close-button")
        .addEventListener("click", () => {
          closeOverlay("purchased-item");
        });
    });
  });
}

async function renderPurchasedOverlay(itemId, overlay) {
  const name = overlay.querySelector(".js-item-name");
  const image = overlay.querySelector(".js-item-image");
  const date = overlay.querySelector(".js-item-date");
  const type = overlay.querySelector(".js-item-type");
  const weight = overlay.querySelector(".js-item-weight");
  const goldPurity = overlay.querySelector(".js-item-gold");
  const price = overlay.querySelector(".js-item-price");

  try {
    const response = await fetch("/api/items");
    const items = await response.json();
    const item = items.find((item) => item.id === parseInt(itemId));
    name.textContent = item.itemName;
    image.src = item.productImage;
    image.alt = item.itemName;
    date.textContent = item.date;
    type.textContent = item.type;
    weight.textContent = `${item.weight} gr`;
    goldPurity.textContent = `${item.goldPurity}%`;
    price.textContent = `Rp.${formatWithDots(item.sellingPrice)}`;
  } catch (err) {
    console.error("failed to fetch overlay: ", err);
  }
}
