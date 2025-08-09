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
      selectorList.innerHTML = "";

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

      if (!savedSalesId) {
        const cardDetail = document.querySelector(".js-card-detail");
        cardDetail.innerHTML = "";

        const p = document.createElement("p");
        p.classList.add("employee-card__warning");
        p.textContent = "Pilih sales terlebih dahulu";

        cardDetail.appendChild(p);
        return;
      } else {
        const savedItem = selectorList.querySelector(
          `[data-sales-id="${savedSalesId}"]`
        );
        if (savedItem) {
          savedItem.appendChild(selected);

          const savedCardData = loadSavedCardData();

          loadCardData(savedSalesId);
        }
      }
    });
}

export function loadCardData(salesId) {
  const cardDetail = document.querySelector(".js-card-detail");
  cardDetail.innerHTML = "";

  fetch("data/sales.json")
    .then((response) => response.json())
    .then((data) => {
      const sales = data.find((saleses) => saleses.id === salesId);

      cardDetail.innerHTML = `
          <div class="employee-card__detail">
            <div class="employee-card__detail-row">
              <p class="employee-card__detail-title">ID</p>
              <p class="employee-card__detail-content js-card-id">: ${
                sales.id
              }</p>
            </div>
            <div class="employee-card__detail-row">
              <p class="employee-card__detail-title">Nama</p>
              <p class="employee-card__detail-content js-card-name">: ${
                sales.name
              }</p>
            </div>
            <div class="employee-card__detail-row">
              <p class="employee-card__detail-title">Langganan</p>
              <p class="employee-card__detail-content js-card-customer-count">: ${formatWithDots(
                sales.custCount
              )} orang</p>
            </div>
          </div>
          <div class="employee-card__image-wrapper">
            <img class="employee-card__image js-card-image" src=${
              sales.image
            } alt="card pfp" />
          </div>
        `;

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

export function loadSavedCardData() {
  return JSON.parse(localStorage.getItem("savedCardData")) || {};
}
