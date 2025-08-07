import { formatWithDots } from "../utils/number.js";

export function loadSalesPerson() {
  const selected = document.createElement("div");
  selected.classList.add("employee-selector__selected-item");

  fetch("data/sales.json")
    .then((response) => response.json())
    .then((data) => {
      const selectorList = document.querySelector(".js-selector-list");

      data.forEach((person) => {
        const selectorItem = document.createElement("li");
        selectorItem.classList.add(
          "employee-selector__item",
          "js-selector-item"
        );
        selectorItem.dataset.itemId = person.id;

        const itemImage = document.createElement("img");
        itemImage.classList.add(
          "employee-selector__item-image",
          "js-selector-item-image"
        );
        itemImage.src = person.image;
        itemImage.alt = person.name;
        selectorItem.appendChild(itemImage);

        const itemName = document.createElement("p");
        itemName.classList.add(
          "employee-selector__item-name",
          "js-selector-item-name"
        );
        itemName.textContent = person.name;
        selectorItem.appendChild(itemName);

        selectorList.appendChild(selectorItem);
      });

      selectorList.querySelectorAll(".js-selector-item").forEach((item) => {
        item.addEventListener("click", () => {
          const id = item.dataset.itemId;

          item.appendChild(selected);
          loadCardData(id);
        });
      });
    });
}

export function loadCardData(id) {
  const cardName = document.querySelector(".js-card-name");
  const cardId = document.querySelector(".js-card-id");
  const cardCustCount = document.querySelector(".js-card-customer-count");
  const cardImage = document.querySelector(".js-card-image");

  fetch("data/sales.json")
    .then((response) => response.json())
    .then((data) => {
      const item = data.find((items) => items.id === id);
      cardId.textContent = `: ${item.id}`;
      cardName.textContent = `: ${item.name}`;
      cardCustCount.textContent = `: ${formatWithDots(item.custCount)} orang`;
      cardImage.src = item.image;
    });
}
