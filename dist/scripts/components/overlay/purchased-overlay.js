import { formatWithDots } from "../../utils/number.js";

export function showPurchasedOverlay() {
  const overlay = document.querySelector(".js-purchased-overlay");

  document.querySelectorAll(".js-purchased-items").forEach((item) => {
    item.addEventListener("click", () => {
      const { itemId } = item.dataset;

      overlay.classList.add("visible");
      document.body.style.overflow = "hidden";

      renderPurchasedOverlay(itemId);
    });
  });
}

function renderPurchasedOverlay(itemId) {
  const overlay = document.querySelector(".js-purchased-overlay");
  const name = overlay.querySelector(".js-item-name");
  const image = overlay.querySelector(".js-item-image");
  const date = overlay.querySelector(".js-item-date");
  const type = overlay.querySelector(".js-item-type");
  const weight = overlay.querySelector(".js-item-weight");
  const goldPurity = overlay.querySelector(".js-item-gold");
  const price = overlay.querySelector(".js-item-price");

  fetch("data/purchased-items.json")
    .then((response) => response.json())
    .then((data) => {
      const item = data.find((item) => item.id === itemId);
      name.textContent = item.itemName;
      image.src = item.productImage;
      image.alt = item.itemName;
      date.textContent = item.date;
      type.textContent = item.type;
      weight.textContent = `${item.weight} gr`;
      goldPurity.textContent = `${item.goldPurity}%`;
      price.textContent = `Rp.${formatWithDots(item.sellingPrice)}`;
    });
}

export function hidePurchasedOverlay() {
  const overlay = document.querySelector(".js-purchased-overlay");

  overlay.querySelector(".js-close-button").addEventListener("click", (e) => {
    overlay.classList.remove("visible");
    document.body.style.overflow = "auto";
  });
}
