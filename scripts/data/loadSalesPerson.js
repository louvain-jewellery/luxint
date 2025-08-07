import { formatWithDots } from "../utils/number.js";

export function loadSalesPerson() {
  const selected = document.createElement("div");
  selected.classList.add(
    "employee-selector__selected-item",
    "js-selected-item"
  );

  fetch("data/sales.json")
    .then((response) => response.json())
    .then((data) => {
      const selectorList = document.querySelector(".js-selector-list");

      const savedId = loadSelectedSales();

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

          saveSelectedSales(id);
          item.appendChild(selected);
          loadCardData(id);
        });
      });

      if (savedId) {
        const savedItem = selectorList.querySelector(
          `[data-item-id="${savedId}"]`
        );
        if (savedItem) {
          savedItem.appendChild(selected);

          const savedCardData = loadsavedCardData();
          if (savedCardData && Object.keys(savedCardData).length > 0) {
            loadCardData(savedId);
          } else {
            loadCardData(id);
          }
        }
      }
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
      const savedCardData = loadsavedCardData();
      const item =
        savedCardData && Object.keys(savedCardData).length > 0
          ? savedCardData
          : data.find((items) => items.id === id);

      cardId.textContent = `: ${item.id}`;
      cardName.textContent = `: ${item.name}`;
      cardCustCount.textContent = `: ${formatWithDots(item.custCount)} orang`;
      cardImage.src = item.image;

      saveCardData(item);
    });
}

export function saveSelectedSales(personId) {
  localStorage.setItem("selectedSalesPerson", personId);
}

export function loadSelectedSales() {
  return localStorage.getItem("selectedSalesPerson");
}

export function saveCardData(cardData) {
  localStorage.setItem("savedCardData", JSON.stringify(cardData));
}

export function loadsavedCardData() {
  return JSON.parse(localStorage.getItem("savedCardData")) || {};
}
