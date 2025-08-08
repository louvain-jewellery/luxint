import { formatWithDots } from "../utils/number.js";

export function loadSales() {
  const selected = document.createElement("div");
  selected.classList.add(
    "employee-selector__selected-item",
    "js-selected-item"
  );

  fetch("data/sales.json")
    .then((response) => response.json())
    .then((data) => {
      const selectorList = document.querySelector(".js-selector-list");

      const savedSalesId = loadSelectedSales();

      data.forEach((sales) => {
        const selectorItem = document.createElement("li");
        selectorItem.classList.add(
          "employee-selector__item",
          "js-selector-item"
        );
        selectorItem.dataset.salesId = sales.id;

        const itemImage = document.createElement("img");
        itemImage.classList.add(
          "employee-selector__item-image",
          "js-selector-item-image"
        );
        itemImage.src = sales.image;
        itemImage.alt = sales.name;
        selectorItem.appendChild(itemImage);

        const itemName = document.createElement("p");
        itemName.classList.add(
          "employee-selector__item-name",
          "js-selector-item-name"
        );
        itemName.textContent = sales.name;
        selectorItem.appendChild(itemName);

        selectorList.appendChild(selectorItem);
      });

      selectorList.querySelectorAll(".js-selector-item").forEach((item) => {
        item.addEventListener("click", () => {
          const salesId = item.dataset.salesId;

          saveSelectedSales(salesId);
          item.appendChild(selected);
          loadCardData(salesId);
        });
      });

      if (savedSalesId) {
        const savedItem = selectorList.querySelector(
          `[data-sales-id="${savedSalesId}"]`
        );
        if (savedItem) {
          savedItem.appendChild(selected);

          const savedCardData = loadsavedCardData();

          loadCardData(savedSalesId);
        }
      }
    });
}

export function loadCardData(salesId) {
  const cardName = document.querySelector(".js-card-name");
  const cardId = document.querySelector(".js-card-id");
  const cardCustCount = document.querySelector(".js-card-customer-count");
  const cardImage = document.querySelector(".js-card-image");

  fetch("data/sales.json")
    .then((response) => response.json())
    .then((data) => {
      const sales = data.find((saleses) => saleses.id === salesId);

      cardId.textContent = `: ${sales.id}`;
      cardName.textContent = `: ${sales.name}`;
      cardCustCount.textContent = `: ${formatWithDots(sales.custCount)} orang`;
      cardImage.src = sales.image;

      saveCardData(sales);
    });
}

export function saveSelectedSales(salesId) {
  localStorage.setItem("selectedSales", salesId);
}

export function loadSelectedSales() {
  return localStorage.getItem("selectedSales");
}

export function saveCardData(cardData) {
  localStorage.setItem("savedCardData", JSON.stringify(cardData));
}

export function loadsavedCardData() {
  return JSON.parse(localStorage.getItem("savedCardData")) || {};
}
